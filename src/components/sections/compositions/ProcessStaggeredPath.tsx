import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { splitQuestion } from "@/lib/manifest";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";

/** Progressive card drops matching the approved zig-zag rhythm (01 lowest, 04 highest). */
const CARD_OFFSETS = ["lg:mt-24", "lg:mt-6", "lg:mt-14", "lg:mt-0"];

/** Route vertices sit under each card column of the 1152-wide grid. */
const PATH_POINTS: Array<[number, number]> = [
  [24, 200],
  [429, 100],
  [723, 168],
  [1017, 62],
  [1132, 138],
];
const PATH_D = `M${PATH_POINTS.map(([x, y]) => `${x} ${y}`).join(" L")}`;

function QaLedger({ rows }: { rows: Array<{ question: string; answer: string }> }): ReactElement {
  return (
    <dl className="mt-14 border-t-2 border-action">
      {rows.map((row) => (
        <div key={row.question} className="grid gap-x-10 gap-y-2 border-b border-ink/15 py-5 sm:grid-cols-[2fr_3fr]">
          <dt className="font-poppins text-base font-semibold leading-snug text-ink">{row.question}</dt>
          <dd className="font-fjalla text-[15px] leading-relaxed text-ink/75">{row.answer}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Composition owner: process-staggered-path.
 * Step cards stagger diagonally along one continuous measured route: a green
 * zig-zag polyline with milestone nodes runs beneath the cards on desktop and
 * folds into a straight vertical spine on mobile. Merged FAQ bullets print as
 * a compact ruled Q/A ledger.
 */
export function ProcessStaggeredPath({
  section,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const faqRows = section.source_blueprint_sections.includes("faq")
    ? section.content.bullets.filter((bullet) => bullet.includes("?")).map(splitQuestion)
    : [];
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
        <div className="relative mt-12">
          {/* Mobile fold of the same route: one straight spine, same nodes. */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-0.5 bg-action lg:hidden" />
          <ol className="relative z-10 grid gap-6 lg:grid-cols-4">
            {section.content.steps.map((step, index) => (
              <li key={step.number} className={`relative pl-9 lg:pl-0 ${CARD_OFFSETS[index % CARD_OFFSETS.length]}`}>
                <span aria-hidden="true" className="absolute top-5 left-0 size-4 rounded-full bg-action lg:hidden" />
                <div className="border border-ink/10 bg-white p-6 shadow-md shadow-ink/5">
                  <div className="flex items-baseline gap-3">
                    <span aria-hidden="true" className="font-fjalla text-3xl leading-none text-action">
                      {step.number}
                    </span>
                    <h3 className="font-poppins text-base font-semibold text-ink">{step.title}</h3>
                  </div>
                  <p className="mt-2.5 font-fjalla text-[15px] leading-relaxed text-ink/75">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <svg viewBox="0 0 1152 240" className="-mt-16 hidden w-full lg:block" aria-hidden="true">
            <path d={PATH_D} className="stroke-action" strokeWidth="3" fill="none" />
            {PATH_POINTS.map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="6" className="fill-action" />
            ))}
          </svg>
        </div>
        {faqRows.length > 0 && <QaLedger rows={faqRows} />}
        <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4">
          {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
          {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
          <ContextLinks links={links} />
        </div>
      </div>
    </SectionShell>
  );
}
