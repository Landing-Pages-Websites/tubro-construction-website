import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { LedgerList } from "@/components/sections/LedgerList";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";
import { CaptionTab } from "@/components/sections/CaptionTab";

/**
 * Composition owner: content-image-as-canvas-editorial-quiet-area.
 * The focal photograph is the full-bleed canvas; copy lives in a plaster
 * quiet-area panel whose height drives the section, so the text is always
 * live-copy-safe. A thin green dimension frame is inset from the canvas edge.
 */
export function ContentImageAsCanvasEditorialQuietArea({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [canvas] = images;
  return (
    <SectionShell section={section} band={band} bleed labelledBy={headingId}>
      <div className="relative lg:min-h-[620px]">
        {canvas && (
          <div className="absolute inset-0">
            <DesignImage
              image={canvas}
              frameClassName="h-full"
              sizes="100vw"
              priority={isFirst}
              withTab={false}
            />
          </div>
        )}
        {/* Dimension-bracket motif: one measured frame inset from the canvas edge. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 border border-action sm:inset-6"
        />
        {/* Caption tab sits inside the dimension frame so no rule crosses the label. */}
        {canvas?.label && (
          <CaptionTab label={canvas.label} className="!bottom-8 !left-8 z-10 sm:!bottom-10 sm:!left-10" />
        )}
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="max-w-md border border-ink/10 bg-plaster/95 p-7 shadow-lg shadow-ink/25 sm:p-10">
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
            {section.content.bullets.length > 0 && (
              <LedgerList items={section.content.bullets} className="mt-7" />
            )}
            {(section.content.cta || section.content.secondary_cta) && (
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
                {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
              </div>
            )}
            <ContextLinks links={links} className="mt-6" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
