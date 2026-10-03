/** Local production regression harness. Provider/lead requests are never submitted. */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "/var/lib/megaclaw/workspace/gary-postlive-parity/node_modules/playwright");
const AXE = process.env.AXE_PATH || "/var/lib/megaclaw/workspace/gary-postlive-parity/node_modules/axe-core/axe.min.js";
const BASE = process.env.TEST_BASE_URL || "http://localhost:3193";
const EVIDENCE = process.env.EVIDENCE_DIR || "/var/lib/megaclaw/workspace/tubro-evidence/r2";
const WIDTHS = [320, 390, 834, 1440];
const HEIGHT = 900;
const MIN_TARGET = 44;
const MIN_FONT = 14;
const MEDIA_CHANGE_TIMEOUT = 250;
const ROUTES = [
  ["general", "/general-contractor"],
  ["painting", "/interior-exterior-painting"],
  ["article", "/blog/kitchen-remodel-cost-washington-state"],
];
const reports = [];

async function open(page, route, width) {
  try {
    await page.setViewportSize({ width, height: HEIGHT });
    const response = await page.goto(BASE + route, { waitUntil: "load" });
    assert.equal(response.status(), 200, route);
    await page.evaluate(() => document.fonts.ready);
  } catch (error) { throw new Error(`Failed to load ${route} at ${width}px`, { cause: error }); }
}

async function reveal(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" }); await new Promise(resolve => setTimeout(resolve, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1400);
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0), null, { timeout: 20000 });
}

function linkMeasurements(selector) {
  return [...document.querySelectorAll(selector)].map(element => {
    const box = element.getBoundingClientRect(); const style = getComputedStyle(element);
    return { text: element.textContent.trim(), href: element.getAttribute("href"), width: box.width, height: box.height,
      x: box.x, y: box.y, font: parseFloat(style.fontSize), rects: element.getClientRects().length };
  }).filter(item => item.width && item.height);
}

function assertTargets(items, context) {
  assert.ok(items.length, `${context}: no targets measured`);
  for (const item of items) {
    assert.ok(item.width >= MIN_TARGET - 0.1 && item.height >= MIN_TARGET - 0.1,
      `${context}: ${item.text} is ${item.width} × ${item.height}`);
  }
  for (const [index, first] of items.entries()) {
    for (const second of items.slice(index + 1)) {
      const overlapX = Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x);
      const overlapY = Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y);
      assert.ok(overlapX < 0.1 || overlapY < 0.1, `${context}: overlapping targets ${first.text} / ${second.text}`);
    }
  }
}

async function typography(page, name) {
  const selector = name === "general" ? '[class*="serviceArea"], [class*="formPanel"] label[for]' :
    '[class*="caption"], [class*="hours"], [class*="email"]';
  const sizes = await page.locator(selector).evaluateAll(elements => elements.map(element => ({
    text: element.textContent.trim(), font: parseFloat(getComputedStyle(element).fontSize),
  })));
  assert.ok(sizes.length); sizes.forEach(item => assert.ok(item.font >= MIN_FONT, `${name}: ${item.text} at ${item.font}px`));
  return sizes;
}

async function checkLabels(page) {
  const labels = await page.locator('input[type="radio"], input[type="checkbox"]').evaluateAll(inputs => inputs.map(input => {
    const label = input.labels[0]; const box = label.getBoundingClientRect();
    return { text: label.textContent.trim(), width: box.width, height: box.height, x: box.x, y: box.y };
  }));
  assertTargets(labels, "Associated radio/checkbox labels");
  const first = page.locator('input[type="radio"]').first();
  await first.focus(); await page.keyboard.press("Space"); assert.equal(await first.isChecked(), true);
  return labels;
}

async function checkFocus(page, selector) {
  const link = page.locator(selector).first();
  await link.focus(); await page.keyboard.press("Shift+Tab"); await page.keyboard.press("Tab");
  assert.equal(await link.evaluate(element => element === document.activeElement), true);
  const focus = await link.evaluate(element => ({ visible: element.matches(":focus-visible"),
    outline: getComputedStyle(element).outlineStyle, width: getComputedStyle(element).outlineWidth }));
  assert.ok(focus.visible && focus.outline !== "none" && focus.width !== "0px", JSON.stringify(focus));
  return focus;
}

async function checkAxe(page, route, width) {
  process.stdout.write(`Axe ${route} ${width}\n`);
  await page.addScriptTag({ path: AXE });
  const result = await page.evaluate(() => window.axe.run(document));
  const serious = result.violations.filter(item => ["serious", "critical"].includes(item.impact));
  await writeFile(`${EVIDENCE}/axe-${route}-${width}.json`, JSON.stringify(result, null, 2));
  assert.deepEqual(serious.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), []);
  return result.violations.map(({ id, impact }) => ({ id, impact }));
}

async function measure(page, name, route, width) {
  process.stdout.write(`Measuring ${name} ${width}\n`);
  await open(page, route, width); process.stdout.write("Loaded\n"); await reveal(page); process.stdout.write("Revealed\n");
  const selector = name === "article" ? 'main a[href]' : name === "general" ?
    '[class*="contactRow"] a[href]' : '[class*="phone"][href^="tel:"], [class*="email"][href^="mailto:"]';
  const targets = await page.evaluate(linkMeasurements, selector); assertTargets(targets, `${name} ${width}`);
  const layout = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  assert.equal(layout.document, width, `${name}: overflow at ${width}`);
  const fonts = name === "article" ? [] : await typography(page, name);
  if (name === "painting") assert.equal(await page.getByRole("img", { name: "Project palette: green siding, light trim, dark shingles" }).count(), 1);
  const labels = name === "general" ? await checkLabels(page) : [];
  const focus = await checkFocus(page, name === "article" ? '[data-article-body] a[href]' : selector); await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: "instant" }); });
  const violations = width === 320 ? [] : await checkAxe(page, name, width);
  if (width !== 320) await page.screenshot({ path: `${EVIDENCE}/after-${name}-${width}.png`, fullPage: true });
  reports.push({ name, route, width, dpr: 1, layout, targets, fonts, labels, focus, violations });
}

async function articleWrapping(page) {
  for (const route of ["/backlinks", "/Bathroom-Remodels-Kent-WA", "/blog/kitchen-remodel-cost-pierce-county-a-homeowner-guide"]) {
    for (const width of WIDTHS) {
      await open(page, route, width);
      const targets = await page.evaluate(linkMeasurements, '[data-article-body] a[href]');
      assertTargets(targets, `${route} ${width}`);
      const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        tables: [...document.querySelectorAll('table')].map(table => ({ width: table.getBoundingClientRect().width, scrollWidth: table.scrollWidth })) }));
      assert.equal(layout.scrollWidth, width, `${route} overflow at ${width}`);
      reports.push({ route, width, targets, layout });
    }
  }
}

async function motion(page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/general-contractor", 390); await reveal(page);
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0, "Seen content must not replay on preference change");
  await open(page, "/general-contractor", 390);
  await page.waitForTimeout(1400);
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0, "No paused belowfold animations");
  await page.locator('#process-faq').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const running = await page.evaluate(() => document.getAnimations().map(animation => ({ state: animation.playState,
    target: animation.effect.target.tagName, duration: animation.effect.getTiming().duration })));
  assert.ok(running.some(animation => animation.state === "running"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() => document.getAnimations().length === 0, null, { timeout: MEDIA_CHANGE_TIMEOUT });
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  reports.push({ motion: { reduced: "no animations", pending: 0, running, preferenceChange: "cancelled" } });
}

async function pageForCheck(browser, errors) {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  page.setDefaultTimeout(20000);
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/api/lead", route => route.abort());
  return page;
}

async function matrix(browser, errors) {
  for (const [name, route] of ROUTES) {
    for (const width of WIDTHS) {
      const page = await pageForCheck(browser, errors);
      try { await measure(page, name, route, width); }
      finally { await page.close(); }
    }
  }
}

async function run() {
  let browser;
  try {
    await mkdir(EVIDENCE, { recursive: true });
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/var/lib/megaclaw/user-tools/apt/usr/lib/chromium/chromium",
      timeout: 15000, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
    const errors = [];
    await matrix(browser, errors);
    const page = await pageForCheck(browser, errors);
    await articleWrapping(page); await motion(page); assert.deepEqual(errors, []);
    process.stdout.write(`Passed ${reports.length} route/viewport and motion checks; zero page errors.\n`);
  } catch (error) { process.stderr.write(`Round 2 browser regression failed: ${error.stack}\n${error.cause?.stack || ""}\n`); process.exitCode = 1; }
  finally { await writeFile(`${EVIDENCE}/browser-results.json`, JSON.stringify(reports, null, 2)); await browser?.close(); }
}
await run();
