import type { MetadataRoute } from "next";
import { SITE_ROUTES } from "@/lib/routes";
import { blogPosts, legacyPages } from "@/lib/blog-posts";

const BASE_URL = "https://www.tubroconstruction.com";

/** Core pages retain their order, followed by published articles. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [...SITE_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
  })), ...[...blogPosts, ...legacyPages].map((post) => ({ url: `${BASE_URL}${post.canonicalPath}` }))];
}
