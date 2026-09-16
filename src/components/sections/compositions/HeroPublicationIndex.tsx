import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";

/**
 * Composition owner: hero-publication-index.
 * Masthead-style headline sheet left; the approved topic titles print right
 * as a numbered editorial index with leader lines. The entries are approved
 * topics, not routes — they render as static ledger text, never fake links.
 */
export function HeroPublicationIndex({
  section,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto grid max-w-7xl items-start gap-y-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-x-16">
        <div className="border border-ink/10 bg-white px-7 py-10 shadow-md shadow-ink/5 sm:px-10 sm:py-12">
          <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="quiet" />
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
            {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
          </div>
          <ContextLinks links={links} className="mt-6" />
        </div>
        <div className="border border-ink/10 bg-white px-6 pb-10 shadow-md shadow-ink/5 sm:px-8">
          <span aria-hidden="true" className="block h-0.5 bg-action" />
          <p className="mt-5 font-fjalla text-xs uppercase tracking-[0.12em] text-action-deep">Index</p>
          <ol className="mt-4">
            {section.content.items.map((item, index) => (
              <li key={item} className="flex items-center gap-4 border-t border-ink/15 py-6 sm:gap-5">
                <span aria-hidden="true" className="font-fjalla text-3xl leading-none text-action sm:text-4xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="h-px w-5 shrink-0 bg-ink/25" />
                <span className="font-poppins text-base font-semibold text-ink sm:text-lg">{item}</span>
                <span aria-hidden="true" className="h-px min-w-5 flex-1 bg-ink/15" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
}
