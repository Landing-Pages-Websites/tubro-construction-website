import type { CSSProperties, ReactElement } from "react";
import { PROOF } from "@/lib/content";

import styles from "./UpperB.module.css";

export function ProofLedgerB(): ReactElement {
  return (
    <section id="trust-bar" aria-labelledby="proof-b-heading" className={styles.proof}>
      <span aria-hidden="true" className={styles.proofNumber}>02</span>
      <div className={styles.proofInner}>
        <h2 id="proof-b-heading" className={styles.proofHeading}><span>A straightforward</span>{" "}<span>foundation for</span>{" "}<span>a major</span>{" "}<span>investment.</span></h2>
        <ol className={styles.ledger}>
          {PROOF.points.map((point, index) => <li key={point} style={{ "--step": index } as CSSProperties}><span className={styles.ledgerNumber}>0{index + 1}</span><span data-motion="copy" className={styles.ledgerText}>{point}</span></li>)}
        </ol>
        <p className={styles.proofCaption}><span>{PROOF.captionLead}</span><br /><span>{PROOF.captionAccent} {PROOF.captionTail}</span></p>
      </div>
    </section>
  );
}
