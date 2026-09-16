import type { ReactElement } from "react";
import { ArrowRight } from "lucide-react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { CtaLink } from "@/components/sections/CtaLink";
import styles from "./PaintingProcess.module.css";

/** A continuous reading path, scoped to the painting page. */
export function PaintingProcess({ section, band, links, ctaTarget }: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className={`mx-auto max-w-7xl px-5 sm:px-8 ${styles.process}`}>
        <div className={styles.intro}>
          <h2 id={headingId} className={styles.heading}>{section.content.headline}</h2>
          <p className={styles.description}>{section.content.body}</p>
        </div>
        <ol className={styles.steps}>
          {section.content.steps.map((step, index) => (
            <li key={step.number} data-painting-process={index} className={styles.step}>
              <div className={styles.marker} aria-hidden="true">
                <span className={styles.number}>{step.number}</span>
                {index < section.content.steps.length - 1 && <span data-painting-connector className={styles.connector} />}
                {index < section.content.steps.length - 1 && <ArrowRight className={styles.arrow} strokeWidth={1.5} />}
              </div>
              <div className={styles.copy}>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
        {(section.content.cta || links.length > 0) && (
          <div className={styles.links}>
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            <ContextLinks links={links} />
          </div>
        )}
      </div>
    </SectionShell>
  );
}
