import type { ReactElement } from "react";
import styles from "./realwork.module.css";

export function RealWorkPortfolio(): ReactElement {
  return <section id="realwork-portfolio" className={styles.section} aria-labelledby="realwork-heading">
    <div className={styles.heading}><div><p>More from the jobsite</p><h2 id="realwork-heading">Explore our work, close to home.</h2></div><p>Browse project photos and locations in Tubro’s live RealWork Labs portfolio.</p></div>
    <iframe className={styles.frame} src="/recent-projects?embed=realwork" title="Tubro Construction live project portfolio from RealWork Labs" loading="lazy" />
    <a className={styles.fallback} href="#project-gallery">Back to the project gallery ↑</a>
  </section>;
}
