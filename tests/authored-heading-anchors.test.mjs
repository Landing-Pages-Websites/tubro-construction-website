import assert from 'node:assert/strict';
import test from 'node:test';
import * as fs from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
import { loadModule } from './module-loader.mjs';

const slugs = ['outdoor-living-space-western-washington', 'small-bathroom-ideas'];
const nodes = (doc, predicate) => findAll(predicate, doc.children);
const { BlogArticle } = loadModule('app/blog/BlogArticle.tsx', { process, moduleMocks: {
  '@/components/site/SiteHeader': { SiteHeader: () => null },
  '@/components/shared/SiteFooter': { SiteFooter: () => null },
  'next/image': ({ src, alt }) => createElement('img', { src, alt }),
} });

function assertContents(post, expected) {
  const doc = parseDocument(renderToStaticMarkup(createElement(BlogArticle, { post })));
  const nav = nodes(doc, node => node.attribs?.['aria-label'] === 'Article contents');
  const body = nodes(doc, node => node.attribs && 'data-article-body' in node.attribs);
  assert.equal(nav.length, 1);
  assert.equal(body.length, 1);
  const links = nodes(nav[0], node => node.name === 'a');
  assert.deepEqual(links.map(node => node.attribs.href), expected.map(section => `#${section.id}`));
  for (const link of links) {
    const id = link.attribs.href.slice(1);
    const targets = nodes(doc, node => node.attribs?.id === id);
    const owned = nodes(body[0], node => node.attribs?.id === id);
    assert.equal(targets.length, 1, `${post.slug}: unique ${id}`);
    assert.equal(owned.length, 1, `${post.slug}: owned ${id}`);
    assert.ok(['h2', 'h3'].includes(owned[0].name));
    assert.equal(textContent(owned[0]), textContent(link));
  }
}

for (const slug of slugs) test(`${slug}: every rendered original contents href owns exactly one heading`, () => {
  const source = fs.readFileSync(`content/blog/${slug}.md`, 'utf8');
  const contents = JSON.parse(JSON.parse(source.match(/^contents: (.+)$/m)[1]));
  assert.equal(contents.length, slug === slugs[0] ? 7 : 0, 'preserve original navigation');
  const { blogPosts } = loadModule('src/lib/blog-posts.ts', { process });
  assertContents(blogPosts.find(post => post.slug === slug), contents);
});

for (const slug of slugs) test(`${slug}: authored h2/h3 IDs survive while active and non-heading attributes are stripped`, () => {
  const contents = [{ id: 'original-layout', heading: 'Layout' }, { id: 'storage_original.2', heading: 'Storage' }];
  const html = '<h2 id="original-layout" onclick="alert(1)" data-bypass="yes">Layout</h2><h3 id="storage_original.2" onmouseover="alert(1)">Storage</h3><p id="foreign" data-bypass="yes">Copy</p><img src="/photo.webp" alt="Photo" onerror="alert(1)"><a href="javascript:alert(1)">Link</a><script>alert(1)</script><iframe src="https://invalid.test"></iframe>';
  const source = fs.readFileSync(`content/blog/${slug}.md`, 'utf8');
  const header = source.split('\n---\n')[0].replace(/^contents: .+$/m, `contents: ${JSON.stringify(JSON.stringify(contents))}`);
  const moduleMocks = { 'node:fs': { ...fs, readFileSync: (file, ...args) => String(file).endsWith(`/content/blog/${slug}.md`) ? `${header}\n---\n${html}` : fs.readFileSync(file, ...args) } };
  const { blogPosts } = loadModule('src/lib/blog-posts.ts', { process, moduleMocks });
  const post = blogPosts.find(post => post.slug === slug);
  assert.equal(post.bodyHtml, '<h2 id="original-layout">Layout</h2><h3 id="storage_original.2">Storage</h3><p>Copy</p><img src="/photo.webp" alt="Photo" /><a>Link</a>');
  assertContents(post, contents);
});
