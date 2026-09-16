import { ArrowUpRight, Phone, Plus } from "lucide-react";
import type { ReactElement } from "react";
import type { ManifestSection } from "@/lib/manifest";
import { LeadForm } from "@/components/sections/LeadForm";
import { formKeyForSlug } from "@/lib/form-keys";
import { BRAND } from "@/lib/content";
import styles from "./custom-home.module.css";

const QUESTIONS = [
  ["Where do you offer custom home services?", "Tubro works with homeowners in King and Pierce Counties, Washington. Share your project city when you get in touch."],
  ["What should I share in the first conversation?", "Tell us your goals, the project location, and what you have in mind. The estimate conversation is a chance to discuss scope and your next step."],
  ["Who will help coordinate the build?", "Assigned project management gives you a point of contact to keep communication coordinated. Scope and pricing are clarified before the build path is set."],
];

export function CustomHomeEstimate({ section }: { section: ManifestSection }): ReactElement {
  return (
    <>
      <section id="faq" className={styles.faq} aria-labelledby="faq-heading"><div><p className={styles.eyebrow}>Before we begin</p><h2 id="faq-heading">Good plans start<br />with good questions.</h2><a className={styles.textLink} href="/contact">Ask us a question<ArrowUpRight aria-hidden="true" /></a></div><div className={styles.questions}>{QUESTIONS.map(([question, answer]) => <details key={question}><summary>{question}<Plus aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
      <section id={section.name} className={styles.estimate} aria-labelledby="estimate-heading">
        <div className={styles.estimateCopy}><p className={styles.eyebrow}>Let’s put your ideas on the table</p><h2 id="estimate-heading">{section.content.headline}</h2><p className={styles.body}>{section.content.body}</p><a className={styles.estimatePhone} href={BRAND.phoneHref}><Phone aria-hidden="true" />253-216-2633</a><p className={styles.officeHours}>Monday–Friday<br />7:00 a.m.–4:00 p.m.</p><a className={styles.officeEmail} href="mailto:workorders@tubroconstruction.com">workorders@tubroconstruction.com</a><svg className={styles.estimateRoute} viewBox="0 0 400 120" fill="none" aria-hidden="true"><path d="M2 12H82Q102 12 102 32V90Q102 110 122 110H376M360 94L376 110L360 126" /><circle cx="2" cy="12" r="4" /></svg></div>
        <div className={styles.formSheet}><div className={styles.formTitle}><h3>Your project starts here.</h3><span>Free estimate</span></div><LeadForm formKey={formKeyForSlug("custom-home-services")} pagePath="/custom-home-services" options={section.content.options} submitLabel={section.content.cta} idPrefix="custom-home" /></div>
      </section>
    </>
  );
}
