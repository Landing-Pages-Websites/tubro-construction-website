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

/**
 * Composition owner: cta-centered-estimate-brief-peripheral-proof.
 * Centered estimate brief on a white sheet with authentic project proof
 * pinned at opposite page corners under measured crop marks.
 */
export function CtaCenteredEstimateBriefPeripheralProof({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
  slug,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [first, second] = images;
  const portraitProof = slug === "kitchen-remodeling";
  // Cover crops need enough source pixels for the full height, not just slot width.
  const proofSizes = portraitProof ? "720px" : "176px";
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {first && (
          <div className={`absolute left-8 top-0 hidden xl:block ${portraitProof ? "bottom-0 w-60" : "w-44"}`}>
            <CropCorners corners={["tl", "bl"]} className="-m-3" />
            <DesignImage image={first} frameClassName={portraitProof ? "h-full" : "aspect-[4/3]"} sizes={proofSizes} objectPosition={portraitProof ? "35% center" : undefined} />
          </div>
        )}
        {second && (
          <div className={`absolute bottom-0 right-8 hidden xl:block ${portraitProof ? "top-0 w-60" : "w-44"}`}>
            <CropCorners corners={["tr", "br"]} className="-m-3" />
            <DesignImage image={second} frameClassName={portraitProof ? "h-full" : "aspect-[4/3]"} sizes={proofSizes} />
          </div>
        )}
        <div className="mx-auto max-w-2xl border border-ink/10 bg-white px-6 py-10 shadow-lg shadow-ink/5 sm:px-12 sm:py-14">
          <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="quiet" />
          {section.content.bullets.length > 0 && (
            <LedgerList items={section.content.bullets} className="mt-7" />
          )}
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
          </div>
          <ContextLinks links={links} className="mt-6" />
        </div>
        {images.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 xl:hidden">
            {images.slice(0, 2).map((image) => (
              <DesignImage key={image.src} image={image} frameClassName={portraitProof ? "aspect-[3/4]" : "aspect-[4/3]"} sizes={portraitProof ? "80vw" : "50vw"} objectPosition={portraitProof && image === first ? "35% center" : undefined} />
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
