import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

function fakeBrowser() {
  const scripts = []; const scheduled = [];
  return { scripts, scheduled, window: { location: { href: "https://local.test/", search: "" } }, document: { title: "Test page", querySelector: () => scripts[0], createElement: () => ({ dataset: {} }), head: { appendChild: (script) => scripts.push(script) } } };
}

function harness(file, env, extraMocks = {}) {
  const browser = fakeBrowser(); let effect;
  const moduleMocks = { react: { useEffect: (callback) => { effect = callback; } }, "next/navigation": { usePathname: () => new URL(browser.window.location.href).pathname },
    "@/lib/analytics-idle": { afterCriticalPaint: (callback) => { browser.scheduled.push(callback); return () => {}; } }, ...extraMocks };
  const api = loadModule(file, { ...browser, URLSearchParams, process: { env }, moduleMocks });
  return { ...browser, api, run: () => effect(), moduleMocks };
}

test("GA queues Arguments immediately but defers one loader, config and deduplicated page views", () => {
  const h = harness("src/components/analytics/GoogleAnalytics.tsx", { NEXT_PUBLIC_GA4_ID: "test-local-only" });
  h.api.GoogleAnalytics(); h.run(); h.run();
  assert.equal(h.scripts.length, 0, "no GA transfer on initial effect");
  assert.equal(h.window.dataLayer.length, 3);
  assert.equal(Object.prototype.toString.call(h.window.dataLayer[0]), "[object Arguments]");
  assert.equal(h.window.dataLayer[1][2].send_page_view, false);
  h.window.dataLayer.push({ event: "form_submission" });
  h.window.location.href += "contact"; h.api.GoogleAnalytics(); h.run();
  h.scheduled.forEach(callback => callback());
  assert.equal(h.scripts.length, 1);
  assert.match(h.scripts[0].src, /^https:\/\/www.googletagmanager.com\/gtag\/js\?id=/);
  assert.equal(h.window.dataLayer.filter(entry => entry[0] === "config").length, 1);
  assert.equal(h.window.dataLayer.filter(entry => entry.event === "form_submission").length, 1);
  const views = h.window.dataLayer.filter(entry => entry[1] === "page_view");
  assert.equal(views.length, 2);
  assert.equal(views[1][2].page_location, "https://local.test/contact");
});

test("PostHog dynamically loads once after paint and retains initial plus early SPA routes", async () => {
  let options; let initializes = 0; let loadAllowed = false; const captured = [];
  const sdk = { __loaded: false, init: (_key, config) => { options = config; initializes++; sdk.__loaded = true; }, capture: (...args) => captured.push(args) };
  const h = harness("src/components/analytics/PostHogProvider.tsx", { NEXT_PUBLIC_POSTHOG_KEY: "test-local-only" });
  Object.defineProperty(h.moduleMocks, "posthog-js/dist/module.slim", { get: () => { assert.ok(loadAllowed, "SDK must not be statically imported"); return sdk; } });
  h.moduleMocks["posthog-js/dist/extension-bundles"] = { AllExtensions: {} };
  assert.equal(h.api.PostHogProvider({ children: "preserved SSR" }), "preserved SSR"); h.run(); h.run();
  h.window.location.href += "contact"; h.api.PostHogProvider({ children: "preserved SSR" }); h.run();
  assert.equal(initializes, 0); assert.equal(captured.length, 0);
  loadAllowed = true;
  await Promise.all(h.scheduled.map(callback => callback()));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(initializes, 1); assert.equal(options.capture_pageview, false);
  assert.equal(options.opt_out_useragent_filter, true);
  assert.deepEqual(captured.map(args => args[1].$current_url), ["https://local.test/", "https://local.test/contact"]);
  h.api.PostHogProvider({ children: "preserved SSR" }); h.run();
  h.window.location.href = "https://local.test/"; h.api.PostHogProvider({ children: "preserved SSR" }); h.run();
  assert.equal(captured.length, 3, "return visits count once without reinitialization");
  assert.equal(initializes, 1);
});

test("analytics stays disabled without provisioned IDs and inside the portfolio embed", () => {
  for (const [file, component, env] of [["GoogleAnalytics", "GoogleAnalytics", { NEXT_PUBLIC_GA4_ID: "test-local-only" }], ["PostHogProvider", "PostHogProvider", { NEXT_PUBLIC_POSTHOG_KEY: "test-local-only" }]]) {
    for (const absent of [true, false]) {
      const h = harness(`src/components/analytics/${file}.tsx`, absent ? {} : env);
      if (!absent) h.window.location.search = "?embed=realwork";
      h.api[component]({ children: "visible" }); h.run();
      assert.equal(h.scheduled.length, 0); assert.equal(h.scripts.length, 0);
      assert.equal(h.window.dataLayer, undefined);
    }
  }
});

test("PostHog import/init failure preserves content and retries queued routes on navigation", async () => {
  let attempts = 0; const captured = [];
  const sdk = { __loaded: false, init: () => { if (++attempts === 1) throw new Error("Unavailable"); sdk.__loaded = true; }, capture: (_event, props) => captured.push(props.$current_url) };
  const h = harness("src/components/analytics/PostHogProvider.tsx", { NEXT_PUBLIC_POSTHOG_KEY: "test-local-only" }, {
    "posthog-js/dist/module.slim": sdk, "posthog-js/dist/extension-bundles": { AllExtensions: {} },
  });
  assert.equal(h.api.PostHogProvider({ children: "still visible" }), "still visible"); h.run(); h.scheduled.shift()();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(captured.length, 0);
  h.window.location.href += "contact"; h.api.PostHogProvider({ children: "still visible" }); h.run(); h.scheduled.shift()();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(attempts, 2); assert.deepEqual(captured, ["https://local.test/", "https://local.test/contact"]);
});

test("production client calls Enterprise execute with the provisioned key and lead_submit action", async () => {
  let execution;
  const enterprise = { ready: (callback) => callback(), execute: async (...args) => { execution = args; return "minted-local-test-token"; } };
  const window = { grecaptcha: { enterprise }, setTimeout: (callback, delay) => { const timer = setTimeout(callback, delay); timer.unref(); return timer; }, clearTimeout };
  const api = loadModule("src/lib/recaptcha-client.ts", { window, document: {}, process: { env: { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "configured-local-test-key" } } });
  assert.equal(await api.mintCaptchaToken(), "minted-local-test-token");
  assert.equal(execution[0], "configured-local-test-key"); assert.equal(execution[1].action, "lead_submit");
});
