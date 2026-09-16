import type { Metadata } from "next";
import type { ReactElement } from "react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { loadManifest } from "@/lib/manifest";
import { AboutHero } from "./AboutHero";
import { AboutStory } from "./AboutStory";
import { AboutTeam } from "./AboutTeam";
import { AboutProcess } from "./AboutProcess";
import { AboutProjects } from "./AboutProjects";
import { AboutEstimate } from "./AboutEstimate";
import { AboutMotion } from "./AboutMotion";
import styles from "./about.module.css";

const SLUG = "about-us";

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  const sections = loadManifest(SLUG).ordered_sections;
  const estimate = sections.find((section) => section.name === "estimate-cta")!;
  const process = sections.find((section) => section.name === "how-we-work-veteran-owned")!;
  return (
    <div className={styles.site}>
      <SiteHeader />
      <main className={styles.page}>
        <AboutMotion />
        <AboutHero />
        <AboutStory />
        <AboutTeam />
        <AboutProcess steps={process.content.steps} />
        <AboutProjects />
        <AboutEstimate section={estimate} />
      </main>
      <SiteFooter />
    </div>
  );
}
