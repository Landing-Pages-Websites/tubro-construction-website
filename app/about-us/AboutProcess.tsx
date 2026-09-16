import type { ReactElement } from "react";
import type { ManifestStep } from "@/lib/manifest";
import styles from "./about.module.css";

export function AboutProcess({ steps }: { steps: ManifestStep[] }): ReactElement {
  return (
    <section id="how-we-work-veteran-owned" aria-labelledby="process-heading" className={`${styles.container} ${styles.process}`}>
      <span id="how-it-works" />
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Working together</p><h2 id="process-heading">Clear communication<br />is part of the craft.</h2></div><p>A defined scope, upfront pricing, and an assigned point of contact help you follow your project from the first conversation through the finish.</p></div>
      <ol className={styles.steps}>{steps.map((step) => <li key={step.number}><span className={styles.stepNumber}>{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p></li>)}</ol>
    </section>
  );
}
