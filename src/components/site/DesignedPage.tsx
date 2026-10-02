import type { Metadata } from "next";
import type { ReactElement } from "react";
import { siteMetadata } from "@/lib/seo";
import { loadManifest } from "@/lib/manifest";
import { routeForSlug } from "@/lib/routes";
import { PageSections } from "@/components/sections/PageSections";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteMotion } from "@/components/shared/SiteMotion";

/** Unique per-route metadata from the approved sitemap title + manifest hero copy. */
export function designedPageMetadata(slug: string): Metadata {
  const route = routeForSlug(slug);
  const manifest = loadManifest(slug);
  const hero = manifest.ordered_sections[0];
  const description = hero.content.body || hero.content.headline;
  return siteMetadata(route.title, description, route.path);
}

/** Shared frame for every designed non-homepage route. */
export function DesignedPage({ slug }: { slug: string }): ReactElement {
  const route = routeForSlug(slug);
  return (
    <div data-motion-variant="a" suppressHydrationWarning>
      <SiteMotion variant="a" />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <PageSections slug={slug} path={route.path} />
      </main>
      <SiteFooter />
    </div>
  );
}
