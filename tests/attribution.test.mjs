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

test("a _fbc cookie the pixel writes after landing replaces the derived value", () => {
  const { api, window, document } = browser({ search: AD_LANDING });
  api.rememberAttribution();
  assert.match(api.leadAttribution().fbc, /^fb\.1\.\d+\.IwAR0abc$/);
  document.cookie = "_fbc=fb.3.1795557631078.IwAR0abc.AQYAAQMD";
  window.location.search = "";
  const fields = api.leadAttribution();
  assert.equal(fields.fbc, "fb.3.1795557631078.IwAR0abc.AQYAAQMD");
  assert.equal(fields.fbclid, "IwAR0abc");
  assert.equal(fields.utmSource, "meta");
});

test("a _fbc cookie from a different click does not replace the first-touch click", () => {
  const { api, document } = browser({ search: AD_LANDING });
  api.rememberAttribution();
  document.cookie = "_fbc=fb.1.1600000000000.OtherClick";
  const fields = api.leadAttribution();
  assert.match(fields.fbc, /^fb\.1\.\d+\.IwAR0abc$/);
  assert.equal(fields.fbclid, "IwAR0abc");
});

test("a _fbc click id that only shares a prefix with the first-touch click is not used", () => {
  const { api, document } = browser({ search: "?utm_source=meta&fbclid=abc" });
  api.rememberAttribution();
  document.cookie = "_fbc=fb.1.1700000000000.abcdef";
  assert.match(api.leadAttribution().fbc, /^fb\.1\.\d+\.abc$/);
});

test("on a UTM-only landing the first _fbc seen is kept when a later click changes the cookie", () => {
  const { api, window, document } = browser({ search: "?utm_source=meta&utm_campaign=first", cookie: "_fbc=fb.1.1700000000000.ClickA" });
  api.rememberAttribution();
  document.cookie = "_fbc=fb.1.1800000000000.ClickB";
  window.location.search = "";
  assert.equal(api.leadAttribution().fbc, "fb.1.1700000000000.ClickA");
});

test("on a UTM-only landing a cookie first seen later is kept for the rest of the session", () => {
  const { api, document } = browser({ search: "?utm_source=meta" });
  api.rememberAttribution();
  assert.equal("fbc" in api.leadAttribution(), false);
  document.cookie = "_fbc=fb.1.1700000000000.ClickA";
  assert.equal(api.leadAttribution().fbc, "fb.1.1700000000000.ClickA");
  document.cookie = "_fbc=fb.1.1800000000000.ClickB";
  assert.equal(api.leadAttribution().fbc, "fb.1.1700000000000.ClickA");
});
