import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";

/**
 * Composition owner: policy-editorial-document.
 * Quiet editorial document: intro column over open ledger rules beside a
 * white policy sheet listing the approved section headings on ruled index
 * rows. Only the manifest's disclosure content is rendered — the approved
 * policy body text is not in inventory, so no legal language is invented.
 */
export function PolicyEditorialDocument({
  section,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const headings = section.content.bullets.length > 0 ? section.content.bullets : section.content.items;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[4fr_5fr]">
          <div>
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
            {(section.content.cta || section.content.secondary_cta) && (
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
                {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
              </div>
            )}
            <ContextLinks links={links} className="mt-6" />
            {/* Open ledger rules mark space held for the approved policy body. */}
            <div aria-hidden="true" className="mt-14 hidden space-y-12 lg:block">
              <span className="block h-px bg-ink/15" />
              <span className="block h-px bg-ink/15" />
              <span className="block h-px bg-ink/15" />
            </div>
          </div>
          <div className="relative border border-ink/10 bg-white px-6 py-8 shadow-lg shadow-ink/5 sm:px-10 sm:py-10">
            <span aria-hidden="true" className="absolute top-0 right-0 h-0.5 w-1/2 bg-action" />
            <p className="font-fjalla text-xs tracking-[0.12em] text-action-deep uppercase">Policy sections</p>
            <ol className="mt-4">
              {headings.map((heading, index) => (
                <li
                  key={heading}
                  className="grid grid-cols-[52px_1fr] items-baseline gap-x-4 border-b border-ink/15 py-5 last:border-b-0"
                >
                  <span aria-hidden="true" className="font-fjalla text-2xl leading-none text-action">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-poppins text-base font-semibold leading-snug text-ink">{heading}</h3>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
