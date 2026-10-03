import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import { installMotionProbe, readLayout, readMotionState } from "./estimate-browser-probe.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require("/var/lib/megaclaw/workspace/gary-postlive-parity/node_modules/playwright");
const AXE = "/var/lib/megaclaw/workspace/gary-postlive-parity/node_modules/axe-core/axe.min.js";
const BASE = process.env.TEST_BASE_URL || "http://localhost:3187";
const EVIDENCE = process.env.EVIDENCE_DIR || "/var/lib/megaclaw/workspace/tubro-evidence/estimate-startup";
const PHASE = process.env.PHASE || "candidate";
const CANDIDATE = PHASE === "candidate";
const CASE = process.env.BROWSER_CASE;
const TIMELINE_EPSILON_MS = 0.000001;
const results = []; let browser;
const save = (name, value) => writeFile(`${EVIDENCE}/${PHASE}-${name}.json`, JSON.stringify(value, null, 2));

async function navigate(page) {
  try {
    const response = await page.goto(`${BASE}/schedule-an-estimate`, { waitUntil: "networkidle", timeout: 30000 });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1200);
  } catch (error) { throw new Error(`Estimate navigation: ${error.message}`); }
}

async function captureTrace(page) {
  const session = await page.context().newCDPSession(page); const events = [];
  try {
    session.on("Tracing.dataCollected", data => events.push(...data.value));
    await session.send("Profiler.enable"); await session.send("Profiler.start");
    await session.send("Tracing.start", { categories: "devtools.timeline,blink.user_timing,disabled-by-default-devtools.timeline.stack", transferMode: "ReportEvents" });
    await navigate(page);
    const { profile } = await session.send("Profiler.stop"); await save("startup-profile", profile);
    const done = new Promise(resolve => session.once("Tracing.tracingComplete", resolve));
    await session.send("Tracing.end"); await done; await save("startup-trace", { traceEvents: events });
    await save("startup", await page.evaluate(readMotionState));
  } catch (error) { throw new Error(`Startup trace: ${error.message}`); }
  finally { await session.detach(); }
}

function verifyTimelines(state, width) {
  for (const animation of state.animations) {
    const heading = animation.kind === "heading";
    assert.equal(animation.options.duration, heading ? 650 : 500);
    assert.equal(animation.options.delay, animation.expectedDelay);
    assert.equal(animation.options.easing, "cubic-bezier(.16,1,.3,1)");
    assert.equal(animation.frames[0].transform, `translateY(${heading && width > 700 ? 22 : 12}px)`);
    if (CANDIDATE) {
      assert.ok(!animation.events.some(event => event.method === "pause"));
      assert.ok(animation.events.some(event => event.method === "finish"));
      const duration = animation.options.duration + animation.options.delay;
      assert.ok(animation.events.some(event => event.method === "cancel" && Math.abs(event.time - duration) < TIMELINE_EPSILON_MS));
    }
  }
  assert.ok(state.animations.length >= 20, "scroll reached the authored reveal targets");
  for (const [index, step] of state.steps.entries()) {
    assert.equal(step.visible, "true"); assert.equal(step.duration, "0.65s");
    assert.equal(step.delay, `${index * 0.08}s`);
    assert.equal(step.easing, "cubic-bezier(0.16, 1, 0.3, 1)");
    assert.match(step.name, width <= 540 ? /estimate-line-vertical/ : /estimate-line-horizontal/);
  }
}

async function scrollMotion(page, width) {
  try {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let top = 0; top < height; top += 400) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), top); await page.waitForTimeout(150);
    }
    await page.waitForTimeout(1200);
    const state = await page.evaluate(readMotionState); verifyTimelines(state, width);
    await page.locator("#what-happens-next").evaluate(element => element.scrollIntoView({ behavior: "instant" }));
    await page.screenshot({ path: `${EVIDENCE}/${PHASE}-${width}-scroll.png` });
    await save(`${width}-timeline`, state);
  } catch (error) { throw new Error(`Scroll motion at ${width}: ${error.message}`); }
}

async function keyboardAndSmoke(page, width) {
  try {
    await page.locator('#recent-work a[href="/recent-projects"]').first().focus();
    await page.locator('#recent-work a[href="/recent-projects"]').first().evaluate(element => element.scrollIntoView({ behavior: "instant", block: "center" }));
    await page.waitForTimeout(1200);
    const focused = await page.evaluate(() => ({ text: document.activeElement.textContent,
      transform: getComputedStyle(document.activeElement).transform, outline: getComputedStyle(document.activeElement).outlineStyle }));
    assert.equal(focused.transform, "none"); assert.notEqual(focused.outline, "none");
    await page.screenshot({ path: `${EVIDENCE}/${PHASE}-${width}-keyboard-settled.png` });
    await page.locator("#questions summary").first().press("Enter"); assert.equal(await page.locator("#questions details[open]").count(), 1);
    await page.getByRole("radio").first().check(); assert.ok(await page.getByRole("radio").first().isChecked());
    await page.locator('[name="name"]').fill("Local smoke");
    assert.equal(await page.locator('[name="name"]').inputValue(), "Local smoke");
    return focused;
  } catch (error) { throw new Error(`Estimate keyboard/smoke at ${width}: ${error.message}`); }
}

async function checkWidth(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } }); const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await page.addInitScript(installMotionProbe);
    if (width === 390) await captureTrace(page); else await navigate(page);
    const startup = await page.evaluate(readMotionState);
    if (CANDIDATE) assert.equal(startup.animations.length, 0, "no offscreen preparation at startup");
    const layout = await page.evaluate(readLayout); assert.equal(layout.scrollWidth, width);
    assert.deepEqual(layout.main, { id: "main-content", tabIndex: -1 });
    await save(`${width}-layout`, layout);
    await page.screenshot({ path: `${EVIDENCE}/${PHASE}-${width}-initial.png` });
    await page.addScriptTag({ path: AXE }); const axe = await page.evaluate(() => axe.run(document.querySelector("main")));
    await save(`${width}-axe`, axe); assert.equal(axe.violations.length, 0);
    await scrollMotion(page, width); const focus = await keyboardAndSmoke(page, width);
    results.push({ width, startupAnimations: startup.animations.length, startupRects: startup.calls.length, axeViolations: axe.violations.length, focus, errors });
  } catch (error) { throw new Error(`Viewport ${width}: ${error.message}`); }
  finally { await page.close(); }
}

async function reducedMotion() {
  const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 390, height: 900 } });
  try {
    await page.addInitScript(installMotionProbe); await navigate(page);
    assert.equal((await page.evaluate(readMotionState)).animations.length, 0);
    assert.equal(await page.locator("main").evaluate(element => element.getAnimations({ subtree: true }).length), 0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.locator("#what-happens-next").evaluate(element => element.scrollIntoView({ behavior: "instant" }));
    await page.waitForTimeout(100); await page.emulateMedia({ reducedMotion: "reduce" });
    const active = await page.locator("main").evaluate(element => element.getAnimations({ subtree: true }).length);
    assert.equal(active, 0); results.push({ reducedMotion: "initial and change cancel passed" });
  } catch (error) { throw new Error(`Motion preference: ${error.message}`); }
  finally { await page.close(); }
}

async function noObserver() {
  const page = await browser.newPage(); const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await page.addInitScript(() => { delete window.IntersectionObserver; }); await navigate(page);
    const text = await page.evaluate(() => document.querySelector("h1")?.textContent);
    const forms = await page.locator("form").count();
    if (CANDIDATE) { assert.ok(text.includes("what’s next")); assert.equal(forms, 1); assert.equal(errors.length, 0); }
    results.push({ noObserver: { errors, h1: text, forms } });
  } catch (error) { throw new Error(`Observer fallback: ${error.message}`); }
  finally { await page.close(); }
}

async function focusDuringReveal() {
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  try {
    await page.addInitScript(installMotionProbe); await navigate(page);
    await page.locator("#questions").evaluate(element => element.scrollIntoView({ behavior: "instant" }));
    await page.waitForTimeout(60);
    const before = await page.locator("#questions [data-estimate-enter='body']").evaluate(element => element.getAnimations().length);
    assert.equal(before, 1, "paragraph reveal is running before focus");
    await page.locator('#questions a[href="/contact"]').focus();
    const after = await page.locator("#questions [data-estimate-enter='body']").evaluate(element => ({
      active: element.getAnimations().length, transform: getComputedStyle(element).transform }));
    assert.deepEqual(after, { active: 0, transform: "none" });
    await page.locator("#main-content").focus();
    const states = await page.locator("[data-estimate-enter]").evaluateAll(elements => elements.map(element => getComputedStyle(element).transform));
    assert.ok(states.every(transform => transform === "none"));
    await page.locator("#talk-to-us").evaluate(element => element.scrollIntoView({ behavior: "instant" }));
    await page.waitForTimeout(100); assert.equal(await page.locator("#talk-to-us").evaluate(element => element.getAnimations({ subtree: true }).length), 0);
    results.push({ focusDuringReveal: { before, after, mainFocusRevealsAll: true } });
  } catch (error) { throw new Error(`Focus during reveal: ${error.message}`); }
  finally { await page.close(); }
}

async function keyboardScreenshots() {
  try {
    for (const width of [195, 390, 834, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      try { await navigate(page); results.push({ width, focus: await keyboardAndSmoke(page, width) }); }
      finally { await page.close(); }
    }
  } catch (error) { throw new Error(`Settled keyboard screenshots: ${error.message}`); }
}

try {
  browser = await chromium.launch({ headless: true, timeout: 15000,
    executablePath: "/var/lib/megaclaw/user-tools/apt/usr/lib/chromium/chromium", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  if (CASE === "fallback") await noObserver();
  else if (CASE === "keyboard") await keyboardScreenshots();
  else {
    for (const width of [390, 1440, 834, 195]) await checkWidth(width);
    await reducedMotion(); await noObserver();
    if (CANDIDATE) await focusDuringReveal();
  }
} catch (error) { results.push({ error: error.message }); process.exitCode = 1; }
finally { await save(CASE ? `${CASE}-results` : "browser-results", results); await browser?.close(); }
