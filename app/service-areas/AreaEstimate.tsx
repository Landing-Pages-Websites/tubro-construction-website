import { ArrowUpRight, Clock, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import { ConstructionDrawing } from "./ConstructionDrawing";
import styles from "./service-areas.module.css";

export function AreaEstimate(): ReactElement {
  return (
    <section id="estimate-cta" className={`${styles.section} ${styles.estimate}`} aria-labelledby="estimate-heading">
      <ConstructionDrawing kind="plan" className={styles.estimateDrawing} />
      <div><p className={styles.eyebrow}>Your home. Your next chapter.</p><h2 id="estimate-heading">Let’s start<br />with your plans.</h2><p>Share your project and location. We’ll help you take the next step toward a home that works for you.</p></div>
      <div className={styles.estimateActions}>
        <a className={styles.button} href="/schedule-an-estimate">Schedule a Free Estimate <ArrowUpRight aria-hidden="true" /></a>
        <a className={styles.estimatePhone} href={BRAND.phoneHref}><Phone aria-hidden="true" />{BRAND.phoneDisplay}</a>
        <p><Clock aria-hidden="true" />{BRAND.hours}</p>
        <span>Free estimates · Assigned project management</span>
      </div>
    </section>
  );
}
