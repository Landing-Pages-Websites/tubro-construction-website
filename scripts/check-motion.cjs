/* Run against a production preview. Uses an existing Playwright installation. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const origin = process.env.PREVIEW_URL || 'http://localhost:3003';
const output = process.env.MOTION_OUTPUT || 'motion-artifacts';
const MOTION_TARGETS = '.reveal, [data-motion-stagger] > *, [data-motion-hero]';

async function allTargetsVisible(page) {
  for (const block of await page.locator(MOTION_TARGETS).all()) {
    assert.equal(await block.evaluate(el => getComputedStyle(el).opacity), '1');
    assert.equal(await block.evaluate(el => getComputedStyle(el).transform), 'none');
    assert.equal(await block.evaluate(el => el.classList.contains('motion-pending')), false);
    assert.equal(await block.evaluate(el => el.style.transitionDelay), '', 'inline delays must be cleared');
  }
}

async function checkHeroEntrance(page) {
  assert.ok(await page.locator('[data-motion-hero="copy"]').count() > 0, 'hero copy hooks present');
  const before = await page.locator('h1').evaluate(el => [el.offsetTop, el.offsetLeft, el.offsetWidth]);
  await page.waitForFunction(
    () => !document.querySelector('.motion-hero, .motion-hero-run'),
    undefined,
    { timeout: 5000 },
  );
  for (const group of await page.locator('[data-motion-hero]').all()) {
    assert.equal(await group.evaluate(el => getComputedStyle(el).opacity), '1', 'hero groups must settle visible');
    assert.equal(await group.evaluate(el => getComputedStyle(el).transform), 'none');
    assert.equal(await group.evaluate(el => getComputedStyle(el).willChange), 'auto', 'will-change must be removed');
  }
  const after = await page.locator('h1').evaluate(el => [el.offsetTop, el.offsetLeft, el.offsetWidth]);
  assert.deepEqual(after, before, 'hero entrance must not shift layout');
}

async function checkVariant(browser, variant, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/variant-${variant}`);
  await page.waitForSelector('[data-motion-ready]');
  assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).opacity), '1', 'initial viewport must be visible');
  await checkHeroEntrance(page);
  await page.screenshot({ path: `${output}/${variant}-${width}-entrance.png` });
  for (const section of await page.locator('main section').all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  }
  await allTargetsVisible(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(100);
  await allTargetsVisible(page);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow');
  await page.screenshot({ path: `${output}/${variant}-${width}-final.png`, fullPage: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForSelector('[data-motion-ready]');
  assert.equal(await page.locator('.motion-hero, .motion-hero-run').count(), 0, 'reduced motion must skip hero entrance');
  await allTargetsVisible(page);
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0, 'reduced motion must not animate');
  assert.deepEqual(errors, []);
  await page.close();
}

async function checkNoJs(browser, variant) {
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(`${origin}/variant-${variant}`);
  assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).opacity), '1');
  await allTargetsVisible(page);
  await page.close();
}

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const variant of ['a', 'b']) {
      for (const width of [1440, 390]) await checkVariant(browser, variant, width);
      await checkNoJs(browser, variant);
    }
    process.stdout.write('Both variants passed: hero entrance, reveals, no replay, overflow, reduced motion, no-JS, runtime errors.\n');
  } finally { await browser.close(); }
}
main().catch(error => { process.stderr.write(`${error.stack}\n`); process.exitCode = 1; });
