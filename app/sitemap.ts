import type { MetadataRoute } from "next";

const BASE_URL = "https://tubro-construction-website.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/` },
    { url: `${BASE_URL}/variant-a` },
    { url: `${BASE_URL}/variant-b` },
  ];
}
