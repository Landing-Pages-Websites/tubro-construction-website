import type { ReactElement } from "react";
import { routeForSlug } from "@/lib/routes";
import { PageSections } from "@/components/sections/PageSections";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteMotion } from "@/components/shared/SiteMotion";

export { designedPageMetadata } from "@/lib/designed-page-metadata";

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
