import type { Metadata } from "next";
import type { ReactElement } from "react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import ProjectPortfolio from "./ProjectPortfolio";
import { RealWorkEmbed } from "./RealWorkEmbed";
import styles from "./shell.module.css";

const SLUG = "recent-projects";

type Props = { searchParams: Promise<{ embed?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { embed } = await searchParams;
  return {
    ...designedPageMetadata(SLUG),
    description: "Explore Tubro Construction’s recent kitchen, bathroom, deck, and exterior work. Find inspiration for your next home remodel in King and Pierce Counties.",
    ...(embed === "realwork" ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Page({ searchParams }: Props): Promise<ReactElement> {
  // Keep the vendor's configured pathname, while isolating its document and metadata mutations.
  if ((await searchParams).embed === "realwork") return <RealWorkEmbed />;
  return <div className={styles.shell}><SiteHeader /><ProjectPortfolio /><SiteFooter /></div>;
}
