import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
import { loadModule } from './module-loader.mjs';

const inventory = JSON.parse(readFileSync('content/blog/_inventory.json', 'utf8'));
const slugs = ['outdoor-living-space-western-washington', 'small-bathroom-ideas'];
const fileIds = ['item_29fa1hpj5b0xv6ffkkp63hjy04', 'item_m1q0rt1gex1q3n6yr4ttsffjbg'];
const nodes = (html, name) => findAll(node => node.name === name, parseDocument(html).children);
const original = slug => slug === 'small-bathroom-ideas' ? loadModule(`src/lib/blog-content/${slug}.ts`).default : JSON.parse(readFileSync(`src/lib/blog-content/${slug}.json`, 'utf8'));

for (const slug of slugs) test(`${slug}: complete owning article preserves source body, links, dates, image and renderer provenance`, () => {
  const row = inventory.posts.find(row => row.new_slug === slug);
  assert.match(row.item_id || '', /^item_[0-9a-hjkmnp-tv-z]{25}[048cgmrw]$/);
  assert.equal(row.item_id, fileIds[slugs.indexOf(slug)], 'stable assigned file identity');
  const source = original(slug);
  const anchoredBody = source.bodyHtml.replace(/<h2>([\s\S]*?)<\/h2>/g, (heading, text) => {
    const index = source.sections.findIndex(section => section.heading === text);
    return index < 0 ? heading : `<h2 id="section-${index + 1}">${text}</h2>`;
  });
  const markdown = readFileSync(`content/blog/${slug}.md`, 'utf8');
  assert.ok(markdown.includes(anchoredBody), 'full original HTML with only the declared navigation IDs restored');
  assert.ok(markdown.includes(`rendererId: "structured_${slug}"`));
  assert.ok(markdown.includes(`sourceUrl: "repository:${row.source}"`));
  assert.equal(row.source_sha256, createHash('sha256').update(readFileSync(row.source)).digest('hex'));
  const { blogPosts } = loadModule('src/lib/blog-posts.ts', { process });
  const post = blogPosts.find(post => post.slug === slug);
  assert.equal(post.id, row.item_id);
  for (const key of ['title', 'description', 'image', 'imageAlt', 'publishedDate']) assert.equal(post[key], source[key], key);
  assert.equal(post.dateModified, source.publishedDate);
  assert.equal(post.canonicalPath, `/blog/${slug}`);
  assert.equal(textContent(parseDocument(post.bodyHtml)), textContent(parseDocument(source.bodyHtml)));
  for (const tag of ['h2', 'h3', 'li', 'table', 'a']) {
    assert.deepEqual(nodes(post.bodyHtml, tag).map(node => [textContent(node), node.attribs]), nodes(anchoredBody, tag).map(node => [textContent(node), node.attribs]), tag);
  }
  assert.deepEqual(JSON.parse(JSON.stringify(post.sections)), Array.from(source.sections, (section, index) => ({id:`section-${index + 1}`,heading:section.heading})));
  for (const link of source.sources) assert.ok(markdown.includes(link.url));
});

test('all nine failed directory destinations are plain labels with the retained list intact', () => {
  const source = readFileSync('content/blog/backlinks.md', 'utf8');
  const links = nodes(source, 'a').map(node => node.attribs.href);
  for (const [host, label] of [['travelful.net', 'Travelful'], ['about.me', 'About.me'], ['companylistingnyc.com', 'Company Listing NYC'], ['ebusinesspages.com', 'eBusinessPages'], ['globalcatalog.com', 'GlobalCatalog'], ['teleadreson.com', 'Teleadreson'], ['announceamerica.com', 'Announce America'], ['bizmaker.org', 'BizMaker'], ['cgmimm.com', 'CGMIMM']]) {
    assert.ok(!links.some(link => new URL(link).hostname.replace(/^www\./, '') === host), host);
    assert.ok(textContent(parseDocument(source)).includes(`${label} — Tubro Construction`), label);
  }
  assert.equal(nodes(source, 'li').length, 54);
});
