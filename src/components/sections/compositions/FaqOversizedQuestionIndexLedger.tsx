import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { splitQuestion } from "@/lib/manifest";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { CtaLink } from "@/components/sections/CtaLink";

/**
 * Composition owner: faq-oversized-question-index-ledger.
 * Editorial Q-index ledger: oversized green question numerals against ruled
 * ledger rows, intro column left. Answers are printed with their questions,
 * exactly as the approved frame shows — nothing pretends to expand.
 */
export function FaqOversizedQuestionIndexLedger({
  section,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const rows = section.content.bullets.map(splitQuestion);
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div aria-hidden="true" className="mb-10 h-0.5 w-full bg-action sm:mb-14" />
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[2fr_3fr]">
          <div>
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
            {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} className="mt-7" />}
            <ContextLinks links={links} className="mt-6" />
          </div>
          <dl>
            {rows.map((row, index) => (
              <div
                key={row.question}
                className="grid grid-cols-[64px_1fr] gap-x-5 border-b border-ink/15 py-6 first:border-t sm:grid-cols-[88px_1fr] sm:gap-x-8"
              >
                <dt className="contents">
                  <span aria-hidden="true" className="font-fjalla text-4xl leading-none text-action sm:text-5xl">
                    Q{index + 1}
                  </span>
                  <span className="font-poppins text-base font-semibold leading-snug text-ink sm:text-lg">
                    {row.question}
                  </span>
                </dt>
                <dd className="col-start-2 mt-2 font-fjalla text-[15px] leading-relaxed text-ink/75">
                  {row.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SectionShell>
  );
}
