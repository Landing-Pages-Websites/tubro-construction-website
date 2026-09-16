import type { Metadata } from "next";
import type { ReactElement } from "react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteMotion } from "@/components/shared/SiteMotion";
import { loadManifest } from "@/lib/manifest";
import { resolveSectionImages } from "@/lib/section-images";
import { CustomHomeHero } from "./CustomHomeHero";
import { CustomHomePlanning } from "./CustomHomePlanning";
import { CustomHomeProcess } from "./CustomHomeProcess";
import { CustomHomeGallery } from "./CustomHomeGallery";
import { CustomHomeEstimate } from "./CustomHomeEstimate";
import { CustomHomeMotion } from "./CustomHomeMotion";
import styles from "./custom-home.module.css";

const SLUG = "custom-home-services";

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  const [hero, planning, process, gallery, estimate] = loadManifest(SLUG).ordered_sections;
  return (
    <div className={styles.page} data-motion-variant="a" suppressHydrationWarning>
      <SiteMotion variant="a" />
      <CustomHomeMotion />
      <SiteHeader />
      <main>
        <CustomHomeHero section={hero} images={resolveSectionImages(SLUG, hero)} />
        <CustomHomePlanning section={planning} />
        <CustomHomeProcess section={process} />
        <CustomHomeGallery section={gallery} images={resolveSectionImages(SLUG, gallery)} />
        <CustomHomeEstimate section={estimate} />
      </main>
      <SiteFooter />
    </div>
  );
}
