import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import styles from "./blog.module.css";

const topics = [
  ["01", "Kitchen planning", "kitchen-planning"],
  ["02", "Bathroom choices", "bathroom-choices"],
  ["03", "Contractor questions", "contractor-questions"],
  ["04", "Permit topics", "permit-topics"],
  ["05", "Cost questions", "cost-questions"],
] as const;

export default function BlogIntro(): ReactElement {
  return (
    <section id="hero" className={styles.intro} aria-labelledby="blog-title">
      <div className={styles.masthead}><span>Tubro field notes</span><span>Ideas for a home well lived in</span></div>
      <div className={styles.titleRow}>
        <h1 id="blog-title">Practical guidance for planning a <span>better remodel.</span></h1>
        <div className={styles.introAside}><p>Good projects start with good questions. Explore the rooms, choices, and conversations that shape your next remodel.</p><a href="#planning-notes" className={styles.textLink}>Find your starting point <ArrowDown size={18} aria-hidden="true" /></a></div>
      </div>
      <div className={styles.cover}>
        <figure className={styles.coverFigure}>
          <div className={styles.coverPhoto}><Image src="/images/design/blog/05-estimate-cta-0125047-kitchen-01-jpg.jpg" alt="Tubro kitchen with gray cabinetry, a generous island, and natural light" fill priority sizes="(max-width: 760px) 100vw, 65vw" /></div>
          <figcaption><span>A closer look at everyday living</span><a href="/recent-projects">Explore our work <ArrowUpRight size={16} aria-hidden="true" /></a></figcaption>
        </figure>
        <div className={styles.coverNote}><span className={styles.label}>Start with the way you live</span><h2>A better kitchen starts before the finishes.</h2><p>Where do people gather? What gets in the way? Start with the daily routines you want your space to support.</p><a href="#kitchen-planning" className={styles.textLink}>Kitchen planning notes <ArrowUpRight size={20} aria-hidden="true" /></a><div className={styles.measure} aria-hidden="true" /><span className={styles.coverFoot}>Thoughtful questions. Clearer decisions.</span></div>
      </div>
      <nav className={styles.topicNav} aria-label="Planning topics"><span className={styles.label}>In these notes</span><ol>{topics.map(([number, title, id]) => <li key={id}><a href={`#${id}`}><span>{number}</span>{title}<ArrowDown size={14} aria-hidden="true" /></a></li>)}</ol></nav>
    </section>
  );
}
