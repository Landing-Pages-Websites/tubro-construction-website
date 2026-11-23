import type { Metadata } from "next";
import type { ReactElement } from "react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import ProjectPortfolio from "./ProjectPortfolio";
import { RealWorkEmbed } from "./RealWorkEmbed";
import styles from "./shell.module.css";

const SLUG = "recent-projects";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.tubroconstruction.com/recent-projects#service",
  name: "Residential remodeling and commercial interior fit-out services",
  serviceType: "Residential remodeling and commercial interior fit-out",
  description:
    "Remodeling and commercial interior fit-out services illustrated by Tubro Construction project examples, including kitchen remodeling, bathroom remodeling, outdoor and exterior work, and commercial remodeling in Western Washington.",
  url: "https://www.tubroconstruction.com/recent-projects",
  provider: {
    "@id": "https://www.tubroconstruction.com/#organization",
  },
  areaServed: ["King County, Washington", "Pierce County, Washington"],
};

type Props = { searchParams: Promise<{ embed?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { embed } = await searchParams;
  return {
    ...designedPageMetadata(SLUG),
    description: "Explore Tubro Construction remodeling projects and learn how we help Western Washington property owners plan commercial remodels and interior fit-outs.",
    ...(embed === "realwork" ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Page({ searchParams }: Props): Promise<ReactElement> {
  // Keep the vendor's configured pathname, while isolating its document and metadata mutations.
  if ((await searchParams).embed === "realwork") return <RealWorkEmbed />;
  return <div className={styles.shell}>
    <SiteHeader />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <ProjectPortfolio />
    <SiteFooter />
  </div>;
}
