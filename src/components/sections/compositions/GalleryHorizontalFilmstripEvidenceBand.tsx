import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import type { SectionImage } from "@/lib/section-images";
import { sourceCategory } from "@/lib/section-images";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { LedgerList } from "@/components/sections/LedgerList";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";
import { FilterableFilmstrip } from "@/components/sections/compositions/FilterableFilmstrip";
import { PaintingGallery } from "@/components/sections/compositions/PaintingGallery";

/** Blueprint section whose merge requires the real client-side filter bar. */
const FILTERED_BLUEPRINT = "project-filters";

/** A room-scale lead photograph with four supporting finish references. */
function BathroomCollage({ images }: { images: SectionImage[] }): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-[1.6fr_1fr_1fr] lg:grid-rows-2">
      {images.map((image, index) => (
        <figure
          key={image.src}
          className={`min-w-0 ${index === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}
        >
          <DesignImage
            image={image}
            frameClassName={index === 0
              ? "aspect-[4/3] bg-plaster lg:aspect-auto lg:h-[calc(100%-2rem)] lg:min-h-[520px]"
              : "aspect-[4/5] bg-plaster sm:aspect-[5/4] lg:aspect-auto lg:h-[248px]"}
            sizes={index === 0
              ? "(min-width: 1280px) 523px, (min-width: 1024px) 43vw, 100vw"
              : "(min-width: 1280px) 327px, (min-width: 1024px) 27vw, 50vw"}
            withTab={false}
          />
          <figcaption className="mt-3 font-poppins text-xs leading-5 font-semibold text-action-deep sm:text-sm">
            {image.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

interface FilmstripBandProps {
  images: SectionImage[];
  dark: boolean;
}

/** Static contact-sheet band: equal frames on an ink field with frame counters. */
function FilmstripBand({ images, dark }: FilmstripBandProps): ReactElement {
  const field = dark ? "border border-white/15 bg-white/5" : "bg-ink";
  return (
    <ol className={`grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-5 ${field}`}>
      {images.map((image, index) => (
        <li key={image.src}>
          <div className="bg-white p-1.5">
            <DesignImage
              image={image}
              frameClassName="aspect-[4/5]"
              sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
            />
          </div>
          <p
            aria-hidden="true"
            className="mt-2 font-fjalla text-xs tracking-[0.12em] uppercase text-white/80"
          >
            Frame {String(index + 1).padStart(2, "0")}
          </p>
        </li>
      ))}
    </ol>
  );
}

/**
 * Composition owner: gallery-horizontal-filmstrip-evidence-band.
 * Intro copy row, then an evidence filmstrip of equal-height frames riding a
 * continuous L-shaped green datum; bullets print as a compact ledger. The
 * recent-projects merge of "project-filters" delegates the strip to the
 * client FilterableFilmstrip so the filter bar does something real.
 */
export function GalleryHorizontalFilmstripEvidenceBand({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
  slug,
}: SectionProps): ReactElement {
  if (slug === "interior-exterior-painting" && section.name === "project-gallery-faq") {
    return <PaintingGallery {...{ section, images, band, links, ctaTarget, isFirst, slug }} />;
  }
  const headingId = `${section.id}-heading`;
  // The manifest ink band exceeds the BackgroundBand union; own the dark field.
  const dark = section.background === "ink";
  const tone = dark ? "inverse" : "ink";
  const interactive = section.source_blueprint_sections.includes(FILTERED_BLUEPRINT);
  const bathroomCollage = slug === "bathroom-remodeling" && section.name === "project-gallery";
  return (
    <SectionShell
      section={section}
      band={dark ? "white" : band}
      className={dark ? "bg-ink!" : ""}
      labelledBy={headingId}
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* The measured datum: one vertical line from the eyebrow past the strip. */}
        <span aria-hidden="true" className="absolute top-1 bottom-1 left-0 hidden w-0.5 bg-action sm:block" />
        <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} tone={tone} />
        <div className="mt-10">
          {interactive ? (
            <FilterableFilmstrip
              images={images}
              categories={images.map((image) => sourceCategory(image.source))}
            />
          ) : bathroomCollage ? (
            <BathroomCollage images={images} />
          ) : (
            <FilmstripBand images={images} dark={dark} />
          )}
        </div>
        {section.content.bullets.length > 0 && (
          <div className="mt-10 flex items-end gap-6">
            <LedgerList items={section.content.bullets} tone={tone} className="max-w-2xl" />
            {/* Datum hand-off: the horizontal rule the vertical line turns into. */}
            <span aria-hidden="true" className="mb-2 hidden h-0.5 flex-1 bg-action lg:block" />
          </div>
        )}
        {(section.content.cta || section.content.secondary_cta || links.length > 0) && (
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            {section.content.secondary_cta && (
              <PhoneCta label={section.content.secondary_cta} tone={tone} />
            )}
            {bathroomCollage ? (
              <>
                {links.filter((link) => link.href === "/recent-projects").map((link) => (
                  <CtaLink key={link.href} label={link.label} href={link.href} />
                ))}
                <ContextLinks links={links.filter((link) => link.href !== "/recent-projects")} tone={tone} />
              </>
            ) : (
              <ContextLinks links={links} tone={tone} />
            )}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
