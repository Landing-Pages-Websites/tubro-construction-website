import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "/var/lib/megaclaw/workspace/gary-postlive-parity/node_modules/playwright");
const BASE = process.env.TEST_BASE_URL || "http://localhost:3187";
const EVIDENCE = process.env.EVIDENCE_DIR || "/var/lib/megaclaw/workspace/tubro-evidence/contact-continuation";
const results = [];
let browser;

function body(request) {
  const bytes = request.postDataBuffer();
  if (!bytes) return "";
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) return gunzipSync(bytes).toString();
  const text = bytes.toString(); const data = new URLSearchParams(text).get("data");
  return data ? Buffer.from(data, "base64").toString() : text;
}

function observe(page) {
  const events = []; const responses = []; const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    if (!/posthog\.com\/(e\/|i\/v0\/e\/)/.test(request.url())) return;
    try {
      const decoded = JSON.parse(body(request));
      events.push(...(Array.isArray(decoded) ? decoded : decoded.batch || [decoded]));
    } catch (error) { errors.push(`PostHog request decode: ${error.message}`); }
  });
  page.on("response", response => {
    if (/posthog\.com|googletagmanager\.com|\/g\/collect/.test(response.url()))
      responses.push({ url: response.url(), status: response.status() });
  });
  return { events, responses, errors };
}

async function waitViews(page, state, count) {
  try {
    for (let attempt = 0; attempt < 80; attempt++) {
      if (state.events.filter(event => event.event === "$pageview").length >= count) return;
      await page.waitForTimeout(100);
    }
    throw new Error(`Expected ${count} PostHog pageviews within eight seconds`);
  } catch (error) { throw new Error(`Pageview delivery: ${error.message}`); }
}

async function formFlow(page) {
  const posts = []; let fail = true;
  try {
    await page.route("**/api/lead", async route => {
      if (route.request().method() !== "POST") return route.abort();
      posts.push(route.request().postDataJSON());
      await route.fulfill({ status: fail ? 503 : 200, contentType: "application/json", body: fail ? '{"ok":false,"error":"Local retry fixture"}' : '{"ok":true}' });
    });
    const submit = page.getByRole("button", { name: "Send Message", exact: true });
    await submit.click(); assert.equal(posts.length, 0);
    await page.locator('[name="name"]').fill("Local intercepted check");
    await page.locator('[name="phone"]').fill("55512");
    await page.locator('[name="email"]').fill("local@example.com");
    await page.locator('[name="projectDetails"]').fill("Local intercepted verification; no real lead.");
    await page.locator('[name="consent"]').check();
    await submit.click(); assert.equal(posts.length, 0);
    await page.locator('[name="phone"]').fill("2532162633");
    await submit.click(); await page.getByRole("alert").filter({ hasText: "Local retry fixture" }).waitFor();
    assert.equal(await page.evaluate(() => window.dataLayer.filter(e => e.event === "form_submission").length), 0);
    fail = false; await submit.evaluate(button => { button.click(); button.click(); });
    await page.getByRole("status").filter({ hasText: "Thanks" }).waitFor();
    assert.equal(posts.length, 2);
    assert.equal(await page.evaluate(() => window.dataLayer.filter(e => e.event === "form_submission").length), 1);
    assert.equal(posts[1].form_data.consent, true);
    results.push({ form: { invalidPosts: 0, failedAttempts: 1, successfulPosts: 1, conversions: 1, keys: Object.keys(posts[1].form_data) } });
  } catch (error) { throw new Error(`Intercepted contact form: ${error.message}`); }
}

async function idleAndSpa() {
  const page = await browser.newPage(); const state = observe(page);
  try {
    const start = Date.now(); await page.goto(BASE + "/contact?utm_source=local-check");
    await waitViews(page, state, 1); const firstPageviewMs = Date.now() - start;
    assert.ok(firstPageviewMs <= 8000);
    await page.locator('header a[href="/blog"]').first().click(); await waitViews(page, state, 2);
    await page.waitForTimeout(3500);
    const clicks = state.events.filter(e => e.event === "$autocapture" && e.properties.$event_type === "click");
    assert.equal(clicks.length, 1, "first real click captured exactly once");
    await page.locator('header a[href="/contact"]').first().click(); await waitViews(page, state, 3);
    await formFlow(page);
    await page.evaluate(() => window.dispatchEvent(new Event("pagehide"))); await page.waitForTimeout(1500);
    const views = state.events.filter(e => e.event === "$pageview");
    assert.equal(views.length, 3); assert.equal(new Set(views.map(e => e.properties.$session_id)).size, 1);
    assert.ok(views.every(e => e.properties.$session_entry_utm_source === "local-check"));
    assert.ok(state.events.some(e => e.event === "$pageleave"));
    const ga = await page.evaluate(() => ({ views: window.dataLayer.filter(e => e[1] === "page_view").length,
      configs: window.dataLayer.filter(e => e[0] === "config").length, scripts: document.querySelectorAll('script[data-tubro-ga4]').length }));
    assert.deepEqual(ga, { views: 3, configs: 1, scripts: 1 });
    const gaDeliveredViews = state.responses.filter(r => r.status === 204 && new URL(r.url).searchParams.get("en") === "page_view").length;
    assert.equal(gaDeliveredViews, 3, "initial and both SPA pageviews reached GA");
    results.push({ idleAndSpa: { firstPageviewMs, ga, gaDeliveredViews, firstClickCount: clicks.length, eventNames: state.events.map(e => e.event), responses: state.responses, errors: state.errors } });
  } catch (error) { results.push({ failedFlow: state }); throw new Error(`Idle/SPA tracking: ${error.message}`); }
  finally { await page.close(); }
}

async function earlyNavigationAndRetry() {
  const page = await browser.newPage(); const state = observe(page); let attempts = 0;
  try {
    await page.route("**/gtag/js?*", route => ++attempts === 1 ? route.abort("failed") : route.continue());
    await page.route("**/_next/static/chunks/*.js", async route => {
      const response = await route.fetch(); const text = await response.text();
      if (text.includes("SDK_DEBUG_EXTENSIONS_INIT") || text.includes("posthog-js")) await page.waitForTimeout(700);
      await route.fulfill({ response, body: text });
    });
    await page.goto(BASE + "/contact");
    await page.locator('header a[href="/blog"]').first().click();
    await waitViews(page, state, 2); await page.waitForTimeout(1500);
    const views = state.events.filter(e => e.event === "$pageview");
    assert.deepEqual(views.map(e => new URL(e.properties.$current_url).pathname), ["/contact", "/blog"]);
    assert.ok(new Date(views[0].timestamp) <= new Date(views[1].timestamp));
    assert.ok(attempts >= 2, "GA retries failed download on SPA navigation");
    assert.equal(await page.locator('script[data-tubro-ga4]').count(), 1);
    results.push({ earlyNavigationAndRetry: { attempts, views: views.map(e => ({ url:e.properties.$current_url,timestamp:e.timestamp })), responses:state.responses } });
  } catch (error) { throw new Error(`Early navigation/provider retry: ${error.message}`); }
  finally { await page.close(); }
}

async function spotChecks() {
  const page = await browser.newPage();
  try {
    for (const route of ["/", "/blog", "/service-area/home-remodeling-maple-valley"]) {
      const response = await page.goto(BASE + route); assert.equal(response.status(), 200);
      assert.equal(await page.locator("h1").count(), 1);
      results.push({ spotCheck: route, status: response.status() });
    }
    await page.setViewportSize({ width: 390, height: 900 }); await page.goto(BASE + "/contact");
    await page.keyboard.press("Tab");
    assert.ok(await page.evaluate(() => document.activeElement !== document.body));
    await page.getByLabel("Menu", { exact: true }).click(); await page.keyboard.press("Escape");
    assert.equal(await page.locator("details[open]").count(), 0);
    results.push({ keyboard: "focus and Escape passed" });
  } catch (error) { throw new Error(`Shared-provider route checks: ${error.message}`); }
  finally { await page.close(); }
}

try {
  browser = await chromium.launch({ headless: true, timeout: 15000,
    executablePath: process.env.CHROMIUM_PATH || "/var/lib/megaclaw/user-tools/apt/usr/lib/chromium/chromium", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  await idleAndSpa(); await earlyNavigationAndRetry(); await spotChecks();
} catch (error) { results.push({ error: error.message }); process.exitCode = 1; }
finally { await writeFile(`${EVIDENCE}/browser-flows.json`, JSON.stringify(results, null, 2)); await browser?.close(); }
