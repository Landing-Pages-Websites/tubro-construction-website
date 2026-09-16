import Image from "next/image";
import type { ReactElement } from "react";
import { CtaLink } from "@/components/sections/CtaLink";
import styles from "./about.module.css";

export function AboutHero(): ReactElement {
  return (
    <section id="hero" aria-labelledby="about-heading" className={`${styles.container} ${styles.hero}`}>
      <div className={styles.heroIntro}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>About Tubro Construction</p>
          <h1 id="about-heading">The team behind every <span>Tubro project.</span></h1>
          <div className={styles.heroSummary}><p>Residential remodeling and general contracting, brought together by a team you can get to know.</p><div className={styles.heroActions}><CtaLink label="Schedule a Free Estimate" href="#estimate-cta" /><a className={styles.textLink} href="#team">Meet the team <span aria-hidden="true">↓</span></a></div></div>
        </div>
      <figure className={styles.heroFigure}>
        <div className={styles.heroPhoto}><Image src="/images/design/about-us/01-hero-0125047-kitchen-01-jpg.jpg" alt="Tubro kitchen remodel with gray cabinetry, a dark island, and natural light from the garden" fill priority sizes="(min-width: 1440px) 670px, (min-width: 900px) 50vw, 100vw" /></div>
        <figcaption><span>Spaces for everyday living.</span><span>Kitchen remodeling · Tubro Construction</span></figcaption>
      </figure>
      </div>
      <ul id="trust-bar" className={styles.facts}><li>Veteran-owned</li><li>Established 2010</li><li>King &amp; Pierce Counties, WA</li></ul>
    </section>
  );
}
