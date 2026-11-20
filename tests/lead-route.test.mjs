import assert from "node:assert/strict";
import test from "node:test";
import { prove } from "./lead-proof-fixture.mjs";
import { loadModule } from "./module-loader.mjs";

const sentinel = "recaptcha-staging-bypass-key";
const previewHost = "tubro-construction-website-test-mega-websites.vercel.app";
const valid = { form_key: "schedule_estimate", form_data: { name: "Local Test", phone: "2532162633", email: "test@example.com", projectDetails: "Intercepted local test only", projectType: "Kitchen or bathroom remodel", consent: true }, captchaToken: sentinel };
const previewEnv = { VERCEL_ENV: "preview", VERCEL_URL: previewHost, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: sentinel };

function boundary(env = previewEnv, assessment = {}, upstream = () => Response.json({ ok: true })) {
  const requests = [];
  const fetch = async (url, options) => {
    requests.push({ url, body: JSON.parse(options.body), bytes: options.body, headers: options.headers });
    if (url.startsWith("https://recaptchaenterprise.googleapis.com/")) return Response.json(assessment);
    assert.equal(url, "https://analytics.gomega.ai/submission/submit");
    return upstream(requests.at(-1));
  };
  const route = loadModule("app/api/lead/route.ts", { process: { env }, fetch });
  const post = (body, hostname = previewHost, headers = {}) => route.POST(new Request(`https://${hostname}/api/lead`, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }));
  return { post, requests, route };
}

test("actual handler accepts sanctioned sentinel, fixes identity and sends canonical keys", async () => {
  const { post, requests } = boundary();
  const response = await post({ ...valid, customer_id: "spoof", site_id: "spoof", source_provider: "spoof" });
  assert.equal(response.status, 200); assert.equal(requests.length, 1);
  assert.equal(requests[0].body.customer_id, "b002784f-9543-4362-8814-b7da19078f23");
  assert.equal(requests[0].body.site_id, "f28d515e-437b-4f9b-96c4-bc1a79a3357c");
  assert.equal(requests[0].body.source_provider, "website-tubroconstruction");
  assert.equal(requests[0].body.form_data.consent, true);
  assert.equal(requests[0].body.form_data.spamCheck, "Passed reCAPTCHA");
  assert.equal("captchaToken" in requests[0].body, false);
});

test("actual handler rejects malformed, oversized, invalid, spoofed field and cross-origin requests before forwarding", async () => {
  const { post, requests } = boundary();
  for (const body of ["{", "null", "[]", '"string"', "x".repeat(25000)]) assert.equal((await post(body)).status, 400);
  for (const fields of [{ phone: "55512" }, { phone: "17576855050" }, { phone: "123456789" }, { email: "me@x" }, { consent: "yes" }, { consent: false }, { name: "" }, { projectDetails: " " }, { projectType: "" }, { projectType: "Invented option" }, { first_name: "duplicate" }, { projectCity: {} }, { spamCheck: "Passed reCAPTCHA" }]) {
    assert.equal((await post({ ...valid, form_data: { ...valid.form_data, ...fields } })).status, 422);
  }
  assert.equal((await post(valid, previewHost, { Origin: "https://attacker.test" })).status, 403);
  assert.equal((await post(valid, "attacker.vercel.app")).status, 403);
  for (const token of ["", "lead-submit", "random-nonempty"]) assert.equal((await post({ ...valid, captchaToken: token })).status, 403);
  assert.equal(requests.length, 0);
});

test("production assessment checks action, hostname and score; never accepts sentinel", async () => {
  const env = { VERCEL_ENV: "production", RECAPTCHA_HOSTNAMES: "www.tubroconstruction.com", NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "test-site-key", RECAPTCHA_PROJECT_ID: "local-test", RECAPTCHA_API_KEY: "local-test" };
  const assessment = { tokenProperties: { valid: true, action: "lead_submit", hostname: "www.tubroconstruction.com" }, riskAnalysis: { score: 0.9, reasons: [] } };
  const { post, requests } = boundary(env, assessment);
  assert.equal((await post(valid, "www.tubroconstruction.com")).status, 403);
  assert.equal((await post({ ...valid, captchaToken: "minted-test-token" }, "www.tubroconstruction.com")).status, 200);
  assert.equal(requests.length, 2);
  assert.equal(requests[0].body.event.expectedAction, "lead_submit");
  assert.equal(requests[1].body.form_data.spamCheck, "Passed reCAPTCHA");
  assert.equal("proof_claim" in requests[1].body, false);
  assert.equal("x-mega-proof-claim-token" in requests[1].headers, false);
  for (const changed of [{ ...assessment, tokenProperties: { ...assessment.tokenProperties, hostname: "attacker.test" } }, { ...assessment, tokenProperties: { ...assessment.tokenProperties, action: "other" } }, { ...assessment, riskAnalysis: { score: 0.1 } }]) {
    const api = boundary(env, changed);
    assert.equal((await api.post({ ...valid, captchaToken: "minted-test-token" }, "www.tubroconstruction.com")).status, 403);
    assert.equal(api.requests.length, 1);
  }
});

const host = "www.tubroconstruction.com";
const productionEnv = { VERCEL_ENV: "production", RECAPTCHA_HOSTNAMES: host, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "test-site-key" };
const verifiedEnv = { ...productionEnv, RECAPTCHA_PROJECT_ID: "test", RECAPTCHA_API_KEY: "test" };
const passing = { tokenProperties: { valid: true, action: "lead_submit", hostname: host }, riskAnalysis: { score: 0.9, reasons: [] } };
const { captchaToken: _token, ...payload } = valid;
const minted = { ...payload, captchaToken: "minted-test-token" };

test("the retired proof-of-work challenge is no longer served", () => {
  const { route } = boundary(productionEnv);
  assert.equal(route.GET, undefined);
});

test("production fails closed for absent/invalid tokens, forbidden keys and honeypots", async () => {
  const api = boundary(productionEnv);
  for (const change of [{}, { captchaToken: sentinel }, { captchaToken: "lead-submit" }, { captchaToken: "random" }, { powIssuedAt: String(Date.now()), powNonce: "0" }]) {
    assert.equal((await api.post({ ...payload, ...change }, host)).status, 403);
  }
  for (const change of [{ form_key: "unsupported" }, { form_key: "estimate_privacy" }, { form_key: "estimate_blog" }, { form_key: "estimate_homepage" }, { proof_claim: {} }, { attempt_id: "supplied" }, { token: "a".repeat(64) }]) {
    assert.equal((await api.post({ ...payload, captchaToken: sentinel, ...change }, host)).status, 422);
  }
  assert.equal(api.requests.length, 0);
  const verified = boundary(verifiedEnv, passing);
  assert.equal((await verified.post({ ...minted, website: "spam.test" }, host)).status, 403);
  assert.equal(verified.requests.length, 0, "a filled honeypot is refused before any assessment");
});

test("missing verification refuses canonical and foreign JSON before schema disclosure or external calls", async () => {
  const api = boundary(verifiedEnv);
  const foreign = { ...payload.form_data, form_key: "contact-form", company: "", context: { url: `https://${host}/contact` }, utm_source: null, captchaAction: "lead_submit" };
  for (const body of [payload, { ...payload, website: "" }, {}, foreign, { ...foreign, form_data: { ...payload.form_data, form_key: "contact-form" } }]) {
    for (const material of [{}, { captchaToken: "" }, { captchaToken: " \t" }, { captchaToken: null }, { captchaToken: {} }, { powIssuedAt: String(Date.now()) }, { powNonce: "0" }, { powIssuedAt: "", powNonce: "0" }, { powIssuedAt: String(Date.now()), powNonce: "0" }]) {
      const response = await api.post({ ...body, ...material }, host);
      assert.equal(response.status, 403);
      const result = await response.json();
      assert.equal(result.code, "verification_failed");
      assert.match(result.error, /refresh the page and try again/);
      assert.equal("errors" in result, false);
      assert.equal(api.requests.length, 0, "no assessment or delivery on refusal");
    }
  }
});

test("purported verification never bypasses strict fields, defaults or honeypots", async () => {
  const api = boundary(verifiedEnv, passing);
  for (const change of [{ context: {} }, { form_key: "contact-form" }, { form_key: "defaultkey" }, { form_data: { ...payload.form_data, first_name: "duplicate" } }, { form_data: { ...payload.form_data, form_key: payload.form_key } }]) {
    const response = await api.post({ ...minted, ...change }, host);
    assert.equal(response.status, 422);
    assert.ok((await response.json()).errors.form);
    assert.equal(api.requests.length, 0, "fields are checked before Enterprise or forwarding");
  }
  for (const body of [{ ...payload, captchaToken: sentinel }, { ...payload, captchaToken: "lead-submit" }, { ...minted, website: "spam.test" }]) {
    const response = await api.post(body, host);
    assert.equal(response.status, 403);
    assert.equal((await response.json()).code, "verification_failed");
    assert.equal(api.requests.length, 0, "a filled honeypot or sentinel never reaches Enterprise");
  }
});

test("a solved proof of work no longer delivers a lead, with or without a failed reCAPTCHA token", async () => {
  for (const [assessment, body] of [[{}, prove(payload)], [{ tokenProperties: { valid: false } }, prove({ ...payload, captchaToken: "failed-real-token" })], [{ ...passing, riskAnalysis: { score: 0.1 } }, prove({ ...payload, captchaToken: "low-score-token" })]]) {
    const api = boundary(verifiedEnv, assessment);
    const response = await api.post(body, host);
    assert.equal(response.status, 403);
    assert.equal((await response.json()).code, "verification_failed");
    assert.ok(api.requests.every((request) => !request.url.startsWith("https://analytics.gomega.ai/")), "nothing is forwarded to the CRM");
  }
});

test("a verified lead is forwarded once, labelled as passing reCAPTCHA, without verification material", async () => {
  const api = boundary(verifiedEnv, passing, () => Response.json({ ok: true, id: "local-lead-id" }));
  const response = await api.post({ ...minted, form_data: { ...payload.form_data, utmSource: "qa", gclid: "local-click" } }, host);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, id: "local-lead-id" });
  assert.equal(api.requests.length, 2);
  const delivered = api.requests[1];
  assert.equal(delivered.body.form_data.spamCheck, "Passed reCAPTCHA");
  assert.equal(delivered.body.form_data.utmSource, "qa");
  assert.equal(delivered.body.form_data.gclid, "local-click");
  assert.equal(JSON.stringify(delivered.headers), JSON.stringify({ "Content-Type": "application/json" }));
  for (const key of ["captchaToken", "powIssuedAt", "powNonce", "proof_claim", "recipients", "token"]) assert.equal(key in delivered.body, false);
});

test("receiver failures are reported once and never retried as a second lead", async () => {
  for (const upstream of [() => { throw new Error("timeout"); }, () => Response.json({}, { status: 503 }), () => Response.json({ ok: false }, { status: 409 }), () => Response.json({ ok: false }), () => new Response("not JSON")]) {
    const api = boundary(verifiedEnv, passing, upstream);
    assert.equal((await api.post(minted, host)).status, 502);
    assert.equal(api.requests.filter((request) => request.url.startsWith("https://analytics.gomega.ai/")).length, 1);
  }
});

test("all shared and custom form contracts enforce required fields and consent before authorization", async () => {
  const { SITE_ROUTES } = loadModule("src/lib/routes.ts");
  const { formKeyForSlug } = loadModule("src/lib/form-keys.ts");
  const slugs = ["about-us", "bathroom-remodeling", "careers", "contact", "general-contractor", "custom-home-services", "schedule-an-estimate"];
  const keys = ["homepage_estimate", ...SITE_ROUTES.filter((route) => slugs.includes(route.slug) || route.path.startsWith("/service-area/")).map((route) => formKeyForSlug(route.slug))];
  assert.equal(keys.length, 27);
  const api = boundary();
  for (const form_key of keys) {
    const form_data = { ...valid.form_data, ...(form_key === "careers_application" ? { projectType: "Carpentry", resumeFileName: "resume.pdf" } : {}) };
    for (const field of ["name", "email", "phone", "projectType", "projectDetails", ...(!["homepage_estimate", "estimate_bathroom_remodeling"].includes(form_key) ? ["consent"] : []), ...(form_key === "careers_application" ? ["resumeFileName"] : [])]) {
      const incomplete = { ...form_data }; delete incomplete[field];
      assert.equal((await api.post({ ...valid, form_key, form_data: incomplete })).status, 422, `${form_key}: ${field}`);
    }
    assert.equal((await api.post({ ...valid, form_key, form_data })).status, 200, form_key);
  }
  assert.equal(api.requests.length, 27);
});
