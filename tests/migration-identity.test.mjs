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

test("full sitemap inventory includes precise destinations for all exclusions and required root aliases", () => {
  assert.equal(inventory.posts.length, 87); assert.equal(inventory.posts_found, 54);
  assert.equal(inventory.authored_exports.length, 13);
  for (const row of inventory.posts) {
    assert.equal(row.target, row.path); assert.equal(row.redirect_destination, null);
    if (row.status === "excluded") assert.ok(row.reason);
    if (row.status === "migrated") assert.ok(source(row.new_slug).includes(row.item_id));
  }
  for (const slug of ["how-long-does-a-bathroom-remodel-take-in-washington", "kitchen-remodel-cost-pierce-county-a-homeowner-guide", "kitchen-remodel-cost-washington-state"]) {
    assert.ok(inventory.posts.find((row) => row.path === `/${slug}` && row.status === "migrated"));
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
