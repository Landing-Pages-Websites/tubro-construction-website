import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
const inventory = JSON.parse(readFileSync("content/blog/_inventory.json", "utf8"));
const files = readdirSync("content/blog").filter((name) => name.endsWith(".md") && name !== "README.md");
const source = (slug) => readFileSync(`content/blog/${slug}.md`, "utf8");

test("every recovered and authored article has a unique stable source identity", () => {
  const ids = files.map((file) => /^id: "?(item_[0-9a-hjkmnp-tv-z]{25}[048cgmrw])"?$/m.exec(readFileSync(`content/blog/${file}`, "utf8"))?.[1]);
  assert.ok(ids.every(Boolean)); assert.equal(new Set(ids).size, files.length);
  assert.equal(files.length, 69);
  assert.ok(source("kitchen-remodel-cost-washington-state").includes("item_q2fvf282v44npyrpr5bgbybjrr"));
});

test("authoritative article counts and every original source record remain truthful", () => {
  const original = JSON.parse(readFileSync("tests/fixtures/legacy-source-records.json", "utf8"));
  const legacy = inventory.posts.filter((row) => row.old_url);
  const records = [...legacy, ...inventory.retained_pages, ...inventory.aliases];
  assert.equal(records.length, 87);
  assert.equal(new Set(records.map((row) => row.old_url)).size, 87);
  for (const before of original) {
    const after = records.find((row) => row.old_url === before.old_url);
    assert.ok(after, before.old_url);
    for (const [key, value] of Object.entries(before)) {
      assert.deepEqual(key === "status" ? after.previous_status ?? after.status : after[key], value, `${before.path}: ${key}`);
    }
  }
  assert.equal(inventory.posts.length, 69);
  assert.equal(inventory.posts_found, 69);
  assert.equal(inventory.posts_migrated, 54);
  assert.equal(inventory.posts_with_item_id, 54);
  assert.equal(legacy.length, 54);
  assert.equal(inventory.posts.filter((row) => row.status === "authored").length, 15);
  assert.equal(inventory.posts.filter((row) => row.item_id).length, 67);
  assert.equal(inventory.retained_pages.length, 32);
  assert.equal(inventory.aliases.length, 1);
  assert.equal(new Set(inventory.posts.map((row) => row.new_slug)).size, 69);
  for (const row of inventory.posts.filter((row) => row.item_id)) assert.ok(source(row.new_slug).includes(row.item_id));
});

test("retained pages and canonical alias describe actual 200 routes without fictional exclusions", () => {
  for (const row of [...inventory.retained_pages, ...inventory.aliases]) {
    assert.equal(row.status, "already_present");
    assert.equal(row.http_status, 200);
    assert.equal(row.target, row.path);
    assert.equal(row.redirect_destination, null);
    assert.ok(row.reason);
  }
  assert.equal(inventory.posts.filter((row) => row.status === "excluded").length, 0);
  assert.equal(inventory.counts.redirected_exclusions, 0);
  const alias = inventory.aliases[0];
  const owner = inventory.posts.find((row) => row.target === alias.alias_of);
  assert.equal(owner.item_id, alias.item_id);
  assert.equal(owner.new_slug, alias.new_slug);
  assert.equal(alias.alias_of, "/blog/kitchen-remodel-cost-washington-state");
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
