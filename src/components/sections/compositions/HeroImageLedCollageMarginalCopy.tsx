import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";
import { CropCorners } from "@/components/sections/CropCorners";

/**
 * Composition owner: hero-image-led-collage-marginal-copy.
 * The authentic photo collage dominates: a lead photo with two satellites in
 * a stepped, overlapping cluster under crop marks. Copy is compressed into a
 * margin column against a green rule. Copy leads the DOM for the H1/fold.
 */
export function HeroImageLedCollageMarginalCopy({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [lead, upper, lower] = images;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto grid max-w-7xl gap-y-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-x-14">
        <div className="lg:order-last lg:border-l-2 lg:border-action lg:pl-8 xl:pl-10">
          <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="quiet" />
          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 lg:flex-col lg:items-start">
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
          </div>
          <ContextLinks links={links} className="mt-5" />
        </div>
        <div className="grid grid-cols-12 gap-x-4 pb-4 sm:gap-x-6">
          {lead && (
            <div className="relative col-span-11 row-start-1 sm:col-span-7 sm:col-start-1 sm:row-start-1 sm:row-span-2 sm:mt-10">
              <CropCorners corners={["tl", "bl"]} className="-m-2.5 sm:-m-3" />
              <DesignImage
                image={lead}
                frameClassName="aspect-[5/4] sm:aspect-[4/5] lg:aspect-[5/6]"
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 55vw, 92vw"
                priority={isFirst}
              />
            </div>
          )}
          {upper && (
            <div className="relative z-10 col-span-7 col-start-6 row-start-2 -mt-5 sm:col-span-5 sm:col-start-8 sm:row-start-1 sm:mt-0">
              <DesignImage
                image={upper}
                frameClassName="aspect-[4/3]"
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 38vw, 58vw"
                priority={isFirst}
                tabPosition="top-left"
              />
            </div>
          )}
          {lower && (
            <div className="relative z-10 col-span-8 col-start-2 row-start-3 -mt-4 sm:col-span-5 sm:col-start-7 sm:row-start-2 sm:mt-8 sm:-ml-8">
              <DesignImage
                image={lower}
                frameClassName="aspect-[16/10]"
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 38vw, 66vw"
                priority={isFirst}
              />
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
