import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { CtaLink } from "@/components/sections/CtaLink";

/**
 * Composition owner: process-compact-numbered-strip.
 * Compact numbered process strip: white step cards staggered above and below
 * a continuous green process route, per the approved frame.
 */
export function ProcessCompactNumberedStrip({
  section,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
        <div className="relative mt-12 lg:mt-16">
          {/* The measured process route: one continuous line behind the cards. */}
          <span
            aria-hidden="true"
            className="absolute left-2.5 top-0 h-full w-0.5 bg-action lg:left-0 lg:top-1/2 lg:h-0.5 lg:w-full"
          />
          <ol className="relative grid gap-6 pl-10 lg:grid-cols-4 lg:gap-5 lg:pl-0">
            {section.content.steps.map((step, index) => (
              <li
                key={step.number}
                className={`border border-ink/10 bg-white p-6 shadow-md shadow-ink/5 ${
                  index % 2 === 0 ? "lg:-translate-y-6" : "lg:translate-y-6"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="font-fjalla text-4xl leading-none text-action">
                    {step.number}
                  </span>
                  <h3 className="font-poppins text-base font-semibold text-ink">{step.title}</h3>
                </div>
                <p className="mt-3 font-fjalla text-[15px] leading-relaxed text-ink/75">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-14 flex flex-wrap items-center gap-x-7 gap-y-4 lg:mt-16">
          {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
          <ContextLinks links={links} />
        </div>
      </div>
    </SectionShell>
  );
}
