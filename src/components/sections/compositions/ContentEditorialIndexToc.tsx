import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";

/** Ruled-paper hairlines that finish the editorial column, per the frames. */
const TRAILING_RULE_COUNT = 3;

/**
 * Composition owner: content-editorial-index-toc.
 * Editorial table-of-contents: a ruled intro column under a green datum rule,
 * beside a white index card of numbered rows. items drive the index (bullets
 * when items are empty); bullets otherwise print as the supporting ruled
 * ledger. The occasional shared-evidence photo docks under the ledger.
 */
export function ContentEditorialIndexToc({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const { items, bullets } = section.content;
  const indexRows = items.length > 0 ? items : bullets;
  const ledgerRows = items.length > 0 ? bullets : [];
  const [evidence] = images;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[10fr_9fr]">
          <div>
            <span aria-hidden="true" className="mb-8 block h-0.5 w-full bg-action" />
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
            {ledgerRows.length > 0 && (
              <ul className="mt-9">
                {ledgerRows.map((row) => (
                  <li
                    key={row}
                    className="flex gap-3 border-b border-ink/15 py-3.5 font-fjalla text-[15px] leading-relaxed text-ink/85"
                  >
                    <span aria-hidden="true" className="mt-2.5 h-0.5 w-5 shrink-0 bg-action" />
                    {row}
                  </li>
                ))}
              </ul>
            )}
            <div aria-hidden="true" className="hidden lg:block">
              {Array.from({ length: TRAILING_RULE_COUNT }, (_, index) => (
                <div key={index} className="h-12 border-b border-ink/15" />
              ))}
            </div>
            {evidence && (
              <DesignImage
                image={evidence}
                frameClassName="mt-9 aspect-[16/9] max-w-sm"
                sizes="(min-width: 640px) 384px, 90vw"
              />
            )}
            {(section.content.cta || section.content.secondary_cta) && (
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
                {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
              </div>
            )}
            <ContextLinks links={links} className="mt-8" />
          </div>
          <div className="self-start border border-ink/10 bg-white p-6 shadow-md shadow-ink/5 sm:p-9">
            <p className="font-fjalla text-xs tracking-[0.12em] uppercase text-action-deep">
              Section index
            </p>
            <ol className="mt-4">
              {indexRows.map((row, index) => (
                <li
                  key={row}
                  className="grid grid-cols-[48px_1fr] items-baseline gap-4 border-b border-ink/15 py-4"
                >
                  <span aria-hidden="true" className="font-fjalla text-2xl leading-none text-action">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-poppins text-base font-semibold text-ink">{row}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
