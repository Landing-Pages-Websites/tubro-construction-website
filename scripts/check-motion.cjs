/* Run against a production preview. Uses an existing Playwright installation. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const origin = process.env.PREVIEW_URL || 'http://localhost:3003';
const output = process.env.MOTION_OUTPUT || 'motion-artifacts';

async function allRevealsVisible(page) {
  for (const block of await page.locator('.reveal').all()) {
    assert.equal(await block.evaluate(el => getComputedStyle(el).opacity), '1');
    assert.equal(await block.evaluate(el => getComputedStyle(el).transform), 'none');
    assert.equal(await block.getAttribute('style'), null, 'delay/transition styles must be cleared');
  }
}

async function checkVariant(browser, variant, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/variant-${variant}`);
  await page.waitForSelector('[data-motion-ready]');
  assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).opacity), '1', 'initial viewport must be visible');
  await page.screenshot({ path: `${output}/${variant}-${width}-entrance.png` });
  for (const section of await page.locator('main section').all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
  }
  await allRevealsVisible(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(100);
  await allRevealsVisible(page);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow');
  await page.screenshot({ path: `${output}/${variant}-${width}-final.png`, fullPage: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForSelector('[data-motion-ready]');
  await allRevealsVisible(page);
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0, 'reduced motion must not animate');
  assert.deepEqual(errors, []);
  await page.close();
}

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const variant of ['a', 'b']) {
      for (const width of [1440, 390]) await checkVariant(browser, variant, width);
      const page = await browser.newPage({ javaScriptEnabled: false });
      await page.goto(`${origin}/variant-${variant}`);
      assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).opacity), '1');
      await allRevealsVisible(page);
      await page.close();
    }
    process.stdout.write('Both variants passed: reveals, no replay, overflow, reduced motion, no-JS, runtime errors.\n');
  } finally { await browser.close(); }
}
main().catch(error => { process.stderr.write(`${error.stack}\n`); process.exitCode = 1; });
