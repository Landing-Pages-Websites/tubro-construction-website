import type { MetadataRoute } from "next";
import { ADDED_CITY_ROUTES, SITE_ROUTES } from "@/lib/routes";
import { blogPosts, legacyPages } from "@/lib/blog-posts";
import { SITE_URL as BASE_URL } from "@/lib/seo";

/** Added outside SITE_ROUTES, which is bound to the generated design-artifact set. */
const EXTRA_PATHS = ["/handyman", "/aging-in-place", ...ADDED_CITY_ROUTES.map((route) => route.path)];

/** Core pages retain their order, followed by published articles. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [...SITE_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
  })), ...EXTRA_PATHS.map((path) => ({ url: `${BASE_URL}${path}` })), ...[...blogPosts, ...legacyPages].map((post) => ({ url: `${BASE_URL}${post.canonicalPath}` }))];
}
