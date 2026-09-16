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
 * Composition owner: gallery-room-scale-single-focal-detail-strip.
 * One oversized room-scale focal photograph (~2/3 width) beside a narrow
 * plaster copy column under the crop-mark motif, with the remaining photos
 * as a tab-labeled detail strip. Works from one photo (no strip) up to five.
 */
export function GalleryRoomScaleSingleFocalDetailStrip({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [focal, ...details] = images;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[13fr_7fr]">
          {focal && (
            <DesignImage
              image={focal}
              frameClassName="aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[440px]"
              sizes="(min-width: 1024px) 62vw, 100vw"
              priority={isFirst}
            />
          )}
          <div className="relative border border-ink/10 bg-plaster p-7 sm:p-9">
            <CropCorners corners={["tr", "br"]} className="-m-2" />
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
        {details.length > 0 && (
          <div className="relative mt-6">
            <CropCorners corners={["bl"]} className="-m-2" />
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {details.map((image) => (
                <li key={image.src}>
                  <DesignImage
                    image={image}
                    frameClassName="aspect-[16/10]"
                    sizes="(min-width: 640px) 24vw, 45vw"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
