import type { ReactElement } from "react";
import type { ManifestSection } from "@/lib/manifest";
import { LeadForm } from "@/components/sections/LeadForm";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { formKeyForSlug } from "@/lib/form-keys";
import styles from "./about.module.css";

export function AboutEstimate({ section }: { section: ManifestSection }): ReactElement {
  return (
    <section id="estimate-cta" aria-labelledby="estimate-heading" className={styles.estimate}>
      <span id="form" />
      <div className={`${styles.container} ${styles.estimateGrid}`}>
        <div className={styles.estimateCopy}><p className={styles.eyebrow}>Your next chapter</p><h2 id="estimate-heading">Tell us what<br />you’re planning.</h2><p>{section.content.body}</p><div className={styles.office}><h3>Talk with our team</h3><PhoneCta /><a href="mailto:workorders@tubroconstruction.com">workorders@tubroconstruction.com</a><p>Monday–Friday<br />7:00 a.m.–4:00 p.m.</p></div><p className={styles.location}>Serving homeowners across<br />King &amp; Pierce Counties, Washington.</p></div>
        <div className={styles.formPanel}><LeadForm formKey={formKeyForSlug("about-us")} pagePath="/about-us" options={section.content.options} submitLabel={section.content.cta} idPrefix={section.id} /></div>
      </div>
    </section>
  );
}
