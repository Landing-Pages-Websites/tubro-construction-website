import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";
import { CropCorners } from "@/components/sections/CropCorners";
import { CaptionTab } from "@/components/sections/CaptionTab";

/**
 * Composition owner: hero-cinematic-image-field-inset-slab.
 * Wide cinematic photo field with an offset plaster slab carrying the copy;
 * green crop-mark brackets at the field corners tie slab and photo into one
 * measured frame. The slab, not the photo, sets the section height.
 */
export function HeroCinematicImageFieldInsetSlab({
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
      <div className="relative overflow-hidden">
        {photo && (
          <div className="absolute inset-0">
            <DesignImage
              image={photo}
              frameClassName="h-full w-full"
              sizes="100vw"
              priority={isFirst}
              withTab={false}
            />
          </div>
        )}
        <CropCorners corners={["tl", "tr", "bl", "br"]} className="m-4 sm:m-6" />
        {/* Caption tab clears the crop-mark brackets so no motif stroke crosses it. */}
        {photo?.label && (
          <CaptionTab label={photo.label} className="!bottom-9 !left-auto right-9 z-10" />
        )}
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
          {/* Offset inset slab — deliberately off-center against the field. */}
          <div className="max-w-md border border-ink/10 bg-plaster px-7 py-9 shadow-lg shadow-ink/25 sm:px-9">
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="quiet" />
            <div className="mt-7 flex flex-col items-start gap-5">
              {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
              {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
            </div>
            <ContextLinks links={links} className="mt-5" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
