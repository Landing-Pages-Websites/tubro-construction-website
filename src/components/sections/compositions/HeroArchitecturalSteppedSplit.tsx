import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";

/**
 * Composition owner: hero-architectural-stepped-split.
 * Architectural split hero with a non-50/50 stepped boundary — measured copy
 * field left, stacked project imagery stepping across the boundary right,
 * joined by the dimension-bracket motif. Never a generic centered stack.
 */
export function HeroArchitecturalSteppedSplit({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [primary, secondary] = images;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto grid max-w-7xl items-center gap-x-14 gap-y-10 px-5 sm:px-8 lg:grid-cols-[11fr_9fr]">
        <div>
          <div className="border-l-2 border-action pl-5 sm:pl-7">
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="loud" />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 pl-5 sm:pl-7">
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
          </div>
          <ContextLinks links={links} className="mt-5 pl-5 sm:pl-7" />
        </div>
        {primary && (
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-6 top-8 hidden h-24 w-2.5 border-y-2 border-l-2 border-action lg:block"
            />
            <DesignImage
              image={primary}
              frameClassName="aspect-[4/3] sm:aspect-[16/10]"
              sizes="(min-width: 1024px) 42vw, 100vw"
              priority={isFirst}
              tabPosition="bottom-right"
            />
            {secondary && (
              <div className="mt-4 pb-2 sm:mt-5 lg:-ml-16 lg:w-[88%]">
                <DesignImage
                  image={secondary}
                  frameClassName="aspect-[16/8]"
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  priority={isFirst}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
