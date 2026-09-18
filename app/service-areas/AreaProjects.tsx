import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import { IMAGES } from "@/lib/images";
import bathroom from "../../public/images/projects/0525025_bathroom 02.jpg";
import { ConstructionDrawing } from "./ConstructionDrawing";
import styles from "./service-areas.module.css";

export function AreaProjects(): ReactElement {
  return (
    <section id="project-map" className={`${styles.section} ${styles.projects}`} aria-labelledby="projects-heading">
      <div className={styles.projectIntro}>
        <p className={styles.eyebrow}>The places we call home</p>
        <h2 id="projects-heading">Made for life<br />in the Northwest.</h2>
        <p>A better morning routine. Room to gather. An outdoor space you’ll use all summer. See what careful planning and craftsmanship can bring to your home.</p>
        <a className={styles.textLink} href="/recent-projects">Explore recent projects <ArrowUpRight aria-hidden="true" /></a>
      </div>
      <a href="/bathroom-remodeling" className={styles.bathProject}>
        <div className={styles.projectPhoto}><Image src={bathroom} alt="Tubro bathroom remodel with a glass shower, pebble tile accent, and cream vanity" fill sizes="(min-width: 768px) 32vw, 90vw" /></div>
        <span className={styles.projectCaption}><span>Space to slow down<small>Bathroom remodeling</small></span><ArrowUpRight aria-hidden="true" /></span>
      </a>
      <a href="/general-contractor" className={styles.deckProject}>
        <div className={styles.projectPhoto}><Image src={IMAGES.workDeck.src} alt={IMAGES.workDeck.alt} fill sizes="(min-width: 768px) 53vw, 90vw" /></div>
        <span className={styles.projectCaption}><span>A little closer to the outdoors<small>Decks &amp; outdoor living</small></span><ArrowUpRight aria-hidden="true" /></span>
      </a>
      <div className={styles.projectFootnote}><p>Real homes.<br /><span>Real Tubro craftsmanship.</span></p><ConstructionDrawing kind="detail" className={styles.projectDrawing} /></div>
    </section>
  );
}
