import type { Metadata } from "next";
import type { ReactElement } from "react";
import { siteMetadata } from "@/lib/seo";
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

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.tubroconstruction.com/custom-home-services#service",
  name: "Custom home construction and design-build services",
  serviceType: "Custom home construction and design-build services",
  description:
    "Custom home construction and design-build services for homeowners in King and Pierce Counties, Washington. Tubro Construction offers personalized planning, quality construction, assigned project management, upfront pricing, and free estimates.",
  url: "https://www.tubroconstruction.com/custom-home-services",
  provider: {
    "@id": "https://www.tubroconstruction.com/#organization",
  },
  areaServed: ["King County, Washington", "Pierce County, Washington"],
};

export const metadata: Metadata = siteMetadata(
  "Custom Home Builder in King & Pierce Counties | Tubro Construction",
  "Build a custom home in King or Pierce County with veteran-owned Tubro Construction. Get upfront pricing, clear communication, and a free estimate.",
  "/custom-home-services",
);

export default function Page(): ReactElement {
  const [hero, planning, process, gallery, estimate] = loadManifest(SLUG).ordered_sections;
  return (
    <div className={styles.page} data-motion-variant="a" suppressHydrationWarning>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <SiteMotion variant="a" />
      <CustomHomeMotion />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
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
