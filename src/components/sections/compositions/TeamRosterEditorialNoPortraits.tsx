import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";

/** Verified "Name — Role" entry on a green index rule; text stays verbatim. */
function RosterRow({ entry, index }: { entry: string; index: number }): ReactElement {
  const [name, ...rest] = entry.split(" — ");
  const role = rest.join(" — ");
  return (
    <li className="grid grid-cols-[52px_1fr] items-baseline gap-x-4 border-b border-ink/15 py-4 last:border-b-0">
      <span aria-hidden="true" className="font-fjalla text-2xl leading-none text-action">
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className="font-poppins text-base font-semibold leading-snug text-ink">
        {name}
        {role && <span className="font-fjalla text-[15px] font-normal text-ink/70"> — {role}</span>}
      </p>
    </li>
  );
}

/**
 * Composition owner: team-roster-editorial-no-portraits.
 * Typographic roster sheet: intro column against open ledger rules, verified
 * names and roles indexed down a white document panel. No portrait imagery
 * exists for this roster — by design, nothing is invented to fill the gap.
 */
export function TeamRosterEditorialNoPortraits({
  section,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const entries = section.content.items.length > 0 ? section.content.items : section.content.bullets;
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
            {/* Open ledger rules carry the sheet into the roster panel. */}
            <div aria-hidden="true" className="mt-14 hidden space-y-12 lg:block">
              <span className="block h-px bg-ink/15" />
              <span className="block h-px bg-ink/15" />
              <span className="block h-px bg-ink/15" />
            </div>
          </div>
          <div className="relative border border-ink/10 bg-white px-6 py-8 shadow-lg shadow-ink/5 sm:px-10 sm:py-10">
            <span aria-hidden="true" className="absolute top-0 right-0 h-0.5 w-1/2 bg-action" />
            <p className="font-fjalla text-xs tracking-[0.12em] text-action-deep uppercase">Roster</p>
            <ol className="mt-4">
              {entries.map((entry, index) => (
                <RosterRow key={entry} entry={entry} index={index} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
