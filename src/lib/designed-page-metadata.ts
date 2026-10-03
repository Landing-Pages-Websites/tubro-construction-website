import type { Metadata } from "next";
import { siteMetadata } from "@/lib/seo";
import { loadManifest } from "@/lib/manifest";
import { routeForSlug } from "@/lib/routes";

/** Unique per-route metadata from the approved sitemap title + manifest hero copy. */
export function designedPageMetadata(slug: string): Metadata {
  const route = routeForSlug(slug);
  const manifest = loadManifest(slug);
  const hero = manifest.ordered_sections[0];
  const description = hero.content.body || hero.content.headline;
  return siteMetadata(route.title, description, route.path);
}
