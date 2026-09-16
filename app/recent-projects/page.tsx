import type { Metadata } from "next";
import type { ReactElement } from "react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import ProjectPortfolio from "./ProjectPortfolio";
import styles from "./shell.module.css";

const SLUG = "recent-projects";

export const metadata: Metadata = {
  ...designedPageMetadata(SLUG),
  description: "Explore Tubro Construction’s recent kitchen, bathroom, deck, and exterior work. Find inspiration for your next home remodel in King and Pierce Counties.",
};

export default function Page(): ReactElement {
  return <div className={styles.shell}><SiteHeader /><ProjectPortfolio /><SiteFooter /></div>;
}
