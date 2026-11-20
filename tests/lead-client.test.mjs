import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

const fields = { name: "Local Test", email: "Test@Example.com", phone: "2532162633", projectDetails: "Local intercepted request", projectType: "Kitchen or bathroom remodel", consent: true };

function client({ captchaFails = false, serverFails = false, deliveryFails = false } = {}) {
  const requests = [];
  const fetch = async (url, options) => {
    assert.equal(url, "/api/lead");
    const body = options.body && JSON.parse(options.body);
    requests.push({ method: options.method || "GET", body });
    assert.ok(body, "the client never fetches a proof-of-work challenge");
    if (serverFails && body.captchaToken) return Response.json({ code: "verification_failed", error: "Failed CAPTCHA" }, { status: 403 });
    if (deliveryFails) return Response.json({ error: "Delivery unavailable" }, { status: 502 });
    return Response.json({ ok: true });
  };
  const moduleMocks = {
    "./recaptcha-client": { mintCaptchaToken: async () => { if (captchaFails) throw new Error("Blocked script"); return "real-client-token"; } },
  };
  const window = { location: { search: "?utm_source=local-test&utm_campaign=repair&gclid=local-click" } };
  return { api: loadModule("src/lib/lead-client.ts", { fetch, window, URLSearchParams, moduleMocks }), requests };
}

test("client sends the minted reCAPTCHA token with the form and tracking fields", async () => {
  const { api, requests } = client();
  await api.postLead("schedule_estimate", fields, "/schedule-an-estimate");
  assert.equal(requests.length, 1);
  const sent = requests[0].body;
  assert.equal(sent.captchaToken, "real-client-token");
  assert.equal("powNonce" in sent, false);
  assert.equal(sent.form_data.email, fields.email);
  assert.equal(sent.form_data.utmSource, "local-test");
  assert.equal(sent.form_data.utmCampaign, "repair");
  assert.equal(sent.form_data.gclid, "local-click");
  assert.equal(sent.website, "");
  assert.equal("website" in sent.form_data, false);
});

test("without a reCAPTCHA token the client sends nothing and asks the visitor to retry", async () => {
  const { api, requests } = client({ captchaFails: true });
  await assert.rejects(api.postLead("schedule_estimate", fields, "/schedule-an-estimate"), /refresh the page and try again/);
  assert.equal(requests.length, 0);
});

test("a server CAPTCHA refusal is shown, never retried with a fallback submission", async () => {
  const { api, requests } = client({ serverFails: true });
  await assert.rejects(api.postLead("schedule_estimate", fields, "/schedule-an-estimate"), /Failed CAPTCHA/);
  assert.equal(requests.length, 1);
});

test("client never retries uncertain lead delivery as a new fallback submission", async () => {
  const { api, requests } = client({ deliveryFails: true });
  await assert.rejects(api.postLead("schedule_estimate", fields, "/schedule-an-estimate"), /Delivery unavailable/);
  assert.equal(requests.length, 1);
});

// The attempt reaches postLead after its (empty) token step resolves.
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

function hookHarness() {
  const window = { dataLayer: [] };
  const states = []; const events = []; const marks = [];
  let dispatches = 0; let complete; let reject;
  const moduleMocks = {
    react: { useRef: (current) => ({ current }), useState: (initial) => [initial, (value) => states.push(value)] },
    "@/lib/estimate-fields": { readFields: () => fields, formErrors: (form) => form.invalid ? { phone: "Invalid phone" } : {}, focusInvalid: (form) => { form.focused = true; } },
    "@/lib/lead-client": { postLead: () => { dispatches++; return new Promise((resolve, fail) => { complete = resolve; reject = fail; }); } },
    // The consent-gated template writers, observed here; the real runLeadAttempt decides when they fire.
    "@/lib/track": { pushDataLayer: (entry) => window.dataLayer.push(entry), trackEvent: (event, props) => events.push([event, props]) },
    "@/lib/megaTag": { megaTagEvent: (event) => events.push([`megatag:${event}`]) },
    "@/lib/tracking/form-submit": { markFormSubmitting: () => marks.push("submitting"), markFormSubmitted: () => marks.push("submitted"), markFormSubmitFailed: () => marks.push("failed") },
  };
  const hook = loadModule("src/hooks/useEstimateForm.ts", { window, moduleMocks, console }).useEstimateForm("/schedule-an-estimate", { formKey: "schedule_estimate" });
  const form = { invalid: false, resets: 0, reportValidity: () => true, reset() { this.resets++; }, requestSubmit() { this.requested = true; } };
  hook.formRef.current = form;
  const submit = () => hook.handleSubmit({ preventDefault() {}, currentTarget: form });
  const named = (name) => events.filter(([event]) => event === name);
  return { hook, form, window, states, events, marks, named, submit, count: () => dispatches, succeed: async (...answer) => { await tick(); complete(answer.length ? answer[0] : { ok: true }); }, fail: async () => { await tick(); reject(new Error("Recoverable delivery failure")); } };
}

test("actual form hook validates before requestSubmit, guards rapid activation and emits success exactly once", async () => {
  const h = hookHarness();
  h.form.invalid = true;
  h.hook.validateAndSubmit(); await h.submit();
  assert.equal(h.form.requested, undefined); assert.equal(h.count(), 0); assert.equal(h.window.dataLayer.length, 0);
  assert.deepEqual(h.named("form_error").map(([, props]) => props.kind), ["validation", "validation"]);
  h.form.invalid = false;
  h.hook.validateAndSubmit(); assert.equal(h.form.requested, true);
  const pending = h.submit(); await h.submit(); await tick();
  assert.equal(h.count(), 1); assert.equal(h.window.dataLayer.length, 0); assert.deepEqual(h.marks, ["submitting"]);
  await h.succeed(); await pending; await h.submit();
  assert.equal(h.count(), 1); assert.equal(h.form.resets, 1);
  assert.equal(h.window.dataLayer.filter((event) => event.event === "form_submission").length, 1);
  assert.equal(JSON.stringify(h.named("lead_form_submit")), JSON.stringify([["lead_form_submit", { form_key: "schedule_estimate" }]]));
  assert.equal(h.named("megatag:form_submit").length, 1);
  assert.deepEqual(h.marks, ["submitting", "submitted"]);
});

test("actual form hook reports failure without conversion and permits an explicit retry", async () => {
  const h = hookHarness();
  const first = h.submit(); await h.fail(); await first;
  assert.ok(h.states.includes("error")); assert.equal(h.form.resets, 0); assert.equal(h.window.dataLayer.length, 0);
  assert.deepEqual(h.named("form_error").map(([, props]) => props.kind), ["server"]);
  assert.equal(h.named("lead_form_submit").length, 0); assert.deepEqual(h.marks, ["submitting", "failed"]);
  const second = h.submit(); await h.succeed(); await second;
  assert.equal(h.count(), 2); assert.equal(h.window.dataLayer.length, 1); assert.equal(h.named("lead_form_submit").length, 1);
});

test("actual form hook treats a 2xx without {ok:true} as a failed attempt, never a lead", async () => {
  for (const answer of [undefined, {}, { ok: false }, { ok: "true" }]) {
    const h = hookHarness();
    const attempt = h.submit(); await h.succeed(answer); await attempt;
    assert.ok(h.states.includes("error"), JSON.stringify(answer)); assert.equal(h.form.resets, 0);
    assert.equal(h.window.dataLayer.length, 0); assert.equal(h.named("lead_form_submit").length, 0);
    assert.deepEqual(h.marks, ["submitting", "failed"]);
  }
});
