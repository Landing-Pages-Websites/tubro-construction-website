import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";
import { CaptionTab } from "@/components/sections/CaptionTab";

/**
 * Composition owner: hero-headline-over-photo-quiet-zone.
 * Full-bleed authentic photo field; the headline lives in a protected quiet
 * zone — a translucent plaster panel over the photo's left side — so copy
 * stays ink-on-light at AA contrast. Datum motif closes the lower-left edge.
 */
export function HeroHeadlineOverPhotoQuietZone({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [photo] = images;
  return (
    <SectionShell section={section} band={band} bleed labelledBy={headingId}>
      <div className="relative flex min-h-[520px] items-center overflow-hidden lg:min-h-[620px]">
        {photo && (
          <div className="absolute inset-0">
            <DesignImage
              image={photo}
              frameClassName="h-full w-full"
              sizes="100vw"
              priority={isFirst}
              withTab={false}
            />
            {photo.label && (
              // The tab reads against the exposed photo; below sm the quiet
              // zone spans the full width, so it rests until the photo shows.
              <CaptionTab label={photo.label} position="top-left" className="left-auto! right-4 hidden sm:inline-block sm:right-6" />
            )}
          </div>
        )}
        {/* Protected quiet zone: plaster panel keeps the copy field legible. */}
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-full bg-plaster/90 sm:w-[58%] lg:w-[46%]" />
        {/* Datum motif: measured green L along the lower-left of the field. */}
        <span aria-hidden="true" className="absolute top-14 bottom-7 left-4 w-0.5 bg-action sm:left-6" />
        <span aria-hidden="true" className="absolute bottom-7 left-4 right-4 h-0.5 bg-action sm:left-6 sm:right-6" />
        <div className="relative w-full px-6 py-20 sm:max-w-[58%] sm:px-14 lg:max-w-[46%] lg:px-20">
          <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="loud" />
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
          </div>
          <ContextLinks links={links} className="mt-5" />
        </div>
      </div>
    </SectionShell>
  );
}
