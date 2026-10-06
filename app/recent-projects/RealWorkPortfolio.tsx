import { DeferredPortfolio } from "@/components/shared/DeferredPortfolio";
import type { ReactElement } from "react";
import styles from "./realwork.module.css";

export function RealWorkPortfolio(): ReactElement {
  return <section id="realwork-portfolio" className={styles.section} aria-labelledby="realwork-heading">
    <div className={styles.heading}><div><p>More from the jobsite</p><h2 id="realwork-heading">Explore our work, close to home.</h2></div><p>Browse project photos and locations in Tubro’s live project portfolio.</p></div>
    <DeferredPortfolio className={styles.frame} title="Tubro Construction live project portfolio" />
    <a className={styles.fallback} href="#project-gallery">Back to the project gallery ↑</a>
  </section>;
}
