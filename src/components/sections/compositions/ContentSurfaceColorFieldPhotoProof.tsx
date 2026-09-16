import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { LedgerList } from "@/components/sections/LedgerList";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";

/**
 * Composition owner: content-surface-color-field-photo-proof.
 * Surface grammar: a plaster field over the white band with a sage backing
 * panel, copy column left, and staggered photo proof crossing the field seam.
 * The manifest bullets carry no clean interior/exterior split, so they print
 * as one ledger, exactly as the approved frame shows.
 */
export function ContentSurfaceColorFieldPhotoProof({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [first, second, third] = images;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      {/* Upper color field; the band supplies the lower field. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[55%] bg-plaster" />
      <div className="relative mx-auto grid max-w-7xl gap-x-16 gap-y-12 px-5 sm:px-8 lg:grid-cols-[8fr_9fr]">
        <div>
          <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
          {section.content.bullets.length > 0 && (
            <LedgerList items={section.content.bullets} className="mt-8" />
          )}
          {(section.content.cta || section.content.secondary_cta) && (
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
              {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
            </div>
          )}
          <ContextLinks links={links} className="mt-7" />
        </div>
        <div className="grid grid-cols-2 items-start gap-x-6">
          {first && (
            <DesignImage
              image={first}
              frameClassName="aspect-[4/3] shadow-md shadow-ink/10"
              sizes="(min-width: 1024px) 26vw, 45vw"
            />
          )}
          {second && (
            <div className="relative mt-14">
              {/* Sage color field backing the second proof photo. */}
              <span aria-hidden="true" className="absolute -inset-4 bg-sage sm:-inset-5" />
              <div className="relative">
                <DesignImage
                  image={second}
                  frameClassName="aspect-[4/3] shadow-md shadow-ink/10"
                  sizes="(min-width: 1024px) 26vw, 45vw"
                />
              </div>
            </div>
          )}
          {third && (
            <div className="col-span-2 mx-auto mt-8 w-3/4 sm:w-3/5">
              <DesignImage
                image={third}
                frameClassName="aspect-[4/3] shadow-md shadow-ink/10"
                sizes="(min-width: 1024px) 22vw, 70vw"
              />
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
