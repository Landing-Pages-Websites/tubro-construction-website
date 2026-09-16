import type { ReactElement } from "react";
import { House, Trees, Hammer, Ruler, Images, Check } from "lucide-react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { ContextLinks } from "@/components/sections/ContextLinks";

const SCOPE_ICONS = [House, Trees, Hammer, Ruler, Images];

/** Route-owned service overview, with supporting scope details grouped separately. */
export function ResidentialScope({ section, band, links }: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[3fr_2fr] lg:gap-20">
          <h2 id={headingId} className="max-w-[19ch] text-balance font-poppins text-3xl leading-[1.12] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {section.content.headline}
          </h2>
          <div className="max-w-lg">
            <p className="font-poppins text-sm leading-relaxed font-semibold text-action-deep">
              {section.content.eyebrow}
            </p>
            <p className="mt-3 font-fjalla text-lg leading-relaxed text-ink/80">
              {section.content.body}
            </p>
          </div>
        </div>
        <div className="mt-10 grid items-start gap-8 sm:mt-12 lg:grid-cols-[3fr_2fr] lg:gap-20">
          <ul className="border-t border-ink/20">
            {section.content.items.map((item, index) => {
              const Icon = SCOPE_ICONS[index] ?? House;
              return (
                <li key={item} className="flex items-center gap-5 border-b border-ink/15 py-5 sm:gap-6 sm:py-6">
                  <Icon aria-hidden="true" strokeWidth={1.5} className="size-6 shrink-0 text-action-deep" />
                  <h3 className="font-poppins text-lg leading-snug font-semibold tracking-tight text-ink sm:text-xl">{item}</h3>
                </li>
              );
            })}
          </ul>
          <div className="bg-sage px-6 py-8 sm:p-8">
            <h3 className="font-poppins text-xl leading-snug font-semibold tracking-tight text-ink">Residential scope</h3>
            <ul className="mt-6 space-y-5">
              {section.content.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 font-fjalla text-base leading-relaxed text-ink/85">
                  <Check aria-hidden="true" strokeWidth={1.75} className="mt-1 size-4 shrink-0 text-action-deep" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <ContextLinks links={links} className="mt-8 border-t border-ink/15 pt-6" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
