import type { MetadataRoute } from "next";
import { SITE_ROUTES } from "@/lib/routes";
import { blogPosts } from "@/lib/blog-posts";

const BASE_URL = "https://tubro-construction-website.vercel.app";

/** Core pages retain their order, followed by published articles. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [...SITE_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
  })), ...blogPosts.map((post) => ({ url: `${BASE_URL}/blog/${post.slug}` }))];
}
