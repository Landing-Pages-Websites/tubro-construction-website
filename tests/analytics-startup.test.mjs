import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

function providerHarness(sdk, extensions) {
  const scheduled = []; let effect; let clock = 1000;
  const window = { location: { href: "https://local.test/?utm_source=entry", search: "" } };
  const moduleMocks = {
    react: { useEffect: callback => { effect = callback; } },
    "next/navigation": { usePathname: () => new URL(window.location.href).pathname },
    "@/lib/analytics-idle": { afterCriticalPaint: callback => { scheduled.push(callback); return () => {}; } },
    "posthog-js": sdk,
    "posthog-js/dist/module.slim": sdk,
    "posthog-js/dist/extension-bundles": { AllExtensions: extensions },
  };
  const api = loadModule("src/components/analytics/PostHogProvider.tsx", { window, URLSearchParams, moduleMocks,
    Date: class extends Date { constructor(...args) { super(...(args.length ? args : [clock])); } },
    process: { env: { NEXT_PUBLIC_POSTHOG_KEY: "test-key" } } });
  return { scheduled, window, moduleMocks, render: () => { assert.equal(api.PostHogProvider({ children: "SSR" }), "SSR"); effect(); }, tick: () => { clock += 1000; } };
}

const settle = () => new Promise(resolve => setTimeout(resolve, 0));

test("slim initialization awaits the complete extension set and preserves configuration", async () => {
  let options; const all = { autocapture: class {}, sessionRecording: class {}, surveys: class {} };
  const sdk = { __loaded: false, init: (_key, config) => { options = config; sdk.__loaded = true; }, capture: () => {} };
  const h = providerHarness(sdk, all);
  Object.defineProperty(h.moduleMocks, "posthog-js", { get: () => { throw new Error("Default bundle must not load"); } });
  h.render(); h.scheduled.shift()(); await settle();
  assert.equal(options.__extensionClasses, all, "no extensions silently removed");
  assert.equal(options.capture_pageview, false); assert.equal(options.capture_pageleave, true);
  assert.equal(options.person_profiles, "identified_only"); assert.equal(options.disable_surveys, true);
  assert.equal(options.opt_out_useragent_filter, true);
  assert.equal(options.api_host, "https://us.i.posthog.com");
});

test("queued pageviews retain occurrence timestamps across early navigation and capture retry", async () => {
  const captured = []; let fail = true;
  const sdk = { __loaded: false, init: () => { sdk.__loaded = true; }, capture: (...args) => {
    if (fail) { fail = false; throw new Error("Temporary capture failure"); } captured.push(args);
  } };
  const h = providerHarness(sdk, {});
  h.render(); h.tick(); h.window.location.href = "https://local.test/contact"; h.render();
  h.scheduled.shift()(); await settle(); h.tick(); h.render();
  assert.deepEqual(captured.map(args => [args[1].$current_url, args[2].timestamp?.getTime()]), [
    ["https://local.test/?utm_source=entry", 1000], ["https://local.test/contact", 2000],
  ]);
  h.render(); assert.equal(captured.length, 2);
});

test("extension import failure retains pages and retries without initializing a partial SDK", async () => {
  let imports = 0; let initializes = 0; const captured = [];
  const sdk = { __loaded: false, init: () => { initializes++; sdk.__loaded = true; }, capture: (...args) => captured.push(args) };
  const h = providerHarness(sdk, {});
  Object.defineProperty(h.moduleMocks, "posthog-js/dist/extension-bundles", { get: () => {
    if (++imports === 1) throw new Error("Chunk temporarily unavailable"); return { AllExtensions: {} };
  } });
  h.render(); h.scheduled.shift()(); await settle(); assert.equal(initializes, 0);
  h.window.location.href = "https://local.test/contact"; h.render(); h.scheduled.shift()(); await settle();
  assert.equal(initializes, 1); assert.equal(captured.length, 2);
});

test("GA loader failure allows navigation retry without duplicate config or pageviews", () => {
  const scripts = []; const scheduled = []; let effect;
  const window = { location: { href: "https://local.test/", search: "" } };
  const document = { title: "Local", querySelector: () => scripts[0], head: { appendChild: script => scripts.push(script) },
    createElement: () => ({ dataset: {}, remove() { scripts.splice(scripts.indexOf(this), 1); } }) };
  const api = loadModule("src/components/analytics/GoogleAnalytics.tsx", { window, document, URLSearchParams,
    process: { env: { NEXT_PUBLIC_GA4_ID: "test-key" } }, moduleMocks: {
      react: { useEffect: callback => { effect = callback; } }, "next/navigation": { usePathname: () => "/" },
      "@/lib/analytics-idle": { afterCriticalPaint: callback => { scheduled.push(callback); return () => {}; } },
    } });
  api.GoogleAnalytics(); effect(); scheduled.shift()(); scripts[0].onerror();
  window.location.href += "contact"; api.GoogleAnalytics(); effect(); scheduled.shift()();
  assert.equal(scripts.length, 1);
  assert.equal(window.dataLayer.filter(entry => entry[0] === "config").length, 1);
  assert.equal(window.dataLayer.filter(entry => entry[1] === "page_view").length, 2);
});
