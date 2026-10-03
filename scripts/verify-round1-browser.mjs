/** Controller rerun after the browser bootstrap is repaired. No real leads are sent. */
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const axePath = require.resolve(process.env.AXE_MODULE || "axe-core/axe.min.js");
const BASE = process.env.TEST_BASE_URL || "http://127.0.0.1:3217";
const EVIDENCE = process.env.EVIDENCE_DIR || "/var/lib/megaclaw/workspace/tubro-evidence";
const ROUTES = ["/", "/schedule-an-estimate", "/contact", "/careers", "/kitchen-remodeling", "/bathroom-remodeling", "/recent-projects", "/blog", "/blog/kitchen-remodel-cost-washington-state", "/service-area/home-remodeling-maple-valley", "/privacy"];
const results = [];
let browser;

async function measure(page, route, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((resolve) => setTimeout(resolve, 80)); }
    window.scrollTo(0, 0);
  });
  await page.addScriptTag({ path: axePath });
  const axe = await page.evaluate(() => window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] } }));
  const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, main: document.querySelectorAll("main#main-content").length }));
  const screenshot = path.join(EVIDENCE, `round1-${route.replace(/\W+/g, "-") || "home"}-${width}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  results.push({ route, width, layout, violations: axe.violations, screenshot });
}

async function formFlow(page) {
  const posts = [];
  await page.route("**/api/lead", async (route) => {
    if (route.request().method() !== "POST") return route.abort();
    posts.push(route.request().postDataJSON());
    await new Promise((resolve) => setTimeout(resolve, 500));
    return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  });
  await page.goto(BASE + "/schedule-an-estimate");
  const submit = page.getByRole("button", { name: "Request my free estimate" });
  await page.locator('[name="name"]').fill("Local intercepted test");
  await page.locator('[name="email"]').fill("local@example.com");
  await page.locator('[name="phone"]').fill("55512");
  await page.locator('[name="projectDetails"]').fill("Local intercepted verification; no real lead.");
  await page.locator('[name="consent"]').check();
  await submit.click();
  if (posts.length) throw new Error("Invalid phone dispatched a POST");
  await page.locator('[name="phone"]').fill("2532162633");
  await submit.evaluate((button) => { button.click(); button.click(); });
  await page.getByRole("status").filter({ hasText: "Thanks" }).waitFor();
  const conversions = await page.evaluate(() => window.dataLayer?.filter((event) => event.event === "form_submission").length || 0);
  if (posts.length !== 1 || conversions !== 1) throw new Error("Duplicate or missing submission/conversion");
  results.push({ forms: { interceptedPosts: posts.length, conversions, consent: posts[0].form_data.consent } });
}

async function narrowAndKeyboard(page) {
  await page.setViewportSize({ width: 195, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ROUTES) {
    await page.goto(BASE + route);
    const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    results.push({ route, reducedMotion: true, zoom: "200% mobile equivalent", layout });
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(BASE + "/");
  await page.getByLabel("Menu", { exact: true }).click();
  await page.keyboard.press("Escape");
  if (await page.locator('details[open]').count()) throw new Error("Menu did not close on Escape");
}

function ingestBody(request) {
  const buffer = request.postDataBuffer();
  if (!buffer) return "";
  if (buffer[0] === 0x1f && buffer[1] === 0x8b) return gunzipSync(buffer).toString("utf8");
  const body = buffer.toString("utf8");
  const data = new URLSearchParams(body).get("data");
  return data ? Buffer.from(data, "base64").toString("utf8") : body;
}

async function analyticsFlow() {
  const ga = process.env.EXPECTED_GA4_ID;
  const ph = process.env.EXPECTED_POSTHOG_KEY;
  if (!ga || !ph) { results.push({ analytics: "UNVERIFIED: supply provisioned EXPECTED_GA4_ID and EXPECTED_POSTHOG_KEY" }); return; }
  const page = await browser.newPage();
  const events = [];
  page.on("response", (response) => {
    const request = response.request();
    if (!/\/g\/collect|\/i\/v0\/e\/|\/e\//.test(request.url())) return;
    try { events.push({ url: request.url(), status: response.status(), body: ingestBody(request) }); }
    catch { events.push({ url: request.url(), status: response.status(), body: "UNDECODED" }); }
  });
  await page.goto(BASE + "/"); await page.waitForTimeout(8000);
  await page.locator('header a[href="/contact"]').first().click(); await page.waitForTimeout(8000);
  const gaViews = events.filter((event) => event.status < 300 && (event.url + event.body).includes(ga) && /en=page_view/.test(event.url + event.body));
  const phViews = events.filter((event) => event.status < 300 && event.body.includes(ph) && event.body.includes("$pageview"));
  results.push({ analytics: { gaViews: gaViews.length, phViews: phViews.length, requests: events.map(({ url, status }) => ({ url, status })) } });
  await page.close();
  if (gaViews.length !== 2 || phViews.length !== 2) throw new Error("Expected exactly one initial and one client-navigation ingest per provisioned analytics id");
}

async function main() {
  await mkdir(EVIDENCE, { recursive: true });
  browser = await chromium.launch({ headless: true, timeout: 10000, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ["--no-sandbox"] });
  await analyticsFlow();
  const page = await browser.newPage();
  for (const width of [390, 834, 1440]) for (const route of ROUTES) await measure(page, route, width);
  await narrowAndKeyboard(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await formFlow(page);
  const failures = results.filter((row) => row.violations?.length || row.layout?.scrollWidth > row.layout?.width);
  if (failures.length) process.exitCode = 1;
}

try { await main(); }
catch (error) { results.push({ error: error.message }); process.exitCode = 1; }
finally { await writeFile(path.join(EVIDENCE, "round1-browser.json"), JSON.stringify(results, null, 2)); await browser?.close(); }
