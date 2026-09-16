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
 * Composition owner: hero-typographic-manifesto-proof-rail.
 * Oversized typographic manifesto left; narrow vertical rail of authentic
 * proof photos hugging the right edge over a sage strip. A green ledger rule
 * opens the frame and hairlines tie the rail back to the copy field.
 */
export function HeroTypographicManifestoProofRail({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      {/* Sage strip behind the proof rail, running the full section height. */}
      <span aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-20 bg-sage lg:block xl:w-28" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <span aria-hidden="true" className="block h-0.5 bg-action" />
        <div className="mt-8 grid gap-x-16 gap-y-14 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="loud" />
            {section.content.bullets.length > 0 && (
              <LedgerList items={section.content.bullets} className="mt-7 max-w-xl" />
            )}
            <span aria-hidden="true" className="mt-9 block h-px max-w-xl bg-ink/15" />
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
              {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
            </div>
            <ContextLinks links={links} className="mt-5" />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:-mr-8 lg:grid-cols-1 lg:gap-12">
            {images.slice(0, 3).map((image) => (
              <div key={image.src} className="relative">
                {/* Hairline reaching back across the gutter to the copy field. */}
                <span aria-hidden="true" className="absolute -left-16 top-6 hidden w-16 border-t border-ink/15 lg:block" />
                <DesignImage
                  image={image}
                  frameClassName="aspect-[4/3]"
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 100vw"
                  priority={isFirst}
                  withTab={false}
                />
                {image.label && (
                  <CaptionTab label={image.label} position="bottom-right" className="translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
