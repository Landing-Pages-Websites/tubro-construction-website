import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export type BlogSection = { heading: string; id: string };
export type BlogPost = {
  id: string; slug: string; title: string; description: string; category: string;
  image: string; imageAlt: string; publishedDate: string; dateModified: string;
  canonicalPath: string; author: string; kind: string; bodyHtml: string; sections: BlogSection[];
};
const CONTENT_DIR = path.join(process.cwd(), "content/blog");

function readHeader(header: string): Record<string, string> {
  return Object.fromEntries(header.split("\n").filter(Boolean).map((line) => {
    const colon = line.indexOf(":");
    const value = line.slice(colon + 1).trim();
    return [line.slice(0, colon), value.startsWith('"') ? JSON.parse(value) as string : value];
  }));
}

function renderBody(markdown: string): { bodyHtml: string; sections: BlogSection[] } {
  const sections: BlogSection[] = [];
  const html = sanitizeHtml(marked.parse(markdown, { async: false }), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: { a: ["href", "title"], img: ["src", "alt", "title"], th: ["colspan", "rowspan", "scope"], td: ["colspan", "rowspan"], ol: ["start"] },
    allowedSchemes: ["https", "http", "mailto", "tel"],
  });
  const bodyHtml = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, content: string) => {
    const id = `section-${sections.length + 1}`;
    sections.push({ id, heading: sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} }) });
    return `<h2 id="${id}">${content}</h2>`;
  });
  return { bodyHtml, sections };
}

function readPost(file: string): BlogPost {
  const source = readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`Missing article frontmatter: ${file}`);
  const meta = readHeader(match[1]);
  if (!/^item_[0-9a-hjkmnp-tv-z]{25}[048cgmrw]$/.test(meta.id)) throw new Error(`Invalid article identity: ${file}`);
  return {
    id: meta.id, slug: meta.slug, title: meta.title, description: meta.description,
    category: meta.category || "Tubro Construction", image: meta.image || "", imageAlt: meta.imageAlt || meta.title,
    publishedDate: meta.date || "", dateModified: meta.dateModified || meta.date || "", canonicalPath: meta.canonicalPath,
    author: meta.author || "Tubro Construction", kind: meta.kind, ...renderBody(match[2]),
  };
}

const content = readdirSync(CONTENT_DIR).filter((file) => /\.mdx?$/.test(file) && file !== "README.md").map(readPost);
export const blogPosts = content.filter((post) => post.kind === "article");
export const legacyPages = content.filter((post) => post.kind === "page");
export const rootPosts = content.filter((post) => !post.canonicalPath.startsWith("/blog/") || post.slug === "kitchen-remodel-cost-washington-state");

export function relatedBlogPosts(post: BlogPost): BlogPost[] {
  return blogPosts.filter((item) => item.id !== post.id)
    .sort((first, second) => Number(second.category === post.category) - Number(first.category === post.category)).slice(0, 3);
}
