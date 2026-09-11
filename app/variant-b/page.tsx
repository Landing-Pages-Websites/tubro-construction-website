import type { Metadata } from "next";
import type { ReactElement } from "react";
import { UtilityNav } from "@/components/shared/UtilityNav";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { HeroB } from "@/components/variant-b/HeroB";
import { ProofLedgerB } from "@/components/variant-b/ProofLedgerB";
import { RoomStoriesB } from "@/components/variant-b/RoomStoriesB";
import { CapabilitiesB } from "@/components/variant-b/CapabilitiesB";
import { ProcessB } from "@/components/variant-b/ProcessB";
import { GalleryB } from "@/components/variant-b/GalleryB";
import { EstimateB } from "@/components/variant-b/EstimateB";
import { HERO } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tubro Construction | Craft Ledger — Remodeling in King & Pierce Counties",
  description: HERO.body,
  alternates: { canonical: "/variant-b" },
};

export default function VariantBPage(): ReactElement {
  return (
    <>
      <UtilityNav variant="b" />
      <main>
        <HeroB />
        <ProofLedgerB />
        <RoomStoriesB />
        <CapabilitiesB />
        <ProcessB />
        <GalleryB />
        <EstimateB />
      </main>
      <SiteFooter />
    </>
  );
}
