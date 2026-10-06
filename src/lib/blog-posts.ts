import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import kitchenPlanning from "./blog-content/kitchen-remodel-planning-checklist.json";
import outdoorLivingWesternWashington from "./blog-content/outdoor-living-space-western-washington.json";
import bathroomPlanning from "./blog-content/bathroom-remodel-planning-guide.json";
import contractorSelection from "./blog-content/choosing-remodeling-contractor-washington.json";
import kitchenCostWashington from "./blog-content/kitchen-remodel-cost-washington-state.json";
import estimatePreparation from "./blog-content/preparing-for-remodel-estimate.json";
import cabinetStorage from "./blog-content/kitchen-cabinet-storage-planning.json";
import bathroomLighting from "./blog-content/bathroom-lighting-planning.json";
import exteriorPreparation from "./blog-content/exterior-painting-preparation.json";
import deckPlanning from "./blog-content/deck-remodel-planning.json";
import additionPlanning from "./blog-content/home-addition-planning-checklist.json";
import materialSelections from "./blog-content/remodeling-material-selection-checklist.json";
import livingDuringRemodel from "./blog-content/living-at-home-during-remodel.json";
import paintingWeather from "./blog-content/exterior-painting-weather-window.json";
import stainVersusPaint from "./blog-content/exterior-stain-vs-paint.json";
import smallBathroomIdeas from "./blog-content/small-bathroom-ideas";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export type BlogSection = { heading: string; id: string };
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  publishedDate: string;
  dateModified: string;
  canonicalPath: string;
  author: string;
  kind: string;
  bodyHtml: string;
  sections: BlogSection[];
};

type StructuredPost = {
  slug: string;
  title: string;
  metaTitle?: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  publishedDate: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
  bodyHtml?: string;
  faq?: { question: string; answer: string }[];
  sources: { title: string; url: string }[];
};

const CONTENT_DIR = path.join(process.cwd(), "content/blog");
const structuredPosts: StructuredPost[] = [
  estimatePreparation, cabinetStorage, bathroomLighting, exteriorPreparation,
  deckPlanning, additionPlanning, materialSelections, livingDuringRemodel,
  paintingWeather, stainVersusPaint, kitchenPlanning, bathroomPlanning, contractorSelection,
  kitchenCostWashington, outdoorLivingWesternWashington, smallBathroomIdeas,
];

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function structuredBody(post: StructuredPost): { bodyHtml: string; sections: BlogSection[] } {
  const sections = post.sections.map((section, index) => ({ id: `section-${index + 1}`, heading: section.heading }));
  const html = post.sections.map((section, index) => {
    const paragraphs = (section.paragraphs ?? []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    const bullets = section.bullets?.length ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>` : "";
    return `<section><h2 id="${sections[index].id}">${escapeHtml(section.heading)}</h2>${paragraphs}${bullets}</section>`;
  }).join("");
  const sources = post.sources.length ? `<section><h2 id="sources">Sources &amp; further reading</h2><p>Consult the relevant authority for requirements specific to your property and project.</p><ul>${post.sources.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a></li>`).join("")}</ul></section>` : "";
  const faq = post.faq?.length ? `<section><h2 id="faq">Frequently asked questions</h2>${post.faq.map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join("")}</section>` : "";
  return { bodyHtml: `${html}${sources}${faq}`, sections };
}

function normalizeStructured(post: StructuredPost): BlogPost {
  const rendered = post.bodyHtml ? { bodyHtml: post.bodyHtml, sections: post.sections.map((section, index) => ({ id: `section-${index + 1}`, heading: section.heading })) } : structuredBody(post);
  return {
    id: `structured_${post.slug}`,
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    image: post.image,
    imageAlt: post.imageAlt,
    publishedDate: post.publishedDate,
    dateModified: post.publishedDate,
    canonicalPath: `/blog/${post.slug}`,
    author: "Tubro Construction",
    kind: "article",
    ...rendered,
  };
}

function readHeader(header: string): Record<string, string> {
  return Object.fromEntries(header.split("\n").filter(Boolean).map((line) => {
    const colon = line.indexOf(":");
    const value = line.slice(colon + 1).trim();
    return [line.slice(0, colon), value.startsWith('"') ? JSON.parse(value) as string : value];
  }));
}

function renderLegacyBody(markdown: string): { bodyHtml: string; sections: BlogSection[] } {
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
    id: meta.id,
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    category: meta.category || "Tubro Construction",
    image: meta.image || "",
    imageAlt: meta.imageAlt || meta.title,
    publishedDate: meta.date || "",
    dateModified: meta.dateModified || meta.date || "",
    canonicalPath: meta.canonicalPath,
    author: meta.author || "Tubro Construction",
    kind: meta.kind,
    ...renderLegacyBody(match[2]),
  };
}

const legacyContent = readdirSync(CONTENT_DIR).filter((file) => /\.mdx?$/.test(file) && file !== "README.md").map(readPost);
// Migration content owns any slug already present in the source inventory. Newer
// structured guides are appended without replacing that parity-checked record.
const allContent = [...legacyContent, ...structuredPosts.map(normalizeStructured)];
const uniqueContent = allContent.filter((post, index, posts) => posts.findIndex((candidate) => candidate.slug === post.slug) === index);
export const blogPosts: BlogPost[] = uniqueContent.filter((post) => post.kind === "article");
export const legacyPages: BlogPost[] = uniqueContent.filter((post) => post.kind === "page");
export const rootPosts: BlogPost[] = uniqueContent.filter((post) => !post.canonicalPath.startsWith("/blog/") || post.slug === "kitchen-remodel-cost-washington-state");

export function relatedBlogPosts(post: BlogPost): BlogPost[] {
  return blogPosts.filter((item) => item.id !== post.id)
    .sort((first, second) => Number(second.category === post.category) - Number(first.category === post.category)).slice(0, 3);
}
