import type { Metadata } from "next";
import type { ReactElement } from "react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import BlogIntro from "./BlogIntro";
import { BlogGrid } from "./BlogGrid";
import PlanningNotes from "./PlanningNotes";
import BlogClosing from "./BlogClosing";
import BlogMotion from "./BlogMotion";
import styles from "./blog.module.css";

const SLUG = "blog";

export const metadata: Metadata = {
  ...designedPageMetadata(SLUG),
  title: "Remodeling Planning Guides & Blog | Tubro Construction",
  description: "Practical guides to kitchens, bathrooms, painting, decks, home additions, and remodel planning for homeowners in King and Pierce Counties, Washington.",
};

export default function Page(): ReactElement {
  return (
    <div className={styles.page}>

      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <BlogMotion />
        <BlogIntro />
        <BlogGrid />
        <PlanningNotes />
        <BlogClosing />
      </main>
      <SiteFooter />
    </div>
  );
}
