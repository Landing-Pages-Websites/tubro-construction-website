import { ArrowDown, MapPin } from "lucide-react";
import type { ReactElement } from "react";
import styles from "./service-areas.module.css";

export function AreaCoverage(): ReactElement {
  return (
    <section id="county-overview" className={styles.coverage} aria-label="Our service region">
      <p><MapPin aria-hidden="true" /><span>Rooted in Western Washington</span></p>
      <nav aria-label="Browse service counties">
        <a href="#king-county">King County <ArrowDown aria-hidden="true" /></a>
        <a href="#pierce-county">Pierce County <ArrowDown aria-hidden="true" /></a>
      </nav>
      <span className={styles.coverageNote}>One team. Your home.</span>
    </section>
  );
}
