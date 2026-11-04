import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

test("production client calls Enterprise execute with the provisioned key and lead_submit action", async () => {
  let execution;
  const enterprise = { ready: (callback) => callback(), execute: async (...args) => { execution = args; return "minted-local-test-token"; } };
  const window = { grecaptcha: { enterprise }, setTimeout: (callback, delay) => { const timer = setTimeout(callback, delay); timer.unref(); return timer; }, clearTimeout };
  const api = loadModule("src/lib/recaptcha-client.ts", { window, document: {}, process: { env: { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "6L0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_-" } } });
  assert.equal(await api.mintCaptchaToken(), "minted-local-test-token");
  assert.equal(execution[0], "6L0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_-"); assert.equal(execution[1].action, "lead_submit");
});
