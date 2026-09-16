import type { ReactElement } from "react";
import type { SectionProps } from "./types";
import { SectionShell } from "./SectionShell";
import { SectionIntro } from "./SectionIntro";
import { DesignImage } from "./DesignImage";
import { CtaLink } from "./CtaLink";
import { PhoneCta } from "./PhoneCta";
import { ContextLinks } from "./ContextLinks";
import { PaintingHeroFrame } from "./PaintingHeroFrame";
import { PaintingToolDetail } from "./PaintingToolDetail";

/** Painting-specific framing keeps the house and its finish visible beside the copy. */
export function PaintingHero({ section, images, band, links, ctaTarget, isFirst }: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [lead, ...details] = images;
  return (
    <SectionShell section={section} band={band} bleed labelledBy={headingId}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-14 lg:py-16">
        <div>
          <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="loud" className="[&_h1]:max-w-[12ch] [&_p]:max-w-[40ch]" />
          <div className="mt-8 flex flex-col items-start gap-5">
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
          </div>
          <ContextLinks links={links} className="mt-6" />
          <PaintingToolDetail />
        </div>
        <div data-painting-photo className="relative mt-6 min-w-0 sm:mt-8">
          <PaintingHeroFrame />
          {lead && <DesignImage image={lead} frameClassName="aspect-[4/3]" sizes="(min-width: 1280px) 675px, (min-width: 1024px) 55vw, 100vw" priority={isFirst} objectPosition="50% 46%" />}
          <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4">
            {details.slice(0, 2).map((photo) => <DesignImage key={photo.src} image={photo} frameClassName="aspect-[2/1]" sizes="(min-width: 1280px) 330px, (min-width: 1024px) 27vw, 50vw" />)}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
