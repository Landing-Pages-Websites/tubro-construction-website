import { ArrowUpRight, MapPin, House, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import styles from "./service-areas.module.css";

export function AreaFit(): ReactElement {
  return (
    <section id="service-fit" className={`${styles.section} ${styles.fit}`} aria-labelledby="fit-heading">
      <div className={styles.fitIntro}>
        <p className={styles.eyebrow}>Beyond our listed communities</p>
        <h2 id="fit-heading">Outside the list?<br /><span>Let’s talk.</span></h2>
        <p className={styles.fitBody}>A city list doesn’t tell the whole story. Our office reviews out-of-area inquiries individually. Share a little about your home and we’ll help confirm whether your project is a fit.</p>
        <div className={styles.fitPhone}><span>Prefer a conversation?</span><a href={BRAND.phoneHref}><Phone aria-hidden="true" />{BRAND.phoneDisplay}</a></div>
      </div>
      <div className={styles.fitPanel}>
        <h3>A good place to start.</h3>
        <p>Two details help us point you in the right direction.</p>
        <ul className={styles.fitDetails}>
          <li><MapPin aria-hidden="true" /><div><strong>Your location</strong><span>The city or ZIP code of your project.</span></div></li>
          <li><House aria-hidden="true" /><div><strong>What you have in mind</strong><span>A remodel, addition, new home, or another project.</span></div></li>
        </ul>
        <a className={styles.button} href="/contact">Ask about your location <ArrowUpRight aria-hidden="true" /></a>
        <p className={styles.fitNote}>Our office will review your location and project scope.</p>
      </div>
    </section>
  );
}
