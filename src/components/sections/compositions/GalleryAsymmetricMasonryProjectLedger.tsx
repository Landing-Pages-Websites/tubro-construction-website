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

/** An oversized carpenter's square and a separate measuring rail frame the prints. */
function ProjectRulers(): ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[#eee8db]">
      <svg data-gc-ruler="horizontal" viewBox="0 0 560 560" focusable="false" className="absolute -top-24 -right-40 w-[480px] rotate-[18deg] text-action sm:-right-16 sm:w-[640px]">
        <path d="M40 40H500V112H112V500H40Z" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.28" />
        <path d="M60 60H480M60 60V480" fill="none" stroke="currentColor" strokeOpacity="0.2" />
        {Array.from({ length: 43 }, (_, tick) => (
          <g key={tick} stroke="currentColor" strokeOpacity="0.35">
            <path d={`M${70 + tick * 10} 40v${tick % 5 === 0 ? 27 : 12}`} />
            <path d={`M40 ${70 + tick * 10}h${tick % 5 === 0 ? 27 : 12}`} />
          </g>
        ))}
        {Array.from({ length: 8 }, (_, unit) => (
          <text key={unit} x={100 + unit * 50} y="94" fill="currentColor" fillOpacity="0.45" fontSize="13" className="font-fjalla">{unit + 1}</text>
        ))}
      </svg>
      <svg data-gc-ruler="horizontal" viewBox="0 0 1200 48" preserveAspectRatio="none" focusable="false" className="absolute inset-x-0 bottom-0 h-12 w-full text-action">
        <path d="M0 47H1200" stroke="currentColor" strokeOpacity="0.5" />
        {Array.from({ length: 121 }, (_, tick) => (
          <path key={tick} d={`M${tick * 10} 48v-${tick % 10 === 0 ? 34 : tick % 5 === 0 ? 22 : 10}`} stroke="currentColor" strokeOpacity={tick % 10 === 0 ? "0.45" : "0.2"} />
        ))}
      </svg>
      <div className="absolute top-1/3 bottom-24 left-[2%] hidden w-px bg-action/20 xl:block" />
    </div>
  );
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
  slug,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const measuredGallery = slug === "general-contractor" && section.name === "project-proof";
  // The manifest ink band exceeds the BackgroundBand union; own the dark field.
  const dark = !measuredGallery && section.background === "ink";
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
      {measuredGallery && <ProjectRulers />}
      <div className={`mx-auto max-w-7xl px-5 sm:px-8 ${measuredGallery ? "relative pb-8" : ""}`}>
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
