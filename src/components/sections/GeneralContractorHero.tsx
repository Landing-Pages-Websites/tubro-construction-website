import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";

function HeroRuler({ vertical = false }: { vertical?: boolean }): ReactElement {
  return (
    <svg
      viewBox={vertical ? "0 0 28 320" : "0 0 320 28"}
      data-gc-ruler={vertical ? "vertical" : "horizontal"}
      aria-hidden="true"
      focusable="false"
      className={vertical
        ? "pointer-events-none absolute top-1/2 right-3 z-10 hidden h-80 w-7 -translate-y-1/2 bg-plaster/95 text-action sm:block"
        : "pointer-events-none mt-7 block h-auto w-full text-action"}
    >
      <g transform={vertical ? "translate(28 0) rotate(90)" : undefined}>
        <path d="M0 27H320M0 0H320" fill="none" stroke="currentColor" />
        {Array.from({ length: 41 }, (_, tick) => (
          <path
            key={tick}
            d={`M${tick * 8} 0v${tick % 4 === 0 ? 12 : 6}`}
            fill="none"
            stroke="currentColor"
          />
        ))}
        {Array.from({ length: 9 }, (_, unit) => (
          <text key={unit} x={(unit + 1) * 32} y="23" textAnchor="middle" fontSize="9" fill="currentColor" className="font-fjalla">
            {unit + 1}
          </text>
        ))}
      </g>
    </svg>
  );
}

function DraftingBackground(): ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[#f1f3e9]">
      <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" focusable="false" className="absolute inset-0 h-full w-full text-action">
        <defs>
          <pattern id="gc-drafting-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeOpacity="0.055" />
          </pattern>
        </defs>
        <rect width="1440" height="800" fill="url(#gc-drafting-grid)" />
        <g fill="none" stroke="currentColor">
          <path d="M990-80V142H1480M1100-80V250H1480M860 800V650H1440" strokeWidth="24" opacity="0.035" />
          <path d="M1030-80V182H1480M1060-80V212H1480M900 800V690H1440" strokeWidth="1" opacity="0.16" />
          <path d="M38 44H1402M38 28V60M1402 28V60M38 44V750M22 750H54" opacity="0.4" />
          {Array.from({ length: 69 }, (_, tick) => (
            <path key={tick} d={`M${40 + tick * 20} 44v${tick % 5 === 0 ? 18 : 7}`} opacity={tick % 5 === 0 ? "0.35" : "0.18"} />
          ))}
          {Array.from({ length: 35 }, (_, tick) => (
            <path key={tick} d={`M38 ${64 + tick * 20}h${tick % 5 === 0 ? 18 : 7}`} opacity="0.25" />
          ))}
          <g transform="translate(1310 695)" opacity="0.22">
            <circle r="68" />
            <circle r="52" strokeDasharray="2 7" />
            <path d="M-88 0H88M0-88V88M-8-8L8 8M-8 8L8-8" />
          </g>
          <path d="M70 730H590M70 720V740M590 720V740M65 735L75 725M585 735L595 725" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
}

/** Route-owned hero keeps the project photograph clear of the copy. */
export function GeneralContractorHero({ section, images, band, links, ctaTarget }: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [photo] = images;
  return (
    <SectionShell section={section} band={band} bleed labelledBy={headingId}>
      <DraftingBackground />
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-14 lg:py-20">
        <div className="grid items-center gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <div>
            <h1 id={headingId} className="max-w-xl text-balance font-poppins text-[clamp(2.5rem,4.2vw,3.75rem)] font-bold leading-[1.08] tracking-[-0.035em] text-ink">{section.content.headline}</h1>
            <p className="mt-6 max-w-md font-poppins text-base leading-relaxed text-ink/80 sm:text-lg">{section.content.body}</p>
            <div className="max-w-md"><HeroRuler /></div>
            <div className="mt-8 flex flex-col items-start gap-3">
              {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
              {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
            </div>
            <ContextLinks links={links} className="mt-5" />
          </div>
          {photo && <figure className="relative min-w-0 border-b-2 border-action pb-4">
            <HeroRuler vertical />
            <DesignImage image={photo} frameClassName="aspect-[4/3] [clip-path:polygon(0_10%,12%_10%,12%_0,100%_0,100%_84%,88%_84%,88%_100%,0_100%)] lg:aspect-[6/5] lg:[clip-path:polygon(0_14%,14%_14%,14%_0,100%_0,100%_82%,86%_82%,86%_100%,0_100%)]" sizes="(min-width: 1280px) 610px, (min-width: 1024px) 50vw, 100vw" priority withTab={false} objectPosition="52% 48%" />
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 font-fjalla text-sm text-ink/75"><span>{photo.label}</span><span>Tubro Construction</span></figcaption>
          </figure>}
        </div>
        <p className="mt-9 border-t border-ink/15 pt-5 font-fjalla text-base text-ink/75 sm:mt-12">{section.content.eyebrow}</p>
      </div>
    </SectionShell>
  );
}
