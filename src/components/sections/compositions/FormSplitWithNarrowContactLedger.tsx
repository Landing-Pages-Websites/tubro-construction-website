import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { LeadForm } from "@/components/sections/LeadForm";
import { formKeyForSlug } from "@/lib/form-keys";
import { BRAND } from "@/lib/content";

const OFFICE_PHONE = BRAND.phoneDisplay;
const OFFICE_PHONE_HREF = BRAND.phoneHref;
const EMAIL_PATTERN = /[^\s]+@[^\s.,][^\s,]*/;
const RULE_COUNT = 7;
const LINK_CLASSES =
  "underline decoration-action/50 underline-offset-4 transition-colors hover:text-action-deep";

/** Ledger entry text with the office phone or an email address linked inline. */
function LedgerEntry({ text }: { text: string }): ReactElement {
  const token = text.includes(OFFICE_PHONE) ? OFFICE_PHONE : text.match(EMAIL_PATTERN)?.[0];
  if (!token) return <>{text}</>;
  const start = text.indexOf(token);
  const href = token === OFFICE_PHONE ? OFFICE_PHONE_HREF : `mailto:${token}`;
  return (
    <>
      {text.slice(0, start)}
      <a href={href} className={LINK_CLASSES}>
        {token}
      </a>
      {text.slice(start + token.length)}
    </>
  );
}

function LedgerRows({ items }: { items: string[] }): ReactElement {
  return (
    <ul className="mt-9">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 border-b border-ink/20 py-3.5 font-fjalla text-[15px] leading-relaxed text-ink/85"
        >
          <span aria-hidden="true" className="mt-2.5 h-0.5 w-5 shrink-0 bg-action" />
          <span>
            <LedgerEntry text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Ledger-sheet hairlines running the full section width, behind the form card. */
function RuledField(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-24 bottom-20 hidden flex-col justify-between lg:flex"
    >
      {Array.from({ length: RULE_COUNT }, (_, index) => (
        <span key={index} className="h-px w-full bg-ink/10" />
      ))}
    </div>
  );
}

/**
 * Composition owner: form-split-with-narrow-contact-ledger.
 * Narrow ruled contact ledger left, white form card right. The whole section
 * reads as one ledger sheet: hairlines run behind the card and a sage gutter
 * strip separates the columns, per the approved frames.
 */
export function FormSplitWithNarrowContactLedger({
  section,
  band,
  links,
  slug,
  path,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const withResume =
    section.source_blueprint_sections.includes("application-form") ||
    (slug === "careers" && section.name === "application-form");
  const submitLabel = section.content.cta || "Schedule a Free Estimate";
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <RuledField />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Sage gutter strip spans the full sheet height, into the shell padding. */}
        <div aria-hidden="true" className="absolute -top-24 -bottom-24 left-[42%] hidden w-16 bg-sage lg:block" />
        <div className="relative grid items-start gap-y-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-x-24">
          <div>
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="quiet" />
            {section.content.bullets.length > 0 && <LedgerRows items={section.content.bullets} />}
            <ContextLinks links={links} className="mt-9" />
          </div>
          <div className="relative border border-ink/10 bg-white px-6 py-8 shadow-lg shadow-ink/5 sm:px-10 sm:py-10">
            {/* Green datum tick where the card top edge meets the ledger rules. */}
            <span aria-hidden="true" className="absolute -top-0.5 right-0 h-0.5 w-24 bg-action" />
            <LeadForm
              formKey={formKeyForSlug(slug)}
              pagePath={path}
              options={section.content.options}
              submitLabel={submitLabel}
              withResume={withResume}
              idPrefix={section.id}
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
