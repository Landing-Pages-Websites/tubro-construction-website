import type { ReactElement } from "react";
import type { SectionProps } from "./types";
import { SectionShell } from "./SectionShell";
import { SectionIntro } from "./SectionIntro";
import { DesignImage } from "./DesignImage";
import { CtaLink } from "./CtaLink";
import { PhoneCta } from "./PhoneCta";
import { ContextLinks } from "./ContextLinks";
import styles from "./PaintingHero.module.css";

/** Painting-specific framing keeps the house and its finish visible beside the copy. */
export function PaintingHero({ section, images, band, links, ctaTarget, isFirst }: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const lead = images.find((image) => image.source === "0825017_ext stain 01.jpeg") ?? images[0];
  return (
    <SectionShell section={section} band={band} bleed labelledBy={headingId}>
      <div className={styles.hero}>
        <div className={styles.copy}>
          <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="loud" className={styles.intro} />
          <div className={styles.actions}>
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
          </div>
          <ContextLinks links={links} className={styles.links} />
        </div>
        <figure data-painting-photo className={styles.project}>
          {lead && <DesignImage image={lead} frameClassName={styles.photo} sizes="(min-width: 1440px) 740px, (min-width: 900px) 54vw, 100vw" priority={isFirst} objectPosition="50% 48%" withTab={false} />}
          <figcaption className={styles.caption}>
            <span>Fresh color. A lasting first impression.</span>
            <span className={styles.palette} aria-label="Project palette: sage siding, light stone, warm timber">
              <i /><i /><i />
            </span>
          </figcaption>
        </figure>
      </div>
    </SectionShell>
  );
}
