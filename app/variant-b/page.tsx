import { HeroMotionInit } from "@/components/shared/HeroMotionInit";
import { SiteMotion } from "@/components/shared/SiteMotion";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Anton } from "next/font/google";
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

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-b-display", display: "swap" });

export const metadata: Metadata = {
  title: "Tubro Construction | Craft Ledger — Remodeling in King & Pierce Counties",
  description: HERO.body,
  alternates: { canonical: "/variant-b" },
};

export default function VariantBPage(): ReactElement {
  return (
    <div className={display.variable} data-motion-variant="b" suppressHydrationWarning>
      <HeroMotionInit />
      <SiteMotion variant="b" />
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
    </div>
  );
}
