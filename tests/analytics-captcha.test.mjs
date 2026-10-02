import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

function fakeBrowser() {
  const scripts = [];
  return { scripts, window: { location: { href: "https://local.test/", search: "" }, setTimeout, clearTimeout }, document: { title: "Test page", querySelector: () => scripts[0], createElement: () => ({ dataset: {} }), head: { appendChild: (script) => scripts.push(script) } } };
}

test("GA uses actual Arguments objects, one initial page view and one navigation view", () => {
  const browser = fakeBrowser(); let effect;
  const api = loadModule("src/components/analytics/GoogleAnalytics.tsx", {
    ...browser, URLSearchParams, process: { env: { NEXT_PUBLIC_GA4_ID: "test-local-only" } },
    moduleMocks: { react: { useEffect: (callback) => { effect = callback; } }, "next/navigation": { usePathname: () => "/" } },
  });
  api.GoogleAnalytics(); effect(); effect();
  assert.equal(browser.scripts.length, 1);
  assert.equal(browser.window.dataLayer.length, 3);
  assert.equal(Object.prototype.toString.call(browser.window.dataLayer[0]), "[object Arguments]");
  assert.equal(browser.window.dataLayer[1][2].send_page_view, false);
  browser.window.location.href += "contact"; api.GoogleAnalytics(); effect();
  const views = browser.window.dataLayer.filter((entry) => entry[1] === "page_view");
  assert.equal(views.length, 2);
  assert.equal(views[1][2].page_location, "https://local.test/contact");
});

test("PostHog explicitly captures browser events after loading and navigation", async () => {
  const browser = fakeBrowser(); let effect; let options; const captured = [];
  browser.window.setTimeout = (callback) => { queueMicrotask(callback); return 1; };
  const sdk = { __loaded: false, init: (_key, config) => { options = config; sdk.__loaded = true; }, capture: (...args) => captured.push(args) };
  const api = loadModule("src/components/analytics/PostHogProvider.tsx", {
    ...browser, URLSearchParams, process: { env: { NEXT_PUBLIC_POSTHOG_KEY: "test-local-only" } },
    moduleMocks: { react: { createContext: () => ({ Provider: "provider" }), useState: () => [null, () => {}], useEffect: (callback) => { effect = callback; } }, "next/navigation": { usePathname: () => "/" }, "posthog-js": sdk, "posthog-js/react": { PostHogProvider: "provider" } },
  });
  api.PostHogProvider({ children: "preserved SSR" }); effect(); await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(options.capture_pageview, false); assert.equal(options.opt_out_useragent_filter, true);
  assert.equal(captured.length, 1); assert.equal(captured[0][0], "$pageview");
  browser.window.location.href += "contact"; api.PostHogProvider({ children: "preserved SSR" }); effect(); await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(captured.length, 2); assert.equal(captured[1][1].$current_url, "https://local.test/contact");
});
