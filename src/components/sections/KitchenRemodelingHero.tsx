import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";
import { CropCorners } from "@/components/sections/CropCorners";

/** Kitchen-specific proportions keep the room photograph and estimate in focus. */
export function KitchenRemodelingHero({ section, images, band, links, ctaTarget, isFirst }: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [primary, secondary] = images;
  return (
    <SectionShell section={section} band={band} bleed labelledBy={headingId}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 sm:gap-12 sm:px-8 sm:py-14 lg:grid-cols-[5fr_6fr] lg:gap-12 lg:py-16 xl:gap-16">
        <div className="min-w-0">
          <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="loud"
            className="[&_h1]:max-w-[11ch] sm:[&_h1]:max-w-[18ch] lg:[&_h1]:max-w-[11ch] [&_h1]:text-[clamp(2.5rem,4vw,3.75rem)] [&_h1]:leading-[1.08] [&_h1]:text-balance [&>p:last-child]:max-w-[38ch] sm:[&>p:last-child]:max-w-xl lg:[&>p:last-child]:max-w-[38ch]" />
          <div className="mt-7 flex flex-col items-start gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-start lg:gap-4">
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
          </div>
          <ContextLinks links={links} className="mt-4" />
        </div>
        {primary && (
          <div className="relative min-w-0 pb-12 sm:pb-16">
            <div className="relative ml-6 sm:ml-10">
              <CropCorners corners={["tl", "tr"]} className="-m-2 sm:-m-3" />
              <DesignImage image={primary} frameClassName="aspect-[4/3] lg:aspect-[6/5]" sizes="(min-width: 1280px) 584px, (min-width: 1024px) 48vw, (min-width: 640px) 85vw, 90vw" priority={isFirst} tabPosition="top-left" objectPosition="50% 60%" />
            </div>
            {secondary && (
              <div className="absolute bottom-0 left-0 w-[48%] border-r-[6px] border-t-[6px] border-plaster sm:w-[46%] sm:border-r-8 sm:border-t-8">
                <DesignImage image={secondary} frameClassName="aspect-[4/3]" sizes="(min-width: 1280px) 280px, (min-width: 1024px) 24vw, 44vw" priority={isFirst} objectPosition="50% 65%" />
              </div>
            )}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
