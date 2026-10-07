import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const BASE = process.env.TEST_BASE_URL || "http://127.0.0.1:43190";
const EVIDENCE = process.env.EVIDENCE_DIR;
const LABEL = "Explore Tubro's completed projects";
const MIN_TARGET = 44;
const MAX_TABS = 60;
let browser;

before(async () => {
  try {
    assert.ok(["127.0.0.1", "localhost"].includes(new URL(BASE).hostname), "Use a local validation server");
    if (EVIDENCE) await mkdir(EVIDENCE, { recursive: true });
    browser = await chromium.launch({ headless: true, timeout: 10000,
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
      args: ["--no-sandbox"] });
  } catch (error) { throw new Error(`Hitbox browser setup: ${error.message}`, { cause: error }); }
});

after(async () => {
  try { await browser?.close(); }
  catch (error) { throw new Error(`Hitbox browser cleanup: ${error.message}`, { cause: error }); }
});

function inspectAnchor(anchor) {
  const rect = anchor.getBoundingClientRect();
  const style = getComputedStyle(anchor);
  const icon = anchor.querySelector("svg").getBoundingClientRect();
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  const points = [[centerX, centerY], [rect.left + 1, centerY], [rect.right - 1, centerY],
    [centerX, rect.top + 1], [centerX, rect.bottom - 1]];
  return {
    width: rect.width, height: rect.height,
    nativeHits: points.map(([x, y]) => anchor.contains(document.elementFromPoint(x, y))),
    borderRadius: style.borderRadius, borderWidth: style.borderTopWidth,
    icon: { width: icon.width, height: icon.height },
    caption: anchor.parentElement.querySelector("span").textContent,
    pseudoContent: ["::before", "::after"].map(pseudo => getComputedStyle(anchor, pseudo).content),
    overflow: document.documentElement.scrollWidth > innerWidth,
  };
}

function assertAnchor(metrics) {
  assert.ok(metrics.width >= MIN_TARGET, `Visible anchor width ${metrics.width}px < ${MIN_TARGET}px`);
  assert.ok(metrics.height >= MIN_TARGET, `Visible anchor height ${metrics.height}px < ${MIN_TARGET}px`);
  assert.deepEqual(metrics.nativeHits, [true, true, true, true, true], "Native center and four edge hits reach the anchor");
  assert.equal(metrics.borderRadius, "50%");
  assert.equal(metrics.borderWidth, "1px");
  assert.deepEqual(metrics.icon, { width: 23, height: 23 });
  assert.equal(metrics.caption, "Room for your everyday.");
  assert.deepEqual(metrics.pseudoContent, ["none", "none"], "No pseudo-element hitbox");
  assert.equal(metrics.overflow, false, "No horizontal page overflow");
}

async function openEstimate(page) {
  try {
    await page.goto(`${BASE}/schedule-an-estimate`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const anchor = page.getByRole("link", { name: LABEL, exact: true });
    assert.equal(await anchor.count(), 1);
    assert.equal(await anchor.getAttribute("href"), "/recent-projects");
    await anchor.scrollIntoViewIfNeeded();
    return anchor;
  } catch (error) { throw new Error(`Open estimate target: ${error.message}`, { cause: error }); }
}

async function checkKeyboard(page, anchor, width) {
  try {
    let focused = false;
    for (let index = 0; index < MAX_TABS && !focused; index++) {
      await page.keyboard.press("Tab");
      focused = await anchor.evaluate(element => element === document.activeElement);
    }
    assert.ok(focused, "Tab reaches the named native link");
    const focus = await anchor.evaluate(element => ({ visible: element.matches(":focus-visible"),
      width: getComputedStyle(element).outlineWidth, style: getComputedStyle(element).outlineStyle }));
    assert.deepEqual(focus, { visible: true, width: "2px", style: "solid" });
    if (EVIDENCE) await page.screenshot({ path: path.join(EVIDENCE, `estimate-focus-${width}.png`) });
    await page.keyboard.press("Enter");
    await page.waitForURL(`${BASE}/recent-projects`);
    return focus;
  } catch (error) { throw new Error(`Keyboard target at ${width}px: ${error.message}`, { cause: error }); }
}

for (const width of [390, 834, 1440]) {
  test(`estimate project link has a native 44px target at ${width}px`, async context => {
    let page;
    try {
      page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce", serviceWorkers: "block" });
      await page.route("**/*", route => new URL(route.request().url()).origin === new URL(BASE).origin &&
        route.request().method() === "GET" ? route.continue() : route.abort());
      const anchor = await openEstimate(page);
      const metrics = await anchor.evaluate(inspectAnchor);
      context.diagnostic(JSON.stringify({ viewport: width, ...metrics }));
      if (EVIDENCE) await page.screenshot({ path: path.join(EVIDENCE, `estimate-${width}.png`), fullPage: true });
      assertAnchor(metrics);
      const rect = await anchor.boundingBox();
      await page.mouse.click(rect.x + rect.width - 1, rect.y + rect.height / 2);
      await page.waitForURL(`${BASE}/recent-projects`);
      const keyboardAnchor = await openEstimate(page);
      const focus = await checkKeyboard(page, keyboardAnchor, width);
      context.diagnostic(JSON.stringify({ viewport: width, edgeClick: "passed", keyboardNavigation: "passed", focus }));
    } catch (error) { throw new Error(`Estimate target at ${width}px: ${error.message}`, { cause: error }); }
    finally { await page?.close(); }
  });
}
