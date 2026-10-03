/** Read-only browser verification. No page content is hidden, replaced or removed. */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "/var/lib/megaclaw/workspace/gary-postlive-parity/node_modules/playwright");
const AXE = process.env.AXE_PATH || "/var/lib/megaclaw/workspace/gary-postlive-parity/node_modules/axe-core/axe.min.js";
const BASE = process.env.TEST_BASE_URL || "http://localhost:3194";
const BASELINE = process.env.BASELINE_URL || "https://tubro-construction-website-6n810dlew-mega-websites.vercel.app";
const EVIDENCE = process.env.EVIDENCE_DIR || "/var/lib/megaclaw/workspace/tubro-evidence/r3";
const KENT = "/Bathroom-Remodels-Kent-WA";
const BODY = "[data-article-body]";
const WIDTHS = [320, 390, 834, 1440];
const HEIGHT = 900;
const TIMEOUT = 20000;
const LAUNCH_TIMEOUT = 15000;
const RUN_TIMEOUT = 12 * 60 * 1000;
const SITEMAP_COUNT = 102;
const SCROLL_STEP = 600;
const SCROLL_SETTLE = 70;
const CAPTURE_TOP = 96;
const SERVICES = ["/general-contractor", "/kitchen-remodeling", "/bathroom-remodeling", "/interior-exterior-painting", "/custom-home-services"];
const INERT_COPY = /Thank you for contacting us\.|We will get back to you as soon as possible\.|Oops, there was an error sending your message\.|Please try again later\./i;
const report = { base: BASE, baseline: BASELINE, routes: [], kent: [], links: [], before: [], errors: [], failures: [], blockedWrites: [] };

async function step(label, action) {
  try { return await action(); }
  catch (error) {
    report.failures.push({ label, error: error.stack, cause: error.cause?.stack });
    process.stderr.write(`${label}: ${error.message}\n`);
    return undefined;
  }
}

async function save(name, data) {
  try { await writeFile(`${EVIDENCE}/${name}.json`, JSON.stringify(data, null, 2)); }
  catch (error) { throw new Error(`Cannot write evidence ${name}`, { cause: error }); }
}

async function open(page, base, path, width) {
  try {
    await page.setViewportSize({ width, height: HEIGHT });
    const response = await page.goto(base + path, { waitUntil: "load", timeout: TIMEOUT });
    assert.equal(response.status(), 200, `${path}: HTTP status`);
    assert.equal(response.request().redirectedFrom(), null, `${path}: unexpected redirect`);
    assert.equal(new URL(page.url()).pathname, path, `${path}: final pathname`);
    await page.evaluate(() => document.fonts.ready);
    return response;
  } catch (error) { throw new Error(`Cannot open ${base}${path} at ${width}px`, { cause: error }); }
}

async function reveal(page) {
  try {
    await page.evaluate(async ({ step, delay }) => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    }, { step: SCROLL_STEP, delay: SCROLL_SETTLE });
    await page.waitForFunction(() => [...document.images].filter(img => img.getAttribute("src")).every(img => img.complete), null, { timeout: TIMEOUT });
  } catch (error) { throw new Error(`Image/scroll readiness failed at ${page.url()}`, { cause: error }); }
}

function articleState(selector) {
  const body = document.querySelector(selector);
  if (!body) return { present: false, images: [], phones: [], text: "" };
  return { present: true, text: body.innerText, images: [...body.querySelectorAll("img")].map(img => ({
    src: img.getAttribute("src"), alt: img.alt, complete: img.complete,
    width: img.naturalWidth, height: img.naturalHeight,
  })), phones: [...body.querySelectorAll('a[href^="tel:"]')].map(link => link.getAttribute("href")) };
}

function assertArticle(state, path) {
  for (const img of state.images) {
    assert.ok(img.src?.trim() && img.complete && img.width > 0 && img.height > 0, `${path}: broken image ${JSON.stringify(img)}`);
  }
  for (const phone of state.phones) {
    assert.match(phone, /^tel:\+?[\d(). -]+$/, `${path}: invalid phone characters`);
    assert.match(phone.replace(/\D/g, ""), /^(?:1)?\d{10}$/, `${path}: invalid telephone number`);
  }
  assert.doesNotMatch(state.text, INERT_COPY, `${path}: inert form copy`);
}

async function sitemap(page) {
  try {
    const response = await page.request.get(`${BASE}/sitemap.xml`, { maxRedirects: 0, timeout: TIMEOUT });
    assert.equal(response.status(), 200);
    const paths = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
    assert.equal(paths.length, SITEMAP_COUNT);
    assert.equal(new Set(paths).size, SITEMAP_COUNT);
    return paths;
  } catch (error) { throw new Error("Cannot read the 102-route sitemap", { cause: error }); }
}

async function scanRoute(page, path) {
  try {
    const response = await open(page, BASE, path, 390);
    const bodyCount = await page.locator(BODY).count();
    assert.ok(bodyCount <= 1, `${path}: ambiguous article body`);
    if (bodyCount) await reveal(page);
    const state = await page.evaluate(articleState, BODY);
    const { text, ...details } = state;
    report.routes.push({ path, status: response.status(), redirected: false, ...details, inertCopy: INERT_COPY.test(text) });
    assertArticle(state, path);
  } catch (error) { throw new Error(`Sitemap regression on ${path}`, { cause: error }); }
}

async function crawl(page) {
  try {
    for (const [index, path] of (await sitemap(page)).entries()) {
      await step(`sitemap ${path}`, () => scanRoute(page, path));
      process.stdout.write(`Sitemap ${index + 1}/${SITEMAP_COUNT}: ${path}\n`);
    }
    assert.equal(report.routes.length, SITEMAP_COUNT);
    assert.ok(report.routes.filter(route => route.present).length >= 69, "Article bodies were not found");
  } catch (error) { throw new Error("Sitemap crawl incomplete", { cause: error }); }
}

async function focusLink(page, link) {
  try {
    await link.focus(); await page.keyboard.press("Shift+Tab"); await page.keyboard.press("Tab");
    const focus = await link.evaluate(element => ({ active: element === document.activeElement,
      visible: element.matches(":focus-visible"), outline: getComputedStyle(element).outlineStyle,
      width: getComputedStyle(element).outlineWidth }));
    assert.ok(focus.active && focus.visible && focus.outline !== "none" && focus.width !== "0px", JSON.stringify(focus));
    return focus;
  } catch (error) { throw new Error(`Keyboard focus failed at ${page.url()}`, { cause: error }); }
}

async function axe(page, width) {
  try {
    await page.addScriptTag({ path: AXE });
    const result = await page.evaluate(() => window.axe.run(document));
    await save(`axe-kent-${width}`, result);
    const severe = result.violations.filter(item => ["serious", "critical"].includes(item.impact));
    assert.deepEqual(severe.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })), []);
    return result.violations.map(({ id, impact }) => ({ id, impact }));
  } catch (error) { throw new Error(`Kent axe failed at ${width}px`, { cause: error }); }
}

async function capture(page, label, width) {
  try {
    await page.screenshot({ path: `${EVIDENCE}/${label}-kent-${width}-full.png`, fullPage: true });
    const headings = [["intro", "Premier Home Remodeling"], ["quotes", "Bathroom Remodels in Kent, WA"], ["services", "SERVICES WE OFFER"],
      ["contact", "Start Your Remodeling Project"], ["locations", "Areas We Serve"]];
    for (const [name, text] of headings) {
      const heading = page.locator(`${BODY} h2, ${BODY} h3`).filter({ hasText: text }).first();
      await heading.evaluate((element, offset) => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - offset, behavior: "instant" }), CAPTURE_TOP);
      await page.screenshot({ path: `${EVIDENCE}/${label}-kent-${width}-${name}.png` });
    }
  } catch (error) { throw new Error(`Cannot capture ${label} Kent at ${width}px`, { cause: error }); }
}

async function serviceImages(page, width) {
  try {
    const images = [];
    for (const route of SERVICES) {
      const image = page.locator(`${BODY} a[href="${route}"] img`);
      assert.equal(await image.count(), 1, route);
      await image.scrollIntoViewIfNeeded();
      const info = await image.evaluate(img => ({ src: img.getAttribute("src"), alt: img.alt,
        loaded: img.complete && img.naturalWidth > 0, box: img.getBoundingClientRect().toJSON() }));
      assert.ok(info.loaded && info.src.startsWith("/images/") && info.alt.length > 20, route);
      assert.ok(info.box.x >= 0 && info.box.right <= width && info.box.width > 0, route);
      await image.screenshot({ path: `${EVIDENCE}/after-kent-${width}-${route.slice(1)}.png` });
      images.push(info);
    }
    return images;
  } catch (error) { throw new Error(`Restored service image failure at ${width}px`, { cause: error }); }
}

async function assertKentWidgets(page) {
  try {
    const body = page.locator(BODY);
    const text = await body.innerText();
    assert.equal(await body.getByRole("link", { name: "REQUEST A FREE QUOTE", exact: true }).count(), 2);
    assert.equal(await body.getByRole("link", { name: "Learn more", exact: true }).count(), 5);
    assert.equal(text.match(/Learn more/g)?.length, 5, "Duplicated inactive service labels");
    assert.match(text, /follow the quote link below/);
    assert.doesNotMatch(text, /contact form below|253-352-4578/);
    assert.deepEqual(await body.locator('a[href^="tel:"]').evaluateAll(links => links.map(link => link.getAttribute("href"))),
      ["tel:253-216-2633", "tel:253-216-2633"]);
  } catch (error) { throw new Error("Rendered Kent widgets do not match the repaired state", { cause: error }); }
}

async function kent(page, width) {
  try {
    process.stdout.write(`Kent visual, focus and axe: ${width}px\n`);
    await open(page, BASE, KENT, width);
    const originalBody = await page.locator(BODY).innerHTML();
    await reveal(page);
    assertArticle(await page.evaluate(articleState, BODY), KENT);
    await assertKentWidgets(page);
    const images = await serviceImages(page, width);
    const geometry = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth }));
    assert.equal(geometry.width, width, `Kent overflow at ${width}`);
    const links = page.locator(`${BODY} a[href]`);
    const focus = [];
    for (const link of await links.all()) focus.push(await focusLink(page, link));
    const violations = await axe(page, width);
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: "instant" }); });
    await capture(page, "after", width);
    assert.equal(await page.locator(BODY).innerHTML(), originalBody, "Verification changed article content");
    report.kent.push({ width, height: HEIGHT, dpr: 1, images, geometry, focus, violations });
  } catch (error) { throw new Error(`Focused Kent regression at ${width}px`, { cause: error }); }
}

async function estimateForm(page) {
  try {
    const form = page.getByRole("form", { name: "Request a free estimate", exact: true });
    await form.scrollIntoViewIfNeeded();
    assert.equal(await form.getAttribute("action"), "/api/lead");
    assert.equal(await form.getAttribute("method"), "post");
    for (const name of ["name", "email", "phone", "projectDetails", "projectType", "consent"]) {
      const input = form.locator(`[name="${name}"]`).first();
      assert.equal(await input.getAttribute("required"), "", name);
      assert.equal(await input.isVisible(), true, name);
    }
    const button = form.getByRole("button", { name: "Request my free estimate" });
    assert.equal(await button.getAttribute("type"), "button");
    assert.equal(await button.isEnabled(), true);
    assert.equal(await form.evaluate(element => element.checkValidity()), false, "Empty estimate must be invalid");
    return { action: "/api/lead", requiredFields: 6, emptyFormValid: false, submitted: false };
  } catch (error) { throw new Error("Quote link did not reach the required estimate form", { cause: error }); }
}

async function navigateLink(page, selector, index, width) {
  try {
    await open(page, BASE, KENT, width);
    const link = page.locator(selector).nth(index);
    const href = await link.getAttribute("href");
    const destination = new URL(href, BASE);
    await focusLink(page, link);
    await page.keyboard.press("Enter");
    await page.waitForURL(destination.href, { timeout: TIMEOUT });
    if (destination.hash) assert.equal(await page.locator(destination.hash).count(), 1, href);
    const form = destination.pathname === "/schedule-an-estimate" ? await estimateForm(page) : null;
    assert.ok(await page.locator("main").innerText(), href);
    report.links.push({ href, width, keyboardNavigation: true, form });
  } catch (error) { throw new Error(`Link ${index} in ${selector} failed at ${width}px`, { cause: error }); }
}

async function navigation(page, width) {
  try {
    process.stdout.write(`Kent keyboard navigation: ${width}px\n`);
    await open(page, BASE, KENT, width);
    const selector = width === 390 ? `${BODY} a[href^="/"], main a[href="/schedule-an-estimate"]` : 'main a[href="/schedule-an-estimate"]';
    const count = await page.locator(selector).count();
    assert.ok(count >= 4, "Both quote replacements, contact quote and article estimate CTA must exist");
    for (let index = 0; index < count; index++) await step(`link ${width}/${index}`, () => navigateLink(page, selector, index, width));
  } catch (error) { throw new Error(`Kent navigation check failed at ${width}px`, { cause: error }); }
}

async function baseline(page, width) {
  try {
    await open(page, BASELINE, KENT, width); await reveal(page);
    const state = await page.evaluate(articleState, BODY);
    assert.ok(state.present, "Baseline article missing");
    assert.equal(state.images.filter(img => !img.src).length, 5, "Baseline must retain the five damaged service widgets");
    assert.match(state.text, INERT_COPY, "Baseline must retain inert form states");
    await capture(page, "before", width);
    report.before.push({ width, images: state.images, inertCopy: INERT_COPY.test(state.text) });
  } catch (error) { throw new Error(`Baseline evidence failed at ${width}px`, { cause: error }); }
}

async function pageForChecks(browser) {
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    page.setDefaultTimeout(TIMEOUT);
    page.on("pageerror", error => report.errors.push({ url: page.url(), message: error.message, stack: error.stack }));
    await page.route("**/*", async route => {
      try {
        const request = route.request();
        const isWrite = !["GET", "HEAD", "OPTIONS"].includes(request.method());
        const isLeadOrUpload = /\/api\/lead(?:\/|$)|upload/i.test(request.url()) || request.method() === "PUT";
        if (!isWrite || !isLeadOrUpload) return await route.continue();
        report.blockedWrites.push({ method: request.method(), url: request.url() });
        await route.abort();
      } catch (error) { report.failures.push({ label: "request guard", error: error.message }); }
    });
    return page;
  } catch (error) { throw new Error("Cannot create guarded browser page", { cause: error }); }
}

async function runChecks(browser) {
  let page;
  try {
    page = await pageForChecks(browser);
    for (const width of WIDTHS) await step(`baseline ${width}`, () => baseline(page, width));
    await step("102 sitemap routes", () => crawl(page));
    for (const width of WIDTHS) {
      await step(`Kent ${width}`, () => kent(page, width));
      await step(`navigation ${width}`, () => navigation(page, width));
    }
    assert.deepEqual(report.errors, [], "Unexpected browser page errors");
    assert.deepEqual(report.blockedWrites.filter(item => /\/api\/lead(?:\/|$)|upload/i.test(item.url)), [], "Lead or upload attempted");
    assert.equal(report.failures.length, 0, "See browser-results.json for failures");
  } catch (error) { throw new Error("Round 3 browser verification failed", { cause: error }); }
  finally { await page?.close(); }
}

async function run() {
  let browser;
  let deadline;
  try {
    await mkdir(EVIDENCE, { recursive: true });
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/var/lib/megaclaw/user-tools/apt/usr/lib/chromium/chromium",
      timeout: LAUNCH_TIMEOUT, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
    deadline = setTimeout(() => { void step("run deadline", () => browser.close()); }, RUN_TIMEOUT);
    await runChecks(browser);
    report.passed = true;
    process.stdout.write(`Passed ${report.routes.length} sitemap routes, ${report.kent.length} Kent viewports and ${report.links.length} link checks.\n`);
  } catch (error) {
    report.passed = false; report.failures.push({ label: "run", error: error.stack, cause: error.cause?.stack });
    process.stderr.write(`${error.stack}\n${error.cause?.stack || ""}\n`); process.exitCode = 1;
  } finally {
    clearTimeout(deadline);
    await save("browser-results", report);
    await browser?.close();
  }
}
await run();
