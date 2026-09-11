import type { Metadata } from "next";
import type { ReactElement } from "react";
import { UtilityNav } from "@/components/shared/UtilityNav";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { HeroA } from "@/components/variant-a/HeroA";
import { ProofRailA } from "@/components/variant-a/ProofRailA";
import { RoomStoriesA } from "@/components/variant-a/RoomStoriesA";
import { CapabilitiesA } from "@/components/variant-a/CapabilitiesA";
import { ProcessA } from "@/components/variant-a/ProcessA";
import { GalleryA } from "@/components/variant-a/GalleryA";
import { EstimateA } from "@/components/variant-a/EstimateA";
import { HERO } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tubro Construction | Measured Living — Remodeling in King & Pierce Counties",
  description: HERO.body,
  alternates: { canonical: "/variant-a" },
};

export default function VariantAPage(): ReactElement {
  return (
    <>
      <UtilityNav variant="a" />
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
    </>
  );
}
