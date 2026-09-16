import type { Metadata } from "next";
import type { ReactElement } from "react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import BlogIntro from "./BlogIntro";
import PlanningNotes from "./PlanningNotes";
import BlogClosing from "./BlogClosing";
import BlogMotion from "./BlogMotion";
import styles from "./blog.module.css";

const SLUG = "blog";

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#hero">Skip to main content</a>
      <SiteHeader />
      <main id="blog-content">
        <BlogMotion />
        <BlogIntro />
        <PlanningNotes />
        <BlogClosing />
      </main>
      <SiteFooter />
    </div>
  );
}
