import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import type { ManifestSection } from "@/lib/manifest";
import { BuildDrawing } from "./BuildDrawing";
import styles from "./custom-home.module.css";

export function CustomHomeProcess({ section }: { section: ManifestSection }): ReactElement {
  return (
    <section id={section.name} className={styles.process} aria-labelledby="process-heading">
      <div className={styles.processIntro}><p className={styles.eyebrow}>From first conversation to finishing details</p><h2 id="process-heading">{section.content.headline}</h2><p className={styles.body}>{section.content.body}</p><a className={styles.textLink} href="#estimate-cta">Start with your goals<ArrowRight aria-hidden="true" /></a><BuildDrawing /></div>
      <ol className={styles.steps} data-motion-stagger>{section.content.steps.map(step => <li key={step.number}><span className={styles.stepNumber}>{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div><svg viewBox="0 0 44 44" fill="none" aria-hidden="true"><path d="M8 22H36M22 8V36" /><circle cx="22" cy="22" r="16" /></svg></li>)}</ol>
    </section>
  );
}
