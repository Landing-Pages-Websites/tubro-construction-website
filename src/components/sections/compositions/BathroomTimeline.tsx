import type { ReactElement } from "react";
import { MessageSquareText, Ruler, ClipboardCheck, BadgeCheck } from "lucide-react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { ContextLinks } from "@/components/sections/ContextLinks";

const stepIcons = [MessageSquareText, Ruler, ClipboardCheck, BadgeCheck];

/** Decorative dimension line: fixed geometry, matching the milestone stroke weight. */
function ScopeMeasure(): ReactElement {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 64" fill="none" className="mt-8 h-16 w-full max-w-xs text-action-deep sm:mt-10">
      <path d="M12 12v40M308 12v40M12 32h296M6 38l12-12M302 38l12-12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M49 27v10M86 24v16M123 27v10M197 27v10M234 24v16M271 27v10" stroke="currentColor" strokeOpacity=".45" />
      <path d="m160 24 8 8-8 8-8-8Z" fill="var(--color-sage)" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function BathroomTimeline({ section, band, links, isFirst }: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const Heading = isFirst ? "h1" : "h2";
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:gap-14 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
        <div className="lg:pt-5">
          <Heading id={headingId} className="max-w-lg text-[34px] leading-[1.15] font-semibold tracking-tight text-balance sm:text-[44px] lg:text-[48px]">
            A better bathroom starts with <span className="text-action-deep">clearer scope.</span>
          </Heading>
          <p className="mt-6 max-w-md text-base leading-7 text-ink/75">{section.content.body}</p>
          <ScopeMeasure />
          <ContextLinks links={links} className="mt-5" />
        </div>

        <ol>
          {section.content.steps.map((step, index, steps) => {
            const Icon = stepIcons[index % stepIcons.length];
            const isLast = index === steps.length - 1;
            return (
              <li key={step.number} className={`relative grid grid-cols-[48px_1fr] gap-x-5 sm:grid-cols-[56px_1fr] sm:gap-x-8 ${isLast ? "" : "pb-8 sm:pb-10"}`}>
                {!isLast && <span aria-hidden="true" className="absolute top-12 bottom-0 left-[23px] w-px bg-action-deep/35 sm:top-14 sm:left-[27px]" />}
                <div className="relative flex size-12 items-center justify-center sm:size-14">
                  <svg aria-hidden="true" viewBox="0 0 56 56" className="absolute inset-0 size-full text-action-deep" fill="none">
                    <circle cx="28" cy="28" r="26.5" stroke="currentColor" strokeWidth="1.5" fill={isLast ? "var(--color-action-deep)" : "var(--color-sage)"} />
                    <path d="M28 0v5M28 51v5M0 28h5M51 28h5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span aria-hidden="true" className={`relative text-base font-semibold tabular-nums ${isLast ? "text-white" : "text-action-deep"}`}>{step.number}</span>
                </div>
                <div className={`min-w-0 pt-2 sm:pt-3 ${isLast ? "" : "border-b border-action-deep/20 pb-7 sm:pb-8"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl leading-7 font-semibold tracking-tight sm:text-2xl">{step.title}</h3>
                    <Icon aria-hidden="true" className="size-6 shrink-0 text-action-deep" strokeWidth={1.5} />
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-6 text-ink/75 sm:text-base sm:leading-7">{step.copy}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionShell>
  );
}
