import { ArrowUpRight, Phone } from "lucide-react";
import type { SectionProps } from "./types";
import { SectionShell } from "./SectionShell";
import { DesignImage } from "./DesignImage";
import { ContextLinks } from "./ContextLinks";
import { CtaLink } from "./CtaLink";
import { BRAND } from "@/lib/content";
import styles from "./painting-quote.module.css";

type PaintingQuoteProps = Pick<SectionProps, "section" | "images" | "band" | "links" | "ctaTarget" | "isFirst">;

export function PaintingQuote({ section, images, band, links, ctaTarget, isFirst }: PaintingQuoteProps) {
  const Heading = isFirst ? "h1" : "h2";
  const headingId = `${section.id}-heading`;
  return (
    <SectionShell section={section} band={band} bleed labelledBy={headingId} className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.visual}>
          {images[0] && <DesignImage image={images[0]} frameClassName={styles.photo} sizes="(min-width: 900px) 48vw, 100vw" withTab={false} />}
          <div className={styles.caption}><span>{images[0]?.label ?? "Interior & exterior painting"}</span><span>King & Pierce Counties</span></div>
        </div>
        <div className={styles.content}>
          <Heading id={headingId} className={styles.heading}>Request a<br />painting <span>quote.</span></Heading>
          <p className={styles.description}>{section.content.body}</p>
          <div className={styles.action}><CtaLink label={section.content.cta} href={ctaTarget} /></div>
          <div className={styles.contact}>
            <Phone size={22} strokeWidth={1.5} aria-hidden="true" />
            <div><p className={styles.contactLabel}>Prefer to talk it through?</p><a className={styles.phone} href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a><p className={styles.hours}>{BRAND.hours}</p></div>
          </div>
          <a href={`mailto:${BRAND.email}`} className={styles.email}><span>{BRAND.email}</span><ArrowUpRight size={17} aria-hidden="true" /></a>
          <ContextLinks links={links} className={styles.links} />
        </div>
      </div>
    </SectionShell>
  );
}
