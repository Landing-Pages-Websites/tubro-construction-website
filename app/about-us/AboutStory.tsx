import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import styles from "./about.module.css";

export function AboutStory(): ReactElement {
  return (
    <section id="company-story" aria-labelledby="story-heading" className={`${styles.container} ${styles.story}`}>
      <div className={styles.established}><p className={styles.eyebrow}>Our foundation</p><span className={styles.since}>Since</span><span className={styles.year}>2010<span aria-hidden="true">.</span></span><p>Veteran-owned.<br />Focused on home.</p><div className={styles.storyPhoto}><Image src="/images/design/about-us/02-company-story-0925012-bathroom-01-jpg.jpg" alt="Detail of the wood vanity, countertop, and tile in a Tubro bathroom remodel" fill sizes="(min-width: 900px) 320px, 70vw" /></div></div>
      <div className={styles.storyCopy}><h2 id="story-heading">Trust starts with knowing who is responsible.</h2><p>Tubro Construction is a veteran-owned residential remodeling and general-contracting company serving homeowners across King and Pierce Counties.</p><p>Founded in 2010, our work centers on residential remodeling and additions. From the first estimate to the finishing details, assigned project management and clear pricing help bring the work together.</p><div className={styles.storyNote}><span className={styles.eyebrow}>Our focus</span><p>Your home.<br />A clear plan.<br />An accountable team.</p></div><Link href="/service-areas" className={styles.textLink}>Explore our service areas <span aria-hidden="true">↗</span></Link></div>
    </section>
  );
}
