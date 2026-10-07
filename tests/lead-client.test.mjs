import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";
import { prove } from "./lead-proof-fixture.mjs";
import { verifyLeadProof } from "../src/lib/leadProof.ts";

const fields = { name: "Local Test", email: "Test@Example.com", phone: "2532162633", projectDetails: "Local intercepted request", projectType: "Kitchen or bathroom remodel", consent: true };

function client({ captchaFails = false, serverFails = false, deliveryFails = false } = {}) {
  const requests = [];
  const fetch = async (url, options) => {
    assert.equal(url, "/api/lead");
    const body = options.body && JSON.parse(options.body);
    requests.push({ method: options.method || "GET", body });
    if (!body) return Response.json({ issuedAt: String(Date.now()) });
    if (serverFails && body.captchaToken) return Response.json({ code: "verification_failed", error: "Failed CAPTCHA" }, { status: 403 });
    if (deliveryFails) return Response.json({ error: "Delivery unavailable" }, { status: 502 });
    return Response.json({ ok: true });
  };
  const moduleMocks = {
    "./recaptcha-client": { mintCaptchaToken: async () => { if (captchaFails) throw new Error("Blocked script"); return "real-client-token"; } },
    "./leadProof": { solveLeadProof: async (payload, issuedAt) => prove(payload, issuedAt).powNonce },
  };
  const window = { location: { search: "?utm_source=local-test&utm_campaign=repair&gclid=local-click" } };
  return { api: loadModule("src/lib/lead-client.ts", { fetch, window, URLSearchParams, moduleMocks }), requests };
}

test("client fallback covers script failure and server CAPTCHA failure without recycling the failed token", async () => {
  for (const config of [{ captchaFails: true }, { serverFails: true }]) {
    const { api, requests } = client(config);
    await api.postLead("schedule_estimate", fields, "/schedule-an-estimate");
    const last = requests.at(-1).body;
    assert.equal("captchaToken" in last, false);
    assert.equal(await verifyLeadProof(last), true);
    assert.equal(last.form_data.email, fields.email);
    assert.equal(last.form_data.utmSource, "local-test");
    assert.equal(last.form_data.utmCampaign, "repair");
    assert.equal(last.form_data.gclid, "local-click");
    assert.equal(last.website, "");
    assert.equal("website" in last.form_data, false);
    assert.equal(requests.length, config.serverFails ? 3 : 2);
  }
});

test("client never retries uncertain lead delivery as a new fallback submission", async () => {
  const { api, requests } = client({ deliveryFails: true });
  await assert.rejects(api.postLead("schedule_estimate", fields, "/schedule-an-estimate"), /Delivery unavailable/);
  assert.equal(requests.length, 1);
});

function hookHarness() {
  const window = { dataLayer: [] };
  const states = [];
  let dispatches = 0; let complete; let reject;
  const moduleMocks = {
    react: { useRef: (current) => ({ current }), useState: (initial) => [initial, (value) => states.push(value)] },
    "@/lib/estimate-fields": { readFields: () => fields, formErrors: (form) => form.invalid ? { phone: "Invalid phone" } : {}, focusInvalid: (form) => { form.focused = true; } },
    "@/lib/lead-client": { postLead: () => { dispatches++; return new Promise((resolve, fail) => { complete = resolve; reject = fail; }); } },
  };
  const hook = loadModule("src/hooks/useEstimateForm.ts", { window, moduleMocks }).useEstimateForm("/schedule-an-estimate", { formKey: "schedule_estimate" });
  const form = { invalid: false, resets: 0, reportValidity: () => true, reset() { this.resets++; }, requestSubmit() { this.requested = true; } };
  hook.formRef.current = form;
  const submit = () => hook.handleSubmit({ preventDefault() {}, currentTarget: form });
  return { hook, form, window, states, submit, count: () => dispatches, succeed: () => complete(), fail: () => reject(new Error("Recoverable delivery failure")) };
}

test("actual form hook validates before requestSubmit, guards rapid activation and emits success exactly once", async () => {
  const h = hookHarness();
  h.form.invalid = true;
  h.hook.validateAndSubmit(); await h.submit();
  assert.equal(h.form.requested, undefined); assert.equal(h.count(), 0); assert.equal(h.window.dataLayer.length, 0);
  h.form.invalid = false;
  h.hook.validateAndSubmit(); assert.equal(h.form.requested, true);
  const pending = h.submit(); await h.submit();
  assert.equal(h.count(), 1); assert.equal(h.window.dataLayer.length, 0);
  h.succeed(); await pending; await h.submit();
  assert.equal(h.count(), 1); assert.equal(h.form.resets, 1);
  assert.equal(h.window.dataLayer.filter((event) => event.event === "form_submission").length, 1);
});

test("actual form hook reports failure without conversion and permits an explicit retry", async () => {
  const h = hookHarness();
  const first = h.submit(); h.fail(); await first;
  assert.ok(h.states.includes("error")); assert.equal(h.form.resets, 0); assert.equal(h.window.dataLayer.length, 0);
  const second = h.submit(); h.succeed(); await second;
  assert.equal(h.count(), 2); assert.equal(h.window.dataLayer.length, 1);
});
