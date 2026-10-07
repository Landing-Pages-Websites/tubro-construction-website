/** Local, read-only served HTML checks. No lead POSTs or external deliveries. */
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { parseDocument } from "htmlparser2";
import { findAll, textContent } from "domutils";
import { SITE_ROUTES } from "../scripts/site-routes.mjs";
import { EMAIL_PATTERN, PHONE_PATTERN } from "../src/lib/lead-validation.ts";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3278";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "This runner is local only");
const inventory = JSON.parse(readFileSync("content/blog/_inventory.json", "utf8"));
const results = [];
const pages = new Map();
const nodes = (doc, predicate) => findAll(predicate, doc.children);
const tags = (doc, tag) => nodes(doc, (element) => element.name === tag);
const attr = (doc, key, value) => nodes(doc, (element) => element.attribs?.[key] === value);
// Match the original Python source audit exactly: U+FEFF is content, not whitespace.
const LEGACY_WHITESPACE = /[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+/g;
const normalize = (value) => value.replace(LEGACY_WHITESPACE, " ").replace(/^ +| +$/g, "");

async function get(path) {
  const response = await fetch(base + path, { redirect: "manual", signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, `${path}: HTTP status`);
  return response;
}

function inspectForms(doc, path) {
  for (const form of tags(doc, "form")) {
    assert.equal(form.attribs.action, "/api/lead", path);
    assert.equal(form.attribs.method, "post", path);
    for (const [name, type, pattern] of [["email", "email", EMAIL_PATTERN], ["phone", "tel", PHONE_PATTERN]]) {
      const controls = attr(form, "name", name);
      assert.equal(controls.length, 1, `${path}: separate ${name} control`);
      assert.equal(controls[0].attribs.type, type, path);
      assert.equal(controls[0].attribs.pattern, pattern, path);
      assert.ok("required" in controls[0].attribs, path);
    }
    for (const control of nodes(form, (node) => ["input", "textarea", "select"].includes(node.name))) {
      const label = attr(form, "for", control.attribs.id);
      const enclosed = control.parent?.name === "label";
      assert.ok(label.length || enclosed, `${path}: label for ${control.attribs.name}`);
    }
    assert.equal(attr(form, "name", "website").length, 1, `${path}: honeypot`);
    assert.equal(attr(form, "type", "submit").length, 0, `${path}: raw submit`);
    for (const button of tags(form, "button")) assert.equal(button.attribs.type, "button", path);
  }
}

function schemas(doc) {
  return attr(doc, "type", "application/ld+json").map((node) => JSON.parse(textContent(node)));
}

function inspectArticle(doc, row) {
  const schema = schemas(doc).filter((value) => ["Article", "BlogPosting"].includes(value["@type"]));
  assert.equal(schema.length, 1, `${row.target}: one article schema`);
  assert.equal(schema[0].identifier, row.item_id || row.renderer_id, row.target);
  const bodies = nodes(doc, (node) => node.attribs && "data-article-body" in node.attribs);
  assert.equal(bodies.length, 1, `${row.target}: rendered body`);
  const body = bodies[0];
  assert.equal(tags(body, "script").length, 0, `${row.target}: no inline duplicate schema`);
  assert.doesNotMatch(textContent(body), /<\/?(?:h[1-6]|p|script)\b|```|^#{1,6} /m, row.target);
  if (row.body_sha256) {
    const fragments = [];
    const visit = (node) => { if (node.type === "text" && normalize(node.data)) fragments.push(normalize(node.data)); for (const child of node.children || []) visit(child); };
    visit(body);
    const hash = createHash("sha256").update(normalize(fragments.join(" "))).digest("hex");
    assert.equal(hash, row.body_sha256, `${row.target}: original article text parity`);
    assert.equal(tags(body, "a").length, row.links, `${row.target}: original link count`);
    assert.equal(tags(body, "table").length, row.tables, `${row.target}: original tables`);
  }
}

async function inspectPath(path) {
  const response = await get(path);
  const html = await response.text();
  const doc = parseDocument(html);
  assert.equal(tags(doc, "h1").length, 1, `${path}: one h1`);
  assert.equal(attr(doc, "id", "main-content").length, 1, `${path}: main landmark`);
  for (const img of tags(doc, "img")) assert.ok("alt" in img.attribs, `${path}: missing alt ${img.attribs.src}`);
  inspectForms(doc, path);
  pages.set(path, doc);
  results.push({ path, status: response.status, forms: tags(doc, "form").length, images: tags(doc, "img").length });
}

async function checkMigration() {
  for (const row of inventory.posts) inspectArticle(pages.get(row.target), row);
  for (const row of [...inventory.retained_pages, ...inventory.aliases]) assert.ok(pages.has(row.target), row.target);
  for (const row of inventory.aliases) inspectArticle(pages.get(row.target), row);
  for (const row of inventory.posts.filter((row) => row.status === "excluded")) {
    const response = await fetch(base + new URL(row.old_url).pathname, { redirect: "manual" });
    assert.ok([301, 308].includes(response.status), `${row.old_url}: permanent exclusion redirect`);
    assert.equal(new URL(response.headers.get("location"), base).pathname, row.redirect_destination);
    await get(row.redirect_destination);
  }
  const xml = await (await get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  const retained = inventory.retained_pages.filter((row) => row.item_id).map((row) => row.target);
  const expected = [...SITE_ROUTES.map((row) => row.path), ...inventory.posts.map((row) => row.target), ...retained];
  assert.deepEqual([...paths].sort(), [...expected].sort(), "Sitemap exposes all real articles and retained pages");
  assert.equal(new Set(paths).size, paths.length, "No duplicate sitemap paths");
  return paths.length;
}

async function checkLinksAndImage() {
  const outdoor = pages.get("/blog/outdoor-living-space-western-washington");
  const links = tags(outdoor, "a").map((node) => node.attribs.href || "");
  assert.ok(links.some((href) => href.endsWith("/keys-to-open-communication-with-your-contractor")));
  assert.ok(!links.some((href) => href.includes("/keys-open-communication-with-your-contractor")));
  await get("/keys-to-open-communication-with-your-contractor");
  const backlinks = pages.get("/backlinks");
  const removed = /travelful\.net|about\.me|companylistingnyc\.com|ebusinesspages\.com|globalcatalog\.com|teleadreson\.com|announceamerica\.com/;
  assert.ok(!tags(backlinks, "a").some((node) => removed.test(node.attribs.href || "")));
  for (const label of ["Travelful", "About.me", "Company Listing NYC", "eBusinessPages", "GlobalCatalog", "Teleadreson", "Announce America"]) assert.ok(textContent(backlinks).includes(label));
  const small = pages.get("/blog/small-bathroom-ideas");
  const source = tags(small, "img").find((node) => node.attribs.src.includes("299609"));
  assert.ok(source, "Existing small-bathroom image is rendered");
  const url = new URL(source.attribs.src, base);
  url.searchParams.set("w", "1920"); url.searchParams.set("q", "75");
  const response = await get(url.pathname + url.search);
  assert.match(response.headers.get("content-type"), /^image\//);
  assert.ok((await response.arrayBuffer()).byteLength > 1000);
  return { optimizedImage: 200, width: 1920, quality: 75 };
}

async function main() {
  const paths = new Set([...SITE_ROUTES.map((row) => row.path), ...inventory.posts.map((row) => row.target), ...inventory.retained_pages.map((row) => row.target), ...inventory.aliases.map((row) => row.target)]);
  for (const path of paths) await inspectPath(path);
  assert.equal(results.reduce((total, row) => total + row.forms, 0), 27);
  const sitemapRoutes = await checkMigration();
  const image = await checkLinksAndImage();
  const summary = { routes: results.length, forms: 27, articles: inventory.posts.length, sitemapRoutes, ...image, browser: "screenshots unavailable — bootstrap gap (libnspr4.so)", results };
  mkdirSync(".next/qa-round2", { recursive: true });
  writeFileSync(".next/qa-round2/served-html.json", JSON.stringify(summary, null, 2));
  process.stdout.write(JSON.stringify({ ...summary, results: undefined }) + "\n");
}
try { await main(); } catch (error) { process.stderr.write(`${error.stack}\n`); process.exitCode = 1; }
