import type { Metadata } from "next";
import type { ReactElement } from "react";
import { siteMetadata } from "@/lib/seo";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { AreaHero } from "./AreaHero";
import { AreaCoverage } from "./AreaCoverage";
import { AreaCommercial } from "./AreaCommercial";
import { AreaDirectory } from "./AreaDirectory";
import { AreaProjects } from "./AreaProjects";
import { AreaFit } from "./AreaFit";
import { AreaEstimate } from "./AreaEstimate";
import { AreaMotion } from "./AreaMotion";
import styles from "./service-areas.module.css";


export const metadata: Metadata = siteMetadata(
  "Home Remodeling Service Areas | Tubro Construction",
  "Home remodeling across King and Pierce Counties. Find your city, then plan a kitchen, bathroom, addition, or painting project and request a free estimate.",
  "/service-areas",
);

export default function Page(): ReactElement {
  return (
    <div className={styles.page} data-motion-variant="a" data-service-area-page>
      <AreaMotion />

      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <AreaHero />
        <AreaCoverage />
        <AreaCommercial />
        <AreaDirectory />
        <AreaFit />
        <AreaProjects />
        <AreaEstimate />
      </main>
      <SiteFooter />
    </div>
  );
}
