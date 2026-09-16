import type { Metadata } from "next";
import type { ReactElement } from "react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { AreaHero } from "./AreaHero";
import { AreaCoverage } from "./AreaCoverage";
import { AreaDirectory } from "./AreaDirectory";
import { AreaProjects } from "./AreaProjects";
import { AreaFit } from "./AreaFit";
import { AreaEstimate } from "./AreaEstimate";
import { AreaMotion } from "./AreaMotion";
import styles from "./service-areas.module.css";

const SLUG = "service-areas";

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  return (
    <div className={styles.page} data-motion-variant="a" data-service-area-page>
      <AreaMotion />
      <a className={styles.skipLink} href="#city-directory">Skip to service cities</a>
      <SiteHeader />
      <main>
        <AreaHero />
        <AreaCoverage />
        <AreaDirectory />
        <AreaProjects />
        <AreaFit />
        <AreaEstimate />
      </main>
      <SiteFooter />
    </div>
  );
}
