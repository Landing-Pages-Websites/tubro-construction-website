/** Supplemental rendered acceptance; the controller's checker stays unchanged. */
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const AXE = require.resolve(process.env.AXE_MODULE || "axe-core/axe.min.js");
const BASE = process.env.TEST_BASE_URL || "http://127.0.0.1:3187";
const EVIDENCE = process.env.EVIDENCE_DIR || "/var/lib/megaclaw/workspace/tubro-evidence/browser-fixed";
const ROUTES = ["/", "/schedule-an-estimate", "/contact", "/careers", "/kitchen-remodeling", "/bathroom-remodeling", "/recent-projects", "/blog", "/blog/kitchen-remodel-cost-washington-state", "/service-area/home-remodeling-maple-valley", "/privacy"];
const WIDTHS = [195, 390, 834, 1440];
const results = [];
const errors = [];
let browser;

async function settle(page) {
  try {
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let y = 0; y < document.documentElement.scrollHeight; y += 650) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(1600);
  } catch (error) { throw new Error(`Stable scroll failed: ${error.message}`); }
}

function installMeasurements() {
  const visible = element => {
    if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
    const style = getComputedStyle(element);
    if (style.clipPath === "inset(50%)" && element.getBoundingClientRect().width <= 1) return false;
    for (const ancestor of element.closest("details:not([open])") ? [element.closest("details:not([open])")] : []) {
      if (!ancestor.querySelector("summary")?.contains(element)) return false;
    }
    return !element.closest("[inert]");
  };
  const describe = element => ({ tag: element.tagName, class: element.getAttribute("class"), text: (element.getAttribute("aria-label") || element.textContent || "").trim().slice(0, 100) });
  const size = element => { const { width, height } = element.getBoundingClientRect(); return { width, height }; };
  window.residualMeasurements = { visible, describe, size };
}

function measureTargets() {
  const { visible, describe, size } = window.residualMeasurements;
  return [...document.querySelectorAll("a[href], button, input:not([type=hidden]), select, textarea, summary")].filter(element => {
    const label = element.matches("input[type=radio], input[type=checkbox]") ? element.labels?.[0] : null;
    if (!visible(label || element) || element.classList.contains("skip-link")) return false;
    return element.getBoundingClientRect().width > 0;
  }).map(element => {
    const label = element.matches("input[type=radio], input[type=checkbox]") ? element.labels?.[0] : null;
    const effective = size(label || element);
    const prose = !!element.closest("[data-article-body] p, [data-article-body] li, [data-article-body] td");
    return { ...describe(element), type: element.getAttribute("type"), native: size(element), effective, label: label ? describe(label) : null, prose, short: effective.width < 43.99 || effective.height < 43.99 };
  });
}

function clippedControls() {
  const { visible, describe } = window.residualMeasurements;
  return [...document.querySelectorAll("a[href], button, summary, input, textarea, select")].filter(element => {
    if (!visible(element) || element.classList.contains("skip-link") || window.containedScroll(element)) return false;
    const rect = element.getBoundingClientRect();
    return rect.width && (rect.left < -2 || rect.right > innerWidth + 2 || window.clippingFor(element, [rect]).length);
  }).map(describe);
}

function textRects() {
  const { visible, describe } = window.residualMeasurements;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const result = [];
  let node;
  while ((node = walker.nextNode())) {
    const element = node.parentElement;
    if (!(element instanceof HTMLElement) || !node.textContent.trim() || !visible(element)) continue;
    if (element.closest("script, style, .skip-link")) continue;
    const range = document.createRange();
    range.selectNode(node);
    const rects = [...range.getClientRects()].filter(rect => rect.width && rect.height);
    if (!rects.length) continue;
    result.push({ node, element, description: describe(element), rects, font: parseFloat(getComputedStyle(element).fontSize) });
  }
  return result;
}

function clippingFor(element, rects) {
  const clipped = [];
  let scrollX = false;
  for (let parent = element; parent && parent !== document.body; parent = parent.parentElement) {
    const style = getComputedStyle(parent);
    const bounds = parent.getBoundingClientRect();
    scrollX ||= ["auto", "scroll"].includes(style.overflowX);
    const x = !scrollX && ["hidden", "clip"].includes(style.overflowX);
    const y = ["hidden", "clip"].includes(style.overflowY);
    // A modal's top-layer box is independent of its DOM ancestors' clipping.
    if (parent.matches(":modal")) break;
    if (!x && !y) continue;
    if (rects.some(rect => (x && (rect.left < bounds.left - 2 || rect.right > bounds.right + 2)) || (y && (rect.top < bounds.top - 2 || rect.bottom > bounds.bottom + 2)))) {
      clipped.push({ tag: parent.tagName, class: parent.getAttribute("class") });
    }
  }
  return clipped;
}

function containedScroll(element) {
  for (let parent = element; parent && parent !== document.body; parent = parent.parentElement) {
    if (["auto", "scroll"].includes(getComputedStyle(parent).overflowX) && parent.scrollWidth > parent.clientWidth) return true;
  }
  return false;
}

async function textMeasurements(page) {
  try {
    await page.evaluate(`window.textRects = ${textRects.toString()}; window.clippingFor = ${clippingFor.toString()}; window.containedScroll = ${containedScroll.toString()};`);
    return await page.evaluate(() => {
      const rows = window.textRects();
      return {
        fontsBelow14: rows.filter(row => row.font < 14).map(row => ({ ...row.description, font: row.font })),
        textOutsideViewport: rows.filter(row => !window.containedScroll(row.element) && row.rects.some(rect => rect.left < -2 || rect.right > innerWidth + 2)).map(row => row.description),
        containedScrollText: rows.filter(row => window.containedScroll(row.element)).map(row => row.description),
        clippedText: rows.flatMap(row => { const ancestors = window.clippingFor(row.element, row.rects); return ancestors.length ? [{ ...row.description, ancestors }] : []; }),
      };
    });
  } catch (error) { throw new Error(`Text measurement failed: ${error.message}`); }
}

async function measure(page, route, width) {
  try {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: width === 195 ? "reduce" : "no-preference" });
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await settle(page);
    await page.evaluate(installMeasurements);
    const targets = await page.evaluate(measureTargets);
    const text = await textMeasurements(page);
    const controlsOutsideViewport = await page.evaluate(clippedControls);
    await page.addScriptTag({ path: AXE });
    const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] } })).violations);
    const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    const screenshot = path.join(EVIDENCE, `final-${route.replace(/\W+/g, "-")}-${width}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    results.push({ route, width, reducedMotion: width === 195, layout, violations, targets, controlsOutsideViewport, ...text, screenshot });
    process.stdout.write(`${route} ${width}: width=${layout.scrollWidth}, axe=${violations.length}, short=${targets.filter(t => t.short && !t.prose).length}, clipped=${text.clippedText.length}\n`);
  } catch (error) { throw new Error(`${route} at ${width}px: ${error.message}`); }
}

async function keyboard(page) {
  try {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(BASE + "/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    const skipLink = await page.locator("main#main-content").evaluate(element => element === document.activeElement);
    await page.getByLabel("Menu", { exact: true }).click();
    await page.keyboard.press("Escape");
    const menuEscape = await page.locator("details[open]").count() === 0;
    const control = page.getByRole("button", { name: "Explore the interactive portfolio" });
    await control.click();
    await page.waitForFunction(() => document.activeElement?.tagName === "IFRAME");
    await page.keyboard.press("Escape");
    const portfolioEscape = await control.evaluate(element => element === document.activeElement);
    const focus = await control.evaluate(element => ({ outline: getComputedStyle(element).outlineStyle, color: getComputedStyle(element).outlineColor }));
    const value = { skipLink, menuEscape, portfolioEscape, focus };
    await writeFile(path.join(EVIDENCE, "keyboard.json"), JSON.stringify(value, null, 2));
    if (!skipLink || !menuEscape || !portfolioEscape || focus.outline === "none") throw new Error(JSON.stringify(value));
  } catch (error) { throw new Error(`Keyboard acceptance failed: ${error.message}`); }
}

function summary() {
  const pick = (test, field) => results.filter(test).map(row => ({ route: row.route, width: row.width, [field]: row[field] }));
  return {
    renderedCases: results.length, routes: ROUTES.length, widths: WIDTHS,
    overflows: pick(row => row.layout.scrollWidth !== row.width, "layout"),
    axe: pick(row => row.violations.length, "violations"),
    shortTargets: results.flatMap(row => row.targets.filter(t => t.short && !t.prose).map(target => ({ route: row.route, width: row.width, target }))),
    proseExceptions: results.flatMap(row => row.targets.filter(t => t.short && t.prose).map(target => ({ route: row.route, width: row.width, target }))),
    fontsBelow14: pick(row => row.fontsBelow14.length, "fontsBelow14"),
    textOutsideViewport: pick(row => row.textOutsideViewport.length, "textOutsideViewport"),
    clippedText: pick(row => row.clippedText.length, "clippedText"), errors,
    controlsOutsideViewport: pick(row => row.controlsOutsideViewport.length, "controlsOutsideViewport"),
  };
}

async function measureRoutes(page, routes, width) {
  try {
    for (const route of routes) await measure(page, route, width);
  } catch (error) { throw new Error(`Browser matrix failed: ${error.message}`); }
}

try {
  await mkdir(EVIDENCE, { recursive: true });
  browser = await chromium.launch({ headless: true, timeout: 10000, executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] });
  const pages = await Promise.all([browser.newPage(), browser.newPage()]);
  pages.forEach(page => page.on("pageerror", error => errors.push(error.message)));
  for (const width of WIDTHS) {
    await Promise.all(pages.map((page, index) => measureRoutes(page, ROUTES.filter((_, position) => position % pages.length === index), width)));
  }
  await keyboard(pages[0]);
  await Promise.all(pages.map(page => page.close()));
} catch (error) { errors.push(error.stack); process.exitCode = 1; }
finally {
  results.sort((a, b) => WIDTHS.indexOf(a.width) - WIDTHS.indexOf(b.width) || ROUTES.indexOf(a.route) - ROUTES.indexOf(b.route));
  const report = summary();
  const failures = ["overflows", "axe", "shortTargets", "fontsBelow14", "textOutsideViewport", "clippedText", "controlsOutsideViewport", "errors"];
  if (results.length !== ROUTES.length * WIDTHS.length || failures.some(key => report[key].length)) process.exitCode = 1;
  await writeFile(path.join(EVIDENCE, "browser-details.json"), JSON.stringify(results, null, 2));
  await writeFile(path.join(EVIDENCE, "summary.json"), JSON.stringify(report, null, 2));
  await browser?.close();
}
