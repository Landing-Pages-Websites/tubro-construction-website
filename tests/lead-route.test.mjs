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
const claimToken = "a".repeat(64);
const productionEnv = { VERCEL_ENV: "production", RECAPTCHA_HOSTNAMES: host, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "test-site-key", LEAD_PROOF_CLAIM_TOKEN: ` ${claimToken}\n` };
const { captchaToken: _token, ...payload } = valid;
const claimed = () => Response.json({ ok: true, proof_claim: "claimed", id: "local-lead-id" });

test("standard GET issues only a fresh 13-digit timestamp without signing or KV prerequisites", async () => {
  const { route } = boundary({ ...productionEnv, LEAD_PROOF_CLAIM_TOKEN: undefined });
  const response = await route.GET(new Request(`https://${host}/api/lead`));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const result = await response.json();
  assert.deepEqual(Object.keys(result), ["issuedAt"]);
  assert.match(result.issuedAt, /^\d{13}$/);
  assert.ok(Math.abs(Date.now() - Number(result.issuedAt)) < 1000);
});

test("production fails closed for absent/invalid proofs, forbidden keys and honeypots", async () => {
  const api = boundary(productionEnv, {}, claimed);
  for (const change of [{}, { captchaToken: sentinel }, { captchaToken: "lead-submit" }, { captchaToken: "random" }, { powIssuedAt: String(Date.now()), powNonce: "0" }]) {
    assert.equal((await api.post({ ...payload, ...change }, host)).status, 403);
  }
  for (const change of [{ form_key: "unsupported" }, { form_key: "estimate_privacy" }, { form_key: "estimate_blog" }, { form_key: "estimate_homepage" }, { proof_claim: {} }, { attempt_id: "supplied" }, { token: claimToken }]) {
    assert.equal((await api.post({ ...payload, ...change }, host)).status, 422);
  }
  assert.equal((await api.post(prove({ ...payload, website: "spam.test" }), host)).status, 403);
  assert.equal(api.requests.length, 0);
});

test("fallback verifies exact payload, age and proof, then claims at the existing receiver", async () => {
  const proved = prove({ ...payload, form_data: { ...payload.form_data, email: " Test@Example.com ", utmSource: "qa", gclid: "local-click" } });
  const api = boundary(productionEnv, {}, claimed);
  for (const field of ["name", "email", "phone", "projectDetails", "utmSource"]) {
    const changed = { ...proved, form_data: { ...proved.form_data, [field]: field === "email" ? "other@example.com" : field === "phone" ? "2532162634" : "Changed" } };
    assert.equal((await api.post(changed, host)).status, 403, field);
  }
  for (const issuedAt of [String(Date.now() - 90_001), String(Date.now() + 10_000)]) {
    assert.equal((await api.post(prove(payload, issuedAt), host)).status, 403);
  }
  const response = await api.post(proved, host);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, id: "local-lead-id" });
  assert.equal(api.requests.length, 1);
  const request = api.requests[0];
  assert.equal(request.headers["x-mega-proof-claim-token"], claimToken);
  assert.deepEqual(request.body.proof_claim, { issued_at: proved.powIssuedAt, nonce: proved.powNonce, email: " Test@Example.com ", attempt_id: request.body.proof_claim.attempt_id });
  assert.match(request.body.proof_claim.attempt_id, /^[a-f0-9-]{36}$/);
  assert.equal(request.body.form_data.email, request.body.proof_claim.email);
  assert.equal(request.body.form_data.spamCheck, "Unverified: reCAPTCHA did not pass; passed fallback check");
  assert.equal(request.body.form_data.utmSource, "qa");
  assert.equal(request.body.form_data.gclid, "local-click");
  assert.equal(request.body.customer_id, "b002784f-9543-4362-8814-b7da19078f23");
  assert.equal(request.body.site_id, "f28d515e-437b-4f9b-96c4-bc1a79a3357c");
  assert.equal(request.body.source_provider, "website-tubroconstruction");
  for (const key of ["captchaToken", "powIssuedAt", "powNonce", "recipients", "token"]) assert.equal(key in request.body, false);
});

test("durable receiver rejects replay across handler instances and permanent refusals never retry", async () => {
  const proved = prove(payload);
  let delivered = false;
  const receiver = () => {
    if (delivered) return Response.json({ ok: false }, { status: 409 });
    delivered = true;
    return claimed();
  };
  assert.equal((await boundary(productionEnv, {}, receiver).post(proved, host)).status, 200);
  const replay = boundary(productionEnv, {}, receiver);
  assert.equal((await replay.post(proved, host)).status, 403);
  assert.equal(replay.requests.length, 1);
  for (const status of [400, 401, 403, 409]) {
    const api = boundary(productionEnv, {}, () => Response.json({ ok: false }, { status }));
    assert.notEqual((await api.post(proved, host)).status, 200);
    assert.equal(api.requests.length, 1);
  }
});

test("fallback fails closed without claim token or a marked JSON success; malformed success is never retried", async () => {
  const proved = prove(payload);
  for (const token of [undefined, "", "placeholder"]) {
    const api = boundary({ ...productionEnv, LEAD_PROOF_CLAIM_TOKEN: token }, {}, claimed);
    assert.equal((await api.post(proved, host)).status, 502);
    assert.equal(api.requests.length, 0);
  }
  for (const result of [{ ok: true }, { ok: false, proof_claim: "claimed" }, { ok: true, proof_claim: "unknown" }, { ok: true, proof_claim: ["claimed"] }, { ok: true, proof_claim: null }, "not JSON"]) {
    const api = boundary(productionEnv, {}, () => typeof result === "string" ? new Response(result) : Response.json(result));
    assert.equal((await api.post(proved, host)).status, 502);
    assert.equal(api.requests.length, 1);
  }
});

test("bounded timeout/5xx retries reuse identical bytes and attempt identity; independent inbound requests mint new IDs", async () => {
  const proved = prove(payload);
  for (const failure of [() => { throw new Error("timeout"); }, () => Response.json({}, { status: 503 })]) {
    let calls = 0;
    const api = boundary(productionEnv, {}, () => ++calls === 1 ? failure() : Response.json({ ok: true, proof_claim: "retry", id: "same-lead" }));
    assert.equal((await api.post(proved, host)).status, 200);
    assert.equal(api.requests.length, 2);
    assert.equal(api.requests[0].bytes, api.requests[1].bytes);
    assert.deepEqual(api.requests[0].headers, api.requests[1].headers);
    await api.post(proved, host);
    assert.notEqual(api.requests[1].body.proof_claim.attempt_id, api.requests[2].body.proof_claim.attempt_id);
  }
  const api = boundary(productionEnv, {}, () => Response.json({}, { status: 500 }));
  assert.equal((await api.post(proved, host)).status, 502);
  assert.equal(api.requests.length, 2);
});

test("failed real CAPTCHA can use a valid fallback without passing the bad token onward", async () => {
  const api = boundary({ ...productionEnv, RECAPTCHA_PROJECT_ID: "test", RECAPTCHA_API_KEY: "test" }, { tokenProperties: { valid: false } }, claimed);
  assert.equal((await api.post(prove({ ...payload, captchaToken: "failed-real-token" }), host)).status, 200);
  assert.equal(api.requests.length, 2);
  assert.equal(api.requests[1].body.form_data.spamCheck, "Unverified: reCAPTCHA did not pass; passed fallback check");
  assert.equal("captchaToken" in api.requests[1].body, false);
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
