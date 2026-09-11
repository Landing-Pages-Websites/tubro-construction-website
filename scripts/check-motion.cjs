/* Run against a production preview. Uses an existing Playwright installation. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const origin = process.env.PREVIEW_URL || 'http://localhost:3003';
const output = process.env.MOTION_OUTPUT || 'motion-artifacts';

async function checkVariant(browser, variant, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.motionStarts = [];
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      window.motionStarts.push({ tag: this.tagName, id: this.id, frames: args[0] });
      return original.apply(this, args);
    };
  });
  await page.goto(`${origin}/variant-${variant}`);
  await page.waitForFunction(() => window.motionStarts.length > 0);
  await page.screenshot({ path: `${output}/${variant}-${width}-entrance.png` });
  await page.waitForTimeout(2100);
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  assert.ok(await page.evaluate(() => window.motionStarts.some(item => item.frames[0].strokeDasharray)), 'survey drawing must run');
  assert.equal(await page.locator('.motion-survey path').first().evaluate(el => getComputedStyle(el).opacity), '0', 'survey must clear after entrance');
  assert.ok(await page.evaluate(() => window.motionStarts.some(item => item.frames[0].clipPath)));
  for (const section of await page.locator('main section').all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2100);
  }
  const count = await page.evaluate(() => window.motionStarts.length);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => window.motionStarts.length), count, 'entrances must not replay');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow');
  await page.screenshot({ path: `${output}/${variant}-${width}-final.png`, fullPage: true });
  await page.reload();
  await page.waitForFunction(() => document.getAnimations().length > 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0, 'live reduced motion must cancel');
  assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).opacity), '1');
  await page.reload();
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => window.motionStarts.length), 0, 'reduced motion must not animate');
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
      for (const block of await page.locator('.reveal').all()) {
        assert.equal(await block.evaluate(el => getComputedStyle(el).opacity), '1');
      }
      await page.close();
    }
    process.stdout.write('Both variants passed: entrances, no replay, overflow, reduced motion, no-JS, runtime errors.\n');
  } finally { await browser.close(); }
}
main().catch(error => { process.stderr.write(`${error.stack}\n`); process.exitCode = 1; });
