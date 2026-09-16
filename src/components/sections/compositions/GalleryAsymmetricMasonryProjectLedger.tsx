import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import type { SectionImage } from "@/lib/section-images";
import { splitQuestion } from "@/lib/manifest";
import { SectionShell } from "@/components/sections/SectionShell";
import { Eyebrow } from "@/components/sections/Eyebrow";
import { LedgerList } from "@/components/sections/LedgerList";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";

interface MountedPhotoProps {
  image: SectionImage;
  /** Slot geometry + mobile order; desktop columns keep their own DOM order. */
  className: string;
}

/** White-mounted print on the ink field, caption tab riding the photo edge. */
function MountedPhoto({ image, className }: MountedPhotoProps): ReactElement {
  return (
    <div className={`bg-white p-1.5 shadow-md shadow-black/30 ${className}`}>
      <DesignImage image={image} frameClassName="h-full" sizes="(min-width: 1024px) 30vw, 50vw" />
    </div>
  );
}

/**
 * Composition owner: gallery-asymmetric-masonry-project-ledger.
 * Varied-size mounted prints in three staggered ledger columns on an ink
 * field: headline slab top-right, estimate brief mid-center, photos filling
 * the counterweight cells. Handles 4–6 photos; a merged FAQ with "Q? A."
 * bullets prints as a ruled Q/A ledger below the masonry.
 */
export function GalleryAsymmetricMasonryProjectLedger({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  // The manifest ink band exceeds the BackgroundBand union; own the dark field.
  const dark = section.background === "ink";
  const tone = dark ? "inverse" : "ink";
  const hairline = dark ? "border-white/15" : "border-ink/15";
  const Heading = isFirst ? "h1" : "h2";
  const { bullets } = section.content;
  const qaRows =
    section.source_blueprint_sections.includes("faq") &&
    bullets.length > 0 &&
    bullets.every((bullet) => bullet.includes("?"))
      ? bullets.map(splitQuestion)
      : null;
  return (
    <SectionShell
      section={section}
      band={dark ? "white" : band}
      className={dark ? "bg-ink!" : ""}
      labelledBy={headingId}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className={`mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-5 ${hairline}`}>
          <Eyebrow tone={tone}>{section.content.eyebrow}</Eyebrow>
          <span
            aria-hidden="true"
            className={`font-fjalla text-xs tracking-[0.12em] uppercase ${dark ? "text-white/70" : "text-ink/60"}`}
          >
            Project Ledger
          </span>
        </div>
        {/* Mobile: grid items ordered headline → photos → brief via display:contents columns. */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-[8fr_9fr_8fr] lg:gap-5">
          <div className="contents lg:flex lg:flex-col lg:gap-5">
            {images[0] && <MountedPhoto image={images[0]} className="order-2 col-span-2 aspect-[16/10] lg:aspect-[4/3]" />}
            {images[2] && <MountedPhoto image={images[2]} className="order-5 aspect-[4/3] lg:aspect-[5/4]" />}
          </div>
          <div className="contents lg:flex lg:flex-col lg:gap-5">
            {images[1] && <MountedPhoto image={images[1]} className="order-3 aspect-[4/3] lg:aspect-[3/4]" />}
            <div className="order-4 col-span-2 border border-ink/10 bg-white p-6 sm:p-7">
              <p className="font-fjalla text-[15px] leading-relaxed text-ink/80">{section.content.body}</p>
              {(section.content.cta || section.content.secondary_cta) && (
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                  {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
                  {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
                </div>
              )}
              <ContextLinks links={links} className="mt-5" />
            </div>
            {images[4] && <MountedPhoto image={images[4]} className="order-7 aspect-[4/3]" />}
          </div>
          <div className="contents lg:flex lg:flex-col lg:gap-5">
            <div className="order-1 col-span-2 border border-ink/10 bg-plaster p-6 sm:p-8">
              <Heading
                id={headingId}
                className="font-poppins text-2xl leading-[1.1] font-bold tracking-tight text-ink sm:text-3xl"
              >
                {section.content.headline}
              </Heading>
            </div>
            {images[3] && <MountedPhoto image={images[3]} className="order-6 aspect-[4/3] lg:aspect-[3/4]" />}
            {images[5] && <MountedPhoto image={images[5]} className="order-8 aspect-[4/3] lg:aspect-[5/4]" />}
          </div>
        </div>
        {qaRows && (
          <dl className="mt-12 lg:max-w-4xl">
            {qaRows.map((row) => (
              <div key={row.question} className={`border-b py-5 first:border-t ${hairline}`}>
                <dt className={`font-poppins text-base font-semibold ${dark ? "text-white" : "text-ink"}`}>
                  {row.question}
                </dt>
                <dd className={`mt-2 font-fjalla text-[15px] leading-relaxed ${dark ? "text-white/75" : "text-ink/75"}`}>
                  {row.answer}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {!qaRows && bullets.length > 0 && (
          <LedgerList items={bullets} tone={tone} className="mt-12 lg:max-w-3xl" />
        )}
      </div>
    </SectionShell>
  );
}
