import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { DesignImage } from "@/components/sections/DesignImage";
import { CtaLink } from "@/components/sections/CtaLink";
import { ContextLinks } from "@/components/sections/ContextLinks";
import styles from "./PaintingGallery.module.css";

/** An editorial project board, scoped to the painting gallery. */
export function PaintingGallery({ section, images, links, ctaTarget, isFirst }: Omit<SectionProps, "path">): ReactElement {
  const headingId = `${section.id}-heading`;
  const Heading = isFirst ? "h1" : "h2";

  return (
    <SectionShell section={section} band="white" labelledBy={headingId} className={styles.section}>
      <div className={styles.drafting} aria-hidden="true">
        <svg data-painting-drawing className={styles.measure} width="72" height="1600" viewBox="0 0 72 1600" fill="none" focusable="false">
          <path d="M36 0V1600" />
          {Array.from({ length: 80 }, (_, i) => <path key={i} d={`M36 ${i * 20}h${i % 5 === 0 ? 24 : 10}`} />)}
          <path d="M16 80h40M36 60v40M16 1520h40M36 1500v40" />
        </svg>
        <svg data-painting-drawing className={styles.roller} viewBox="0 0 440 320" fill="none" focusable="false">
          <rect x="64" y="48" width="226" height="66" rx="10" />
          <path d="M78 48v66M276 48v66M290 81h35v65H177v44M170 190h14v95h-14zM177 203v66" />
          <path d="M42 26h270M42 18v16M312 18v16M28 48v66M20 48h16M20 114h16" strokeWidth="1" />
          <path d="M50 140h80M50 154h56M348 52v160M338 52h20M338 212h20" strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="177" cy="144" r="9" strokeWidth="1" />
          <path d="M159 144h36M177 126v36" strokeWidth="1" />
        </svg>
        <svg data-painting-drawing className={styles.elevation} viewBox="0 0 660 340" fill="none" focusable="false">
          <path d="M64 164 242 34l178 130M85 164 242 50l157 114M102 155v147h280V155M382 180h170v122H382M370 164h198v16H382" />
          <path d="M136 191h65v67h-65zM145 200h47v49h-47zM168 200v49M145 224h47M278 191h65v67h-65zM287 200h47v49h-47zM310 200v49M287 224h47M226 222h36v80M415 206h104v96M415 230h104M415 254h104M415 278h104M50 302h550" />
          <path d="M72 324h504M72 316v16M576 316v16M242 12v310M30 164h590" strokeDasharray="4 7" strokeWidth="1" />
          <circle cx="242" cy="143" r="21" />
          <path d="M221 143h42M242 122v42" />
        </svg>
      </div>
      <div className={styles.inner}>
        <div className={styles.masthead}>
          <span>{section.content.eyebrow}</span>
          <span aria-hidden="true">Paint / Stain / Outdoor living</span>
        </div>
        <div className={styles.board}>
          <div className={styles.intro}>
            <span className={styles.eyebrow}>The project collection</span>
            <Heading id={headingId} className={styles.heading}>{section.content.headline}</Heading>
            <p className={styles.body}>{section.content.body}</p>
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} className={styles.cta} />}
          </div>
          {images.map((image, index) => (
            <figure key={image.src} className={`${styles.photo} ${styles[`photo${index + 1}`] ?? ""}`}>
              <DesignImage
                image={image}
                withTab={false}
                frameClassName={styles.frame}
                sizes={index === 0 ? "(min-width: 1280px) 670px, (min-width: 768px) 56vw, 100vw" : "(min-width: 1280px) 380px, (min-width: 768px) 30vw, 50vw"}
              />
              <figcaption className={styles.caption}>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <span>{image.label}</span>
                <span aria-hidden="true" className={styles.captionLine} />
              </figcaption>
            </figure>
          ))}
          <div className={styles.swatch} aria-hidden="true">
            <span>Finishes that<br />feel like home.</span>
            <div data-painting-swatch className={styles.chips}><i /><i /><i /></div>
            <small>Color. Texture. Character.</small>
          </div>
        </div>
        {links.length > 0 && <div className={styles.links}><ContextLinks links={links} tone="inverse" /></div>}
      </div>
    </SectionShell>
  );
}
