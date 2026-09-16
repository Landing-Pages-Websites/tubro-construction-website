import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";

const DATUM_TICKS = 7;
/* Outer polygon is a green field; the photo is clipped a sliver tighter so a
   measured green edge survives along the diagonal seam only. */
const DESKTOP_FIELD = "[clip-path:polygon(0_0,100%_0,100%_100%,14%_100%)]";
const DESKTOP_PHOTO = "[clip-path:polygon(0.5%_0,100%_0,100%_100%,14.5%_100%)]";
const MOBILE_FIELD = "[clip-path:polygon(0_0,100%_9%,100%_100%,0_100%)]";
const MOBILE_PHOTO = "[clip-path:polygon(0_1.5%,100%_10.2%,100%_100%,0_100%)]";

/**
 * Composition owner: hero-diagonal-cropped-service-area.
 * Plaster copy field left; the photo is cropped along a diagonal edge that
 * reaches the right viewport edge. A ticked green datum rule (the
 * directory-coordinate motif) runs the top; a sage strip closes the frame
 * with the call option.
 */
export function HeroDiagonalCroppedServiceArea({
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
      <div aria-hidden="true" className="px-5 pt-6 sm:px-8">
        <span className="block h-0.5 bg-action" />
        <div className="flex justify-between px-[8%]">
          {Array.from({ length: DATUM_TICKS }, (_, index) => (
            <span key={index} className="h-2 w-0.5 bg-action" />
          ))}
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-[minmax(0,44%)_1fr]">
        <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:mx-0 lg:max-w-none lg:py-16 lg:pr-12 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="loud" />
          {section.content.cta && (
            <CtaLink label={section.content.cta} href={ctaTarget} className="mt-8" />
          )}
          <ContextLinks links={links} className="mt-6" />
        </div>
        {photo && (
          <div className="relative px-5 pb-10 sm:px-8 lg:min-h-[460px] lg:p-0">
            <div className={`absolute inset-0 hidden bg-action lg:block ${DESKTOP_FIELD}`}>
              <div className={`absolute inset-0 ${DESKTOP_PHOTO}`}>
                <DesignImage
                  image={photo}
                  frameClassName="h-full w-full"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  priority={isFirst}
                  tabPosition="bottom-right"
                />
              </div>
            </div>
            <div className={`bg-action lg:hidden ${MOBILE_FIELD}`}>
              <div className={MOBILE_PHOTO}>
                <DesignImage
                  image={photo}
                  frameClassName="aspect-[4/3]"
                  sizes="100vw"
                  priority={isFirst}
                  tabPosition="bottom-right"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {section.content.secondary_cta && (
        <div className="border-t border-ink/15 bg-sage">
          <div className="mx-auto flex max-w-7xl items-center px-5 py-2.5 sm:px-8">
            <PhoneCta label={section.content.secondary_cta} />
          </div>
        </div>
      )}
    </SectionShell>
  );
}
