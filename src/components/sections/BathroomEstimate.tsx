import type { ReactElement } from "react";
import { Phone } from "lucide-react";
import type { SectionProps } from "./types";
import { SectionShell } from "./SectionShell";
import { DesignImage } from "./DesignImage";
import { ContextLinks } from "./ContextLinks";
import { BathroomContactForm } from "./BathroomContactForm";
import { BRAND } from "@/lib/content";
import styles from "./bathroom-estimate.module.css";

/** Bathroom-only estimate studio; submission stays with the shared lead form. */
export function BathroomEstimate({ section, images, band, links, path, isFirst }: SectionProps): ReactElement {
  const Heading = isFirst ? "h1" : "h2";
  const headingId = `${section.id}-heading`;
  return (
    <SectionShell section={section} band={band} bleed labelledBy={headingId} className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.story}>
          <Heading id={headingId} className={styles.heading}>Request a bathroom remodeling <span>estimate.</span></Heading>
          <p className={styles.description}>{section.content.body}</p>
          {images[0] && <figure className={styles.project}>
            <DesignImage image={images[0]} frameClassName={styles.photo} sizes="(min-width: 900px) 38vw, 85vw" withTab={false} objectPosition="50% 65%" />
            <figcaption className={styles.caption}>A Tubro bathroom remodel</figcaption>
          </figure>}
          <ContextLinks links={links} className={styles.links} />
        </div>
        <div className={styles.panel}>
          <div className={styles.formIntro}><h3>Tell us what you have in mind.</h3><p>A few details today. A space that feels like you.</p></div>
          <BathroomContactForm pagePath={path} idPrefix={section.id} />
          <div className={styles.contact}><Phone size={20} strokeWidth={1.5} aria-hidden="true" /><div><span>Prefer a conversation?</span><a href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a><p>{BRAND.hours}</p></div></div>
        </div>
      </div>
      <div className={styles.footer}><span>Bathroom remodeling, built around you.</span><span>{BRAND.serviceArea}, Washington</span></div>
    </SectionShell>
  );
}
