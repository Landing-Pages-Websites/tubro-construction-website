import type { MetadataRoute } from "next";
import { SITE_ROUTES } from "@/lib/routes";

const BASE_URL = "https://tubro-construction-website.vercel.app";

/** Exactly the approved public route set, in sitemap.json order, "/" first. */
export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
  }));
}
