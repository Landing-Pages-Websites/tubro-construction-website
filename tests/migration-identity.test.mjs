import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
const inventory = JSON.parse(readFileSync("content/blog/_inventory.json", "utf8"));
const files = readdirSync("content/blog").filter((name) => name.endsWith(".md") && name !== "README.md");
const source = (slug) => readFileSync(`content/blog/${slug}.md`, "utf8");

test("every recovered and authored article has a unique stable source identity", () => {
  const ids = files.map((file) => /^id: "?(item_[0-9a-hjkmnp-tv-z]{25}[048cgmrw])"?$/m.exec(readFileSync(`content/blog/${file}`, "utf8"))?.[1]);
  assert.ok(ids.every(Boolean)); assert.equal(new Set(ids).size, files.length);
  assert.equal(files.length, 69);
  assert.ok(source("kitchen-remodel-cost-washington-state").includes("item_q2fvf282v44npyrpr5bgbybjrr"));
});

test("article inventory reconciles all legacy and authored identities without counting pages or aliases", () => {
  const legacy = inventory.posts.filter(row => ["migrated", "already_present"].includes(row.status));
  const authored = inventory.posts.filter(row => row.status === "authored");
  assert.equal(inventory.posts.length, 67); assert.equal(inventory.posts_found, inventory.posts.length);
  assert.equal(legacy.length, 54); assert.equal(inventory.posts_migrated, legacy.length);
  assert.equal(inventory.legacy_article_count, legacy.length);
  assert.equal(inventory.posts_with_item_id, legacy.filter(row => row.item_id).length);
  assert.equal(new Set(inventory.posts.map(row => row.item_id)).size, 67);
  assert.equal(inventory.total_unique_article_ids, 67);
  assert.equal(new Set(inventory.posts.map(row => row.new_slug)).size, 67);
  assert.equal(authored.length, 13);
  for (const row of authored) {
    assert.equal(row.old_url, null); assert.equal(row.path, row.target); assert.equal(row.canonical, row.target);
    const original = inventory.authored_exports.find(entry => entry.slug === row.new_slug);
    assert.ok(original); assert.equal(row.source, original.source); assert.equal(row.item_id, original.item_id);
  }
  assert.ok(inventory.posts.every(row => row.status === "authored" || row.status === "migrated"));
  for (const row of inventory.posts) assert.ok(source(row.new_slug).includes(row.item_id));
});

test("full URL manifest retains all 86 outgoing paths and the required Washington root alias as direct 200s", () => {
  const records = inventory.legacy_url_records;
  assert.equal(records.length, 87); assert.equal(inventory.outgoing_urls, records.length);
  assert.equal(new Set(records.map(row => row.old_url)).size, 87);
  const paths = records.map(row => row.path).sort().join("\n");
  assert.equal(createHash("sha256").update(paths).digest("hex"), "745d4421b0ea932c2f59293eb0178ff2a9160ac8b9dd91e8c18e5802e4d4c8a0");
  assert.equal(records.filter(row => row.type === "article").length, 54);
  assert.equal(records.filter(row => row.type === "page").length, 32);
  assert.equal(records.filter(row => row.type === "compatibility_alias").length, 1);
  assert.equal(inventory.authored_exports.length, 13);
  for (const row of records) {
    assert.equal(row.target, row.path); assert.equal(row.redirect_destination, null);
    assert.equal(row.http_status, 200);
    if (row.type !== "article") assert.ok(row.reason);
    if (row.type !== "page") assert.ok(source(row.new_slug).includes(row.item_id));
  }
  for (const slug of ["how-long-does-a-bathroom-remodel-take-in-washington", "kitchen-remodel-cost-pierce-county-a-homeowner-guide", "kitchen-remodel-cost-washington-state"]) {
    assert.ok(records.find(row => row.path === `/${slug}`));
  }
});

test("Washington article is counted once while both complete-body URLs retain its identity and canonical", () => {
  const slug = "kitchen-remodel-cost-washington-state";
  const articles = inventory.posts.filter(row => row.new_slug === slug);
  assert.equal(articles.length, 1); assert.equal(articles[0].path, `/blog/${slug}`);
  const urls = inventory.legacy_url_records.filter(row => row.new_slug === slug);
  assert.equal(urls.length, 2);
  for (const row of urls) {
    for (const key of ["body_sha256", "source_sha256", "links", "tables", "canonical", "item_id"]) assert.equal(row[key], articles[0][key]);
    assert.equal(row.item_id, "item_q2fvf282v44npyrpr5bgbybjrr");
  }
});

test("all 13 JSON exports retain complete authored sections, sources, dates and slugs", () => {
  for (const row of inventory.authored_exports) {
    const original = JSON.parse(readFileSync(row.source, "utf8"));
    const markdown = source(row.slug);
    assert.ok(markdown.includes(original.publishedDate));
    assert.ok(markdown.includes(original.title));
    for (const section of original.sections) {
      for (const text of [section.heading, ...(section.paragraphs || []), ...(section.bullets || [])]) assert.ok(markdown.includes(text), `${row.slug}: ${text}`);
    }
    for (const link of original.sources) assert.ok(markdown.includes(link.url));
  }
});
