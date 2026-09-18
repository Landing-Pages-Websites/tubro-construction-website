import Image from "next/image";
import { ArrowDown, ArrowUpRight, ShieldCheck } from "lucide-react";
import type { ReactElement } from "react";
import exterior from "../../public/images/projects/0425021_exterior stain 01.jpg";
import { ConstructionDrawing } from "./ConstructionDrawing";
import styles from "./service-areas.module.css";

export function AreaHero(): ReactElement {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="area-heading">
      <ConstructionDrawing kind="measure" className={styles.heroMeasure} />
      <div className={styles.heroPhoto}>
        <Image src={exterior} alt="Tubro exterior staining project with natural wood siding" fill priority sizes="(min-width: 768px) 48vw, 88vw" />
      </div>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Western Washington / Service areas</p>
        <h1 id="area-heading">Thoughtful<br />remodeling.<br /><span>Close to home.</span></h1>
        <p className={styles.heroBody}>From the spaces you use every day to the home you have in mind. Residential remodeling across King and Pierce Counties.</p>
        <a className={styles.button} href="/schedule-an-estimate">Schedule a Free Estimate <ArrowUpRight aria-hidden="true" /></a>
        <a className={styles.textLink} href="#city-directory">Find your city <ArrowDown aria-hidden="true" /></a>
        <p className={styles.heroTrust}><ShieldCheck aria-hidden="true" /> Veteran-owned <span aria-hidden="true">·</span> Building since 2010</p>
      </div>
      <a className={styles.photoCaption} href="/interior-exterior-painting"><span>A fresh perspective on home</span><strong>Exterior staining <ArrowUpRight aria-hidden="true" /></strong></a>
    </section>
  );
}
