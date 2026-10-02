import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

const sentinel = "recaptcha-staging-bypass-key";
const previewHost = "tubro-construction-website-test-mega-websites.vercel.app";
const valid = { form_key: "schedule_estimate", form_data: { name: "Local Test", phone: "2532162633", email: "test@example.com", projectDetails: "Intercepted local test only", projectType: "Kitchen or bathroom remodel", consent: true }, captchaToken: sentinel };
const previewEnv = { VERCEL_ENV: "preview", VERCEL_URL: previewHost, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: sentinel };

function boundary(env = previewEnv, assessment = {}) {
  const requests = [];
  const fetch = async (url, options) => {
    requests.push({ url, body: JSON.parse(options.body) });
    if (url.startsWith("https://recaptchaenterprise.googleapis.com/")) return Response.json(assessment);
    assert.equal(url, "https://analytics.gomega.ai/submission/submit");
    return Response.json({ ok: true });
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
  assert.equal("captchaToken" in requests[0].body, false);
});

test("actual handler rejects malformed, oversized, invalid, spoofed field and cross-origin requests before forwarding", async () => {
  const { post, requests } = boundary();
  for (const body of ["{", "null", "[]", '"string"', "x".repeat(25000)]) assert.equal((await post(body)).status, 400);
  for (const fields of [{ phone: "55512" }, { email: "me@x" }, { consent: "yes" }, { consent: false }, { name: "" }, { projectDetails: " " }, { projectType: "" }, { projectType: "Invented option" }, { first_name: "duplicate" }, { projectCity: {} }]) {
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
  for (const changed of [{ ...assessment, tokenProperties: { ...assessment.tokenProperties, hostname: "attacker.test" } }, { ...assessment, tokenProperties: { ...assessment.tokenProperties, action: "other" } }, { ...assessment, riskAnalysis: { score: 0.1 } }]) {
    const api = boundary(env, changed);
    assert.equal((await api.post({ ...valid, captchaToken: "minted-test-token" }, "www.tubroconstruction.com")).status, 403);
    assert.equal(api.requests.length, 1);
  }
});

test("production fallback is unavailable without durable replay storage and signing configuration", async () => {
  const { route } = boundary({ VERCEL_ENV: "production", RECAPTCHA_HOSTNAMES: "www.tubroconstruction.com", NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "test-site-key" });
  const response = await route.GET(new Request("https://www.tubroconstruction.com/api/lead"));
  assert.equal(response.status, 503);
});

test("real proof fallback binds payload and rejects replay at the actual handler", async () => {
  const { solveLeadProof } = await import("../src/lib/leadProof.ts");
  const { route, post, requests } = boundary({ VERCEL_ENV: "development", NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "local-enterprise-key" });
  const issued = await route.GET(new Request("https://localhost/api/lead"));
  assert.equal(issued.status, 200);
  const challenge = await issued.json();
  const { captchaToken: _token, ...payload } = valid;
  const fields = { ...payload, ...challenge };
  const powNonce = await solveLeadProof(fields, challenge.powIssuedAt);
  const remainder = 800 - (Date.now() - Number(challenge.powIssuedAt));
  if (remainder > 0) await new Promise((resolve) => setTimeout(resolve, remainder));
  const proved = { ...fields, powNonce };
  assert.equal((await post({ ...proved, form_data: { ...proved.form_data, name: "Changed payload" } }, "localhost")).status, 403);
  assert.equal((await post(proved, "localhost")).status, 200);
  assert.equal((await post(proved, "localhost")).status, 403);
  assert.equal(requests.length, 1);
});
