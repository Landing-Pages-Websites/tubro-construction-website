import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

const AD_LANDING = "?utm_source=meta&utm_medium=paid_social&utm_campaign=120200&utm_content=ad77&utm_platform=Facebook_Mobile_Feed&fbclid=IwAR0abc";

function browser({ search = "", cookie = "", storageFails = false } = {}) {
  const store = new Map();
  const sessionStorage = {
    getItem: (key) => { if (storageFails) throw new Error("SecurityError"); return store.has(key) ? store.get(key) : null; },
    setItem: (key, value) => { if (storageFails) throw new Error("QuotaExceededError"); store.set(key, String(value)); },
  };
  const window = { location: { search }, sessionStorage };
  const document = { cookie };
  const api = loadModule("src/lib/attribution.ts", { window, document, URLSearchParams });
  return { api, window, document, store };
}

test("first-touch values from the ad landing page survive an internal link to a form page", () => {
  const { api, window } = browser({ search: AD_LANDING });
  api.rememberAttribution();
  window.location.search = "";
  const fields = api.leadAttribution();
  assert.equal(fields.utmSource, "meta");
  assert.equal(fields.utmMedium, "paid_social");
  assert.equal(fields.utmCampaign, "120200");
  assert.equal(fields.utmContent, "ad77");
  assert.equal(fields.utmPlatform, "Facebook_Mobile_Feed");
  assert.equal(fields.fbclid, "IwAR0abc");
  assert.match(fields.fbc, /^fb\.1\.\d+\.IwAR0abc$/);
});

test("the _fbc cookie is used when Meta's pixel set it", () => {
  const { api } = browser({ search: AD_LANDING, cookie: "_ga=1; _fbc=fb.1.1700000000000.IwAR0abc; x=y" });
  assert.equal(api.leadAttribution().fbc, "fb.1.1700000000000.IwAR0abc");
});

test("a later tagged page view in the same session keeps the first touch", () => {
  const { api, window } = browser({ search: AD_LANDING });
  api.rememberAttribution();
  window.location.search = "?utm_source=google&gclid=later";
  api.rememberAttribution();
  const fields = api.leadAttribution();
  assert.equal(fields.utmSource, "meta");
  assert.equal("gclid" in fields, false);
});

test("gclid landings are kept too", () => {
  const { api, window } = browser({ search: "?gclid=Cj0KCQ&utm_source=google&utm_campaign=kitchen" });
  api.rememberAttribution();
  window.location.search = "";
  assert.deepEqual({ ...api.leadAttribution() }, { utmSource: "google", utmCampaign: "kitchen", gclid: "Cj0KCQ" });
});

test("an untagged visit stores nothing and sends nothing", () => {
  const { api, store } = browser({ search: "?ref=nav" });
  api.rememberAttribution();
  assert.equal(store.size, 0);
  assert.deepEqual({ ...api.leadAttribution() }, {});
});

test("denied storage still sends what the current URL carries and never throws", () => {
  const { api } = browser({ search: "?utm_campaign=direct-form", storageFails: true });
  assert.doesNotThrow(() => api.rememberAttribution());
  assert.deepEqual({ ...api.leadAttribution() }, { utmCampaign: "direct-form" });
});

test("values are clipped to the server's 500-character field limit", () => {
  const { api } = browser({ search: `?utm_campaign=${"x".repeat(900)}` });
  assert.equal(api.leadAttribution().utmCampaign.length, 500);
});
