import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { BRAND } from "@/lib/content";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";

/** Phone facts dial, email facts mail, plain facts stay static text. */
function contactHref(fact: string): string | null {
  if (fact.includes(BRAND.phoneDisplay)) return BRAND.phoneHref;
  const email = fact.split(/\s+/).find((word) => word.includes("@"));
  return email ? `mailto:${email}` : null;
}

/**
 * Composition owner: hero-contact-ledger.
 * No imagery: headline and body left against open ruled space; the contact
 * facts sit right in a white ledger card whose hairline rows run past the
 * content, per the approved frame. Phone/email facts are live links.
 */
export function HeroContactLedger({
  section,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const facts = section.content.items.length > 0 ? section.content.items : section.content.bullets;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Ledger-rule motif: opening rule with a short closing dash. */}
        <div aria-hidden="true" className="flex items-center justify-between gap-6">
          <span className="h-0.5 w-full max-w-xl bg-action" />
          <span className="h-0.5 w-10 shrink-0 bg-action" />
        </div>
        <div className="mt-8 grid items-start gap-x-16 gap-y-10 lg:mt-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
            {(section.content.cta || section.content.secondary_cta) && (
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
                {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
              </div>
            )}
            <ContextLinks links={links} className="mt-6" />
            {/* Empty ledger rules carry the ruled field through the open space. */}
            <div aria-hidden="true" className="mt-16 hidden space-y-14 lg:block">
              <span className="block h-px bg-ink/15" />
              <span className="block h-px bg-ink/15" />
            </div>
          </div>
          <ul className="border border-ink/10 bg-white px-7 pb-14 shadow-md shadow-ink/5 sm:px-9">
            {facts.map((fact) => {
              const href = contactHref(fact);
              return (
                <li key={fact} className="flex items-center gap-4 border-b border-ink/15 py-5">
                  <span aria-hidden="true" className="h-0.5 w-5 shrink-0 bg-action" />
                  {href ? (
                    <a
                      href={href}
                      className="break-all font-fjalla text-lg leading-relaxed text-ink transition-colors hover:text-action-deep"
                    >
                      {fact}
                    </a>
                  ) : (
                    <span className="font-fjalla text-lg leading-relaxed text-ink">{fact}</span>
                  )}
                </li>
              );
            })}
            {/* The ruled card runs one empty row past its facts, per the frame. */}
            <li aria-hidden="true" className="h-14 border-b border-ink/15" />
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
