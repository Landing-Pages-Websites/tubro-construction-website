import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { LedgerList } from "@/components/sections/LedgerList";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";
import { CropCorners } from "@/components/sections/CropCorners";

const RULER_TICKS = 33;
const RULER_UNITS = 8;

/** Dimension-bracket motif from the approved frame: a measured ruler strip. */
function RulerStrip(): ReactElement {
  return (
    <div aria-hidden="true" className="mt-8 border border-action bg-plaster px-2 pb-1">
      <div className="flex items-start justify-between">
        {Array.from({ length: RULER_TICKS }, (_, index) => (
          <span key={index} className={`w-px bg-ink/70 ${index % 4 === 0 ? "h-3" : "h-1.5"}`} />
        ))}
      </div>
      <div className="flex justify-between px-4 font-fjalla text-[10px] leading-none text-ink/70">
        {Array.from({ length: RULER_UNITS }, (_, index) => (
          <span key={index}>{index + 1}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Composition owner: hero-centered-estimate-brief.
 * Centered brief sheet on plaster: headline, ruler motif, and the approved
 * project types as a static measured list (an informational preview of what
 * can be requested — never fake controls). Proof photos flank the periphery
 * under crop marks, joined by a green dimension frame.
 */
export function HeroCenteredEstimateBrief({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [first, second] = images;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Dimension frame linking the peripheral proof around the brief. */}
        <span aria-hidden="true" className="absolute top-10 bottom-0 left-0 hidden w-0.5 bg-action xl:block" />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-0.5 bg-action xl:block" />
        <span aria-hidden="true" className="absolute right-0 bottom-0 hidden h-40 w-0.5 bg-action xl:block" />
        {first && (
          <div className="absolute top-0 left-8 hidden w-48 xl:block">
            <CropCorners corners={["tl", "bl"]} className="-m-3" />
            <DesignImage image={first} frameClassName="aspect-[4/3]" sizes="192px" priority={isFirst} />
          </div>
        )}
        {second && (
          <div className="absolute right-8 bottom-6 hidden w-48 xl:block">
            <CropCorners corners={["tr", "br"]} className="-m-3" />
            <DesignImage image={second} frameClassName="aspect-[4/3]" sizes="192px" priority={isFirst} />
          </div>
        )}
        <div className="mx-auto max-w-2xl border border-ink/10 bg-white px-6 py-10 shadow-lg shadow-ink/5 sm:px-12 sm:py-14">
          <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
          <RulerStrip />
          {section.content.options.length > 0 && (
            <LedgerList items={section.content.options} className="mt-7" />
          )}
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
          </div>
          <ContextLinks links={links} className="mt-6" />
        </div>
        {images.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 xl:hidden">
            {images.slice(0, 2).map((image) => (
              <DesignImage key={image.src} image={image} frameClassName="aspect-[4/3]" sizes="50vw" />
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
