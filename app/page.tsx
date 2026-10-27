import { HomepageMotion } from "@/components/variant-a/HomepageMotion";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import "./home.css";
import "./home-motion.css";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { HeroA } from "@/components/variant-a/HeroA";
import { ProofRailA } from "@/components/variant-a/ProofRailA";
import { RoomStoriesA } from "@/components/variant-a/RoomStoriesA";
import { CapabilitiesA } from "@/components/variant-a/CapabilitiesA";
import { ProcessA } from "@/components/variant-a/ProcessA";
import { GalleryA } from "@/components/variant-a/GalleryA";
import { EstimateA } from "@/components/variant-a/EstimateA";
import { siteMetadata } from "@/lib/seo";

export const metadata: Metadata = siteMetadata(
  "Tubro Construction | The Estimate-Request Step",
  "Learn the estimate-request step with Tubro Construction in King and Pierce Counties. Explore kitchen, bathroom, and home remodeling, then book a free estimate.", "/",
);

/** The customer-selected Direction A "Measured Living" homepage. */
export default function HomePage(): ReactElement {
  return (
    <div className="variant-a homepage-motion" data-motion-variant="a">
      <HomepageMotion />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <HeroA />
        <ProofRailA />
        <RoomStoriesA />
        <CapabilitiesA />
        <ProcessA />
        <GalleryA />
        <EstimateA />
      </main>
      <SiteFooter />
    </div>
  );
}
