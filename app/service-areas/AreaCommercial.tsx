import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import styles from "./service-areas.module.css";

export function AreaCommercial(): ReactElement {
  return (
    <section id="commercial-projects" className={`${styles.section} ${styles.commercial}`} aria-labelledby="commercial-heading">
      <div className={styles.commercialCopy}>
        <p className={styles.eyebrow}>For property owners and businesses</p>
        <h2 id="commercial-heading">Commercial projects, planned around your operation.</h2>
        <p>Tubro Construction helps property owners and businesses across Western Washington plan commercial remodeling and interior fit-outs. We clarify the scope, plan the work, and move toward a clear estimate.</p>
      </div>
      <div className={styles.commercialActions}>
        <a className={styles.button} href="/general-contractor">Explore general contracting <ArrowUpRight aria-hidden="true" /></a>
        <a className={styles.textLink} href="/recent-projects#commercial-remodeling">See commercial remodeling projects <ArrowUpRight aria-hidden="true" /></a>
      </div>
    </section>
  );
}
