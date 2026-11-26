import type { MetadataRoute } from "next";
import { ADDED_CITY_ROUTES, SITE_ROUTES } from "@/lib/routes";
import { blogPosts, legacyPages } from "@/lib/blog-posts";
import { SITE_URL as BASE_URL } from "@/lib/seo";

/** Added outside SITE_ROUTES, which is bound to the generated design-artifact set. */
const EXTRA_PATHS = ["/handyman", "/aging-in-place", "/commercial", "/stairs", ...ADDED_CITY_ROUTES.map((route) => route.path)];

/**
 * Article modification dates come from the post record (dateModified, else the
 * published date). Service, city, and utility pages have no stored modification
 * date, so they stay undated rather than sharing one invented timestamp.
 */
function articleLastModified(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

/** Core pages retain their order, followed by published articles. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [...SITE_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
  })), ...EXTRA_PATHS.map((path) => ({ url: `${BASE_URL}${path}` })), ...[...blogPosts, ...legacyPages].map((post) => {
    const lastModified = articleLastModified(post.dateModified || post.publishedDate);
    return lastModified
      ? { url: `${BASE_URL}${post.canonicalPath}`, lastModified }
      : { url: `${BASE_URL}${post.canonicalPath}` };
  })];
}
