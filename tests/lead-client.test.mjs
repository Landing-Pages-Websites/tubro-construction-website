import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

test("client retries rejected assessment with fresh bound proof, without retrying delivery errors", async () => {
  for (const status of [403, 422, 502]) {
    const requests = []; let solves = 0;
    const fetch = async (_url, options = {}) => {
      requests.push(options);
      if (!options.method) return Response.json({ issuedAt: String(Date.now()), powChallenge: "nonce", powSignature: "signed" });
      if (requests.length === 1) return Response.json({ error: "Try again", code: status === 403 ? "verification_failed" : undefined }, { status });
      return Response.json({ ok: true });
    };
    const api = loadModule("src/lib/lead-client.ts", {
      fetch, URLSearchParams, window: { location: { search: "" } },
      moduleMocks: { "./recaptcha-client": { requestUploadToken: async () => { throw new Error("Unexpected upload token request"); } }, "./leadProof": { solveLeadProof: async (fields) => { solves++; assert.equal(fields.form_key, "homepage_estimate"); return "123"; } } },
    });
    const widget = { getToken: async () => "minted-token" };
    if (status !== 403) { await assert.rejects(api.postLead("homepage_estimate", {}, "/", widget)); assert.equal(solves, 0); continue; }
    await api.postLead("homepage_estimate", { phone: "7576855050" }, "/", widget);
    assert.equal(solves, 1); assert.equal(requests.length, 3);
    const retried = JSON.parse(requests[2].body);
    assert.equal(retried.powNonce, "123"); assert.equal(retried.captchaToken, "minted-token");
  }
});

test("unavailable widget goes straight to first-party proof without emitting a placeholder token", async () => {
  const requests = [];
  const api = loadModule("src/lib/lead-client.ts", {
    URLSearchParams, window: { location: { search: "" } },
    fetch: async (_url, options = {}) => { requests.push(options); return Response.json(options.method ? { ok: true } : { issuedAt: String(Date.now()), powChallenge: "nonce", powSignature: "signed" }); },
    moduleMocks: { "./recaptcha-client": { requestUploadToken: async () => { throw new Error("Unexpected upload token request"); } }, "./leadProof": { solveLeadProof: async () => "123" } },
  });
  await api.postLead("homepage_estimate", {}, "/", { getToken: async () => null });
  assert.equal(requests.length, 2);
  assert.equal("captchaToken" in JSON.parse(requests[1].body), false);
});
