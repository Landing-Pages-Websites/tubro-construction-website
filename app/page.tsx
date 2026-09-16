import { HeroMotionInit } from "@/components/shared/HeroMotionInit";
import { SiteMotion } from "@/components/shared/SiteMotion";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import "./home.css";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { HeroA } from "@/components/variant-a/HeroA";
import { ProofRailA } from "@/components/variant-a/ProofRailA";
import { RoomStoriesA } from "@/components/variant-a/RoomStoriesA";
import { CapabilitiesA } from "@/components/variant-a/CapabilitiesA";
import { ProcessA } from "@/components/variant-a/ProcessA";
import { GalleryA } from "@/components/variant-a/GalleryA";
import { EstimateA } from "@/components/variant-a/EstimateA";
import { HERO } from "@/lib/content";

export const metadata: Metadata = {
  title: "Residential Remodeling in King & Pierce Counties | Tubro Construction",
  description: HERO.body,
  alternates: { canonical: "/" },
};

/** The customer-selected Direction A "Measured Living" homepage. */
export default function HomePage(): ReactElement {
  return (
    <div className="variant-a" data-motion-variant="a" suppressHydrationWarning>
      <HeroMotionInit />
      <SiteMotion variant="a" />
      <SiteHeader />
      <main>
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
