import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import styles from "./about.module.css";

export function AboutProjects(): ReactElement {
  return (
    <section id="services" aria-labelledby="work-heading" className={`${styles.container} ${styles.projects}`}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>The work behind the introduction</p><h2 id="work-heading">Built for the way<br />you live.</h2></div><Link className={styles.textLink} href="/recent-projects">Explore recent projects <span aria-hidden="true">↗</span></Link></div>
      <div className={styles.projectGrid}>
        <figure><div className={styles.projectPhoto}><Image src="/images/design/about-us/01-hero-1221004-deck-01-jpg.jpg" alt="Tubro deck project with black railings overlooking a residential neighborhood and evergreens" fill sizes="(min-width: 1440px) 760px, (min-width: 900px) 58vw, 100vw" /></div><figcaption><span>More room for life outside.</span><Link href="/recent-projects">Deck &amp; outdoor living <span aria-hidden="true">↗</span></Link></figcaption></figure>
        <figure><div className={styles.projectPhoto}><Image src="/images/design/about-us/01-hero-0925012-bathroom-01-jpg.jpg" alt="Tubro bathroom remodel featuring a freestanding tub, glass shower, and wood vanity" fill sizes="(min-width: 1440px) 500px, (min-width: 900px) 38vw, 100vw" /></div><figcaption><span>Care in the everyday details.</span><Link href="/bathroom-remodeling">Bathroom remodeling <span aria-hidden="true">↗</span></Link></figcaption></figure>
      </div>
    </section>
  );
}
