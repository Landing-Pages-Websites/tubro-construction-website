import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

const host = "www.tubroconstruction.com";
const preview = "tubro-construction-website-test-mega-websites.vercel.app";
const env = { VERCEL_ENV: "production", RECAPTCHA_HOSTNAMES: host, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "test-enterprise-key", RECAPTCHA_PROJECT_ID: "test", RECAPTCHA_API_KEY: "test", LEAD_UPLOAD_SIGNING_SECRET: "test-existing-signing-secret" };
const payload = { form_key: "schedule_estimate", form_data: { name: "Local Test", phone: "(757) 685-5050", email: "test@example.com", projectDetails: "Intercepted local test", projectType: "Kitchen or bathroom remodel", consent: true } };
const accepted = { tokenProperties: { valid: true, action: "lead_submit", hostname: host }, riskAnalysis: { score: 0.9 } };

function boundary(assessment = {}, overrides = {}) {
  const forwarded = [];
  const fetch = async (url, options) => {
    if (url.startsWith("https://recaptchaenterprise.googleapis.com/")) {
      if (assessment instanceof Error) throw assessment;
      return assessment instanceof Response ? assessment : Response.json(assessment);
    }
    assert.equal(url, "https://analytics.gomega.ai/submission/submit");
    forwarded.push(JSON.parse(options.body));
    return Response.json({ ok: true });
  };
  const api = loadModule("app/api/lead/route.ts", { process: { env: { ...env, ...overrides } }, fetch });
  const get = (hostname = host) => api.GET(new Request(`https://${hostname}/api/lead`));
  const post = (body, hostname = host) => api.POST(new Request(`https://${hostname}/api/lead`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
  return { get, post, forwarded };
}

async function proof(api, body = payload, hostname = host) {
  const response = await api.get(hostname);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  const challenge = await response.json();
  assert.equal(typeof challenge.issuedAt, "string");
  const { solveLeadProof } = loadModule("src/lib/leadProof.ts");
  const fields = { ...body, powIssuedAt: challenge.issuedAt, powChallenge: challenge.powChallenge, powSignature: challenge.powSignature };
  return { ...fields, powNonce: await solveLeadProof(fields, challenge.issuedAt) };
}

test("fresh signed GET challenges need only the existing secret on production and preview", async () => {
  for (const overrides of [{}, { VERCEL_ENV: "preview", VERCEL_URL: preview, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "recaptcha-staging-bypass-key" }]) {
    const api = boundary({}, overrides);
    const hostname = overrides.VERCEL_URL || host;
    const first = await (await api.get(hostname)).json();
    const second = await (await api.get(hostname)).json();
    assert.equal(typeof first.issuedAt, "string");
    assert.notEqual(first.powChallenge, second.powChallenge);
  }
  const api = boundary();
  assert.equal((await api.get(preview)).status, 403);
  assert.equal((await api.post(payload, preview)).status, 403);
  assert.equal((await boundary({}, { LEAD_UPLOAD_SIGNING_SECRET: undefined }).get()).status, 503);
});

test("production tokens and all Google failure modes use the proper verification label", async () => {
  const api = boundary(accepted);
  assert.equal((await api.post({ ...payload, captchaToken: "minted-test-token" })).status, 200);
  assert.equal(api.forwarded[0].form_data.spamCheck, "Passed reCAPTCHA");
  for (const failure of [{ ...accepted, riskAnalysis: { score: 0.1 } }, { tokenProperties: { valid: false, invalidReason: "BROWSER_ERROR" } }, new Response("rejected", { status: 400 }), new Error("network unavailable")]) {
    const failed = boundary(failure);
    const body = { ...payload, captchaToken: "rejected-test-token" };
    assert.equal((await failed.post(body)).status, 403);
    assert.equal((await failed.post(await proof(failed, body))).status, 200);
    assert.equal(failed.forwarded.length, 1);
    assert.equal(failed.forwarded[0].form_data.spamCheck, "Unverified: reCAPTCHA did not pass; passed fallback check");
    assert.equal(failed.forwarded[0].form_data.phone, "7576855050");
  }
});

test("proof is bound, signed and one-use; unsigned, stale, altered and replayed requests fail closed", async () => {
  const api = boundary();
  const proved = await proof(api);
  for (const change of [{ powSignature: "0".repeat(64) }, { powIssuedAt: String(Date.now() - 100_000) }, { powSignature: undefined }, { form_key: "contact_message" }, { form_data: { ...payload.form_data, name: "Changed" } }]) {
    assert.equal((await api.post({ ...proved, ...change })).status, 403);
  }
  const responses = await Promise.all([api.post(proved), api.post(proved)]);
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 403]);
  assert.equal(api.forwarded.length, 1);
  const missing = boundary({}, { RECAPTCHA_API_KEY: undefined });
  assert.equal((await missing.post(proved)).status, 403);
});

test("preview still requires exact sentinel even when a valid fallback proof is attached", async () => {
  const api = boundary({}, { VERCEL_ENV: "preview", VERCEL_URL: preview, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "recaptcha-staging-bypass-key" });
  const proved = await proof(api, payload, preview);
  assert.equal((await api.post(proved, preview)).status, 403);
  assert.equal((await api.post({ ...proved, captchaToken: "arbitrary" }, preview)).status, 403);
  assert.equal((await api.post({ ...proved, captchaToken: "recaptcha-staging-bypass-key" }, preview)).status, 200);
  assert.equal(api.forwarded[0].form_data.spamCheck, undefined);
});
