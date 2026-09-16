import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import type { ManifestStep, SectionContent } from "@/lib/manifest";
import { splitQuestion } from "@/lib/manifest";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { LedgerList } from "@/components/sections/LedgerList";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";
import { BathroomTimeline } from "@/components/sections/compositions/BathroomTimeline";

const TAPE_TICKS = Array.from(
  { length: 21 },
  (_, tick) => `M${6 + tick * 8} 1v${tick % 4 === 0 ? 12 : 7}`,
).join("");

/** Tape-measure accent pinned beside milestone 01, per the approved frames. */
function RulerTape(): ReactElement {
  return (
    <svg viewBox="0 0 172 34" className="w-40" aria-hidden="true">
      <rect x="0.5" y="0.5" width="171" height="33" fill="#F6EEDD" stroke="#0C883D" />
      <path d={TAPE_TICKS} stroke="#0C883D" strokeWidth="1.5" fill="none" />
      {[1, 2, 3, 4, 5].map((unit) => (
        <text key={unit} x={6 + unit * 32} y="28" textAnchor="middle" fontSize="10" className="fill-ink font-fjalla">
          {unit}
        </text>
      ))}
    </svg>
  );
}

/** City local-guidance pages carry checklist labels instead of steps. */
function milestoneEntries(content: SectionContent): ManifestStep[] {
  if (content.steps.length > 0) return content.steps;
  const labels = content.items.length > 0 ? content.items : content.bullets;
  return labels.map((title, index) => ({
    number: String(index + 1).padStart(2, "0"),
    title,
    copy: "",
  }));
}

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
 * Composition owner: process-vertical-milestone-spine.
 * One continuous vertical green spine with milestone nodes; step panels hang
 * off the spine at alternating indents in alternating paper tones — never
 * four equal columns. Merged FAQ bullets print as a compact ruled Q/A ledger.
 */
export function ProcessVerticalMilestoneSpine({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
  ...page
}: SectionProps): ReactElement {
  if (page.slug === "bathroom-remodeling" && section.name === "process-faq") {
    return <BathroomTimeline {...page} section={section} images={images} band={band} links={links} ctaTarget={ctaTarget} isFirst={isFirst} />;
  }
  const headingId = `${section.id}-heading`;
  const steps = milestoneEntries(section.content);
  const bulletsAreSteps = section.content.steps.length === 0 && section.content.items.length === 0;
  const faqRows = section.source_blueprint_sections.includes("faq")
    ? section.content.bullets.filter((bullet) => bullet.includes("?")).map(splitQuestion)
    : [];
  const introBullets = bulletsAreSteps || faqRows.length > 0 ? [] : section.content.bullets;
  const [photo] = images;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[2fr_3fr]">
          <div>
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
            {introBullets.length > 0 && <LedgerList items={introBullets} className="mt-7" />}
            {(section.content.cta || section.content.secondary_cta) && (
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
                {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
              </div>
            )}
            <ContextLinks links={links} className="mt-6" />
            {photo && (
              <div className="mt-10 lg:max-w-md">
                <DesignImage image={photo} frameClassName="aspect-[16/9]" sizes="(min-width: 1024px) 28vw, 100vw" />
              </div>
            )}
          </div>
          <div className="relative">
            <div className="absolute -top-2 right-0 hidden xl:block">
              <RulerTape />
            </div>
            {/* The milestone spine: one continuous line, nodes only at milestones. */}
            <span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-0.5 bg-action" />
            <ol className="space-y-6 py-2">
              {steps.map((step, index) => (
                <li key={step.number} className="relative pl-9 sm:pl-12">
                  <span aria-hidden="true" className="absolute top-5 left-0 size-4 rounded-full bg-action" />
                  <div
                    className={`border border-ink/10 p-5 shadow-md shadow-ink/5 sm:max-w-md sm:p-6 ${
                      index % 2 === 1 ? "bg-white sm:ml-14 lg:ml-24" : "bg-plaster"
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span aria-hidden="true" className="font-fjalla text-3xl leading-none text-action">
                        {step.number}
                      </span>
                      <h3 className="font-poppins text-base font-semibold text-ink">{step.title}</h3>
                    </div>
                    {step.copy && (
                      <p className="mt-2.5 font-fjalla text-[15px] leading-relaxed text-ink/75">{step.copy}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        {faqRows.length > 0 && <QaLedger rows={faqRows} />}
      </div>
    </SectionShell>
  );
}
