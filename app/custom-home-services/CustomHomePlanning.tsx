import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import type { ManifestSection } from "@/lib/manifest";
import { FloorPlan } from "./FloorPlan";
import styles from "./custom-home.module.css";

const PLANNING_NOTES = ["Your goals, your priorities, your way of living.", "Care in the construction and the finishing details.", "Bring the possibilities into a clear project scope.", "Discuss your project and request a free estimate.", "Keep the next conversation connected to your plans."];

export function CustomHomePlanning({ section }: { section: ManifestSection }): ReactElement {
  return (
    <section id={section.name} className={styles.planning} aria-labelledby="planning-heading">
      <div className={styles.planningIntro}><p className={styles.eyebrow}>Room for your ideas</p><h2 id="planning-heading">{section.content.headline}</h2><p className={styles.body}>{section.content.body}</p><a className={styles.textLink} href="/contact">Talk through your plans<ArrowUpRight aria-hidden="true" /></a></div>
      <div className={styles.planSheet}><div className={styles.sheetTitle}><span>Ideas into a plan</span><span>Every detail connects</span></div><FloorPlan /><p>Concept plan · A starting point for the conversation</p></div>
      <div className={styles.planningList} data-motion-stagger>{section.content.items.map((item, index) => <div key={item}><span className={styles.planMarker} aria-hidden="true" /><h3>{item}</h3><p>{PLANNING_NOTES[index]}</p></div>)}</div>
    </section>
  );
}
