/** Local-only careers acceptance. All signing, byte PUT and lead delivery are intercepted. */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("/var/lib/megaclaw/workspace/gary-postlive-parity/node_modules/playwright");
const axe = require.resolve("/var/lib/megaclaw/workspace/gary-postlive-parity/node_modules/axe-core/axe.min.js");
const base = "http://127.0.0.1:3187";
const evidence = "/var/lib/megaclaw/workspace/tubro-evidence/resume-upload";
const bytes = Buffer.from("TUBRO LOCAL MOCK TEST — résumé byte-delivery acceptance\nNo real applicant.\n");
const file = { name: "marked-local-resume.txt", mimeType: "text/plain", buffer: bytes };
const widths = [195, 390, 834, 1440];
const results = [];
let browser;

async function installMocks(page, mode) {
  const calls = { sign: [], put: [], lead: [], external: [], errors: [] };
  page.on("pageerror", error => calls.errors.push(error.message));
  await page.route("**/*", async route => {
    const request = route.request(); const url = request.url();
    if (url === base + "/api/lead/upload-url") {
      const body = request.postDataJSON(); calls.sign.push(body);
      assert.equal(body.files[0].sizeBytes, bytes.length);
      assert.equal(body.files[0].contentType, "text/plain");
      const key = `lead-uploads/pending/b002784f-9543-4362-8814-b7da19078f23/browser-${calls.sign.length}/resume.txt`;
      const upload = { s3Key: key, uploadUrl: `https://local-test.s3.us-west-2.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=${"b".repeat(64)}`, contentType: "text/plain", sizeBytes: bytes.length };
      await new Promise(resolve => setTimeout(resolve, 80));
      return route.fulfill({ status: mode === "sign-failed" ? 403 : 200, json: { ok: mode !== "sign-failed", uploads: mode === "short-response" ? [] : [upload], signedKeys: [key], capability: `v1.${Date.now()}.${"a".repeat(43)}` } });
    }
    if (url.startsWith("https://local-test.s3.us-west-2.amazonaws.com/")) {
      assert.equal(request.method(), "PUT");
      const body = request.postDataBuffer(); const headers = request.headers();
      assert.deepEqual(body, bytes);
      assert.equal(headers["content-type"], "text/plain"); assert.equal(headers["if-none-match"], "*");
      calls.put.push({ length: body.length, headers });
      return route.fulfill({ status: mode === "put-failed" ? 403 : 200, body: "", headers: { "Access-Control-Allow-Origin": "*" } });
    }
    if (url === base + "/api/lead") {
      assert.equal(request.method(), "POST", "sentinel build needs no challenge GET");
      const body = request.postDataJSON(); calls.lead.push(body);
      const fail = mode === "retry" && calls.lead.length === 1;
      return route.fulfill({ status: fail ? 502 : 200, json: fail ? { error: "Mock destination unavailable. Please try again." } : { ok: true } });
    }
    if (url.startsWith(base + "/")) return route.continue();
    calls.external.push(url); return route.abort();
  });
  return calls;
}

async function ready(page, width) {
  await page.goto(base + "/careers", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  });
  await page.waitForTimeout(350);
  await page.locator("form").scrollIntoViewIfNeeded();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
}

async function fill(page, chooseWithLabel = false) {
  const form = page.locator("form");
  await form.locator('[name="name"]').fill("Local Mock Test");
  await form.locator('[name="phone"]').fill("(253) 216-2633");
  await form.locator('[name="email"]').fill("test@example.com");
  await form.locator('[name="projectCity"]').fill("Local Test");
  await form.locator('[name="projectDetails"]').fill("Marked local upload acceptance. No real lead.");
  await form.locator('[name="consent"]').check();
  if (chooseWithLabel) {
    const picker = page.waitForEvent("filechooser");
    await form.locator('label[for$="-resume"]').click();
    await (await picker).setFiles(file);
  } else await form.locator('[name="resume"]').setInputFiles(file);
}

async function activate(page) {
  await page.locator('form button[type="button"]').evaluate(button => { button.click(); button.form.requestSubmit(); button.form.requestSubmit(); });
}

async function a11y(page, width, state) {
  await page.addScriptTag({ path: axe });
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] } })).violations);
  const fileControl = await page.locator('[name="resume"]').evaluate(input => {
    const label = input.labels[0]; const rect = input.getBoundingClientRect(); const labelRect = label.getBoundingClientRect();
    return { height: rect.height, width: rect.width, labelHeight: labelRect.height, labelWidth: labelRect.width, font: getComputedStyle(input).fontSize, accept: input.accept };
  });
  assert.equal(violations.length, 0, JSON.stringify(violations));
  assert.ok(fileControl.height >= 44 && fileControl.labelHeight >= 44 && fileControl.labelWidth >= 44);
  assert.equal(fileControl.font, "14px"); assert.equal(fileControl.accept, ".pdf,.doc,.docx,.txt");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: "instant" }); });
  await page.screenshot({ path: path.join(evidence, `careers-${width}-${state}.png`), fullPage: true });
  const formBounds = await page.locator("form").boundingBox();
  return { violations, fileControl, formBounds };
}

async function scenario(width, mode) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  page.setDefaultTimeout(10000);
  const calls = await installMocks(page, mode);
  try {
    await ready(page, width);
    const before = mode === "success" ? await a11y(page, width, "idle") : null;
    await fill(page, mode === "success");
    if (mode === "success") {
      for (const phone of ["+1(757)6855050", "17576855050", "55512"]) {
        await page.locator('[name="phone"]').fill(phone); await activate(page);
        assert.equal(calls.sign.length, 0); assert.equal(calls.lead.length, 0);
      }
      await page.locator('[name="phone"]').fill("2532162633");
      await page.locator('[name="email"]').fill("test@example.c"); await activate(page);
      assert.equal(calls.sign.length, 0);
      await page.locator('[name="email"]').fill("test@example.com");
      await page.locator('[name="resume"]').setInputFiles({ name: "resume.rtf", mimeType: "application/rtf", buffer: bytes });
      await activate(page); assert.equal(calls.sign.length, 0);
      await page.locator('[name="resume"]').setInputFiles(file);
    }
    await activate(page);
    if (mode === "retry") {
      await page.locator("form").getByRole("alert").filter({ hasText: "Mock destination unavailable" }).waitFor();
      assert.equal(await page.locator('[name="resume"]').evaluate(input => input.files[0].name), file.name);
      assert.equal(await page.locator('[name="name"]').inputValue(), "Local Mock Test");
      assert.equal(calls.sign.length, 1); assert.equal(calls.put.length, 1); assert.equal(calls.lead.length, 1);
      assert.equal(await page.evaluate(() => (window.dataLayer ?? []).filter(event => event.event === "form_submission").length), 0);
      await activate(page);
    }
    const success = page.locator('form [role="status"]'); await success.waitFor();
    const text = await success.innerText();
    const attached = ["success", "retry"].includes(mode);
    assert.match(text, attached ? /résumé uploaded with your application/ : /résumé was not sent/);
    const last = calls.lead.at(-1);
    assert.equal(Boolean(last.uploadKeys?.length), attached);
    if (!attached) {
      assert.equal(await page.locator('[name="resume"]').evaluate(input => input.files[0].name), file.name);
      assert.equal(await success.locator("a").getAttribute("href"), "mailto:workorders@tubroconstruction.com");
    }
    assert.equal(calls.sign.length, mode === "retry" ? 2 : 1);
    assert.equal(calls.lead.length, mode === "retry" ? 2 : 1);
    assert.equal(await page.evaluate(() => (window.dataLayer ?? []).filter(event => event.event === "form_submission").length), 1);
    assert.deepEqual(calls.errors, []);
    const after = await a11y(page, width, mode);
    results.push({ width, mode, before, after, status: text, signRequests: calls.sign.length, puts: calls.put, leadRequests: calls.lead.length, externalBlocked: calls.external, pageErrors: calls.errors });
    process.stdout.write(`${width}px ${mode}: bytes=${calls.put[0]?.length ?? 0}, sign=${calls.sign.length}, lead=${calls.lead.length}, axe=0\n`);
  } catch (error) {
    await writeFile(path.join(evidence, `failure-${width}-${mode}.json`), JSON.stringify({ calls, text: await page.locator("form").innerText(), error: error.message }, null, 2));
    await page.screenshot({ path: path.join(evidence, `failure-${width}-${mode}.png`), fullPage: true });
    throw error;
  } finally { await page.close(); }
}

try {
  await mkdir(evidence, { recursive: true });
  browser = await chromium.launch({ executablePath: "/var/lib/megaclaw/user-tools/apt/usr/lib/chromium/chromium", headless: true, timeout: 15000, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const cases = process.env.CAREERS_CASES ? JSON.parse(process.env.CAREERS_CASES)
    : [...widths.flatMap(width => [[width, "success"], [width, "put-failed"]]), ...["retry", "sign-failed", "short-response"].map(mode => [390, mode])];
  for (const [width, mode] of cases) await scenario(width, mode);
  await writeFile(path.join(evidence, "browser-results.json"), JSON.stringify({ cases: results.length, widths, results }, null, 2));
} finally { if (browser) await browser.close(); }
