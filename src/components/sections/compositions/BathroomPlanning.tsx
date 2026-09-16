import type { ReactElement } from "react";
import { Check, ShowerHead, SlidersHorizontal, Layers } from "lucide-react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { DesignImage } from "@/components/sections/DesignImage";
import { ContextLinks } from "@/components/sections/ContextLinks";

const details = [
  { title: "Showers & conversions", copy: "Walk-in shower, tub conversion, or full renovation? Start with how you want to use the space.", icon: ShowerHead },
  { title: "Fixtures & storage", copy: "Bring your fixture and storage priorities into the same planning conversation.", icon: SlidersHorizontal },
  { title: "Materials & finishes", copy: "Connect your finish choices with performance needs and budget expectations.", icon: Layers },
];

export function BathroomPlanning({ section, images, band, links, isFirst }: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const Heading = isFirst ? "h1" : "h2";
  const [photo] = images;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[3fr_2fr] lg:gap-20">
          <Heading id={headingId} className="max-w-3xl text-[32px] leading-[1.15] font-semibold tracking-tight text-balance sm:text-[42px] lg:text-[46px]">
            Showers, conversions, fixtures, storage, and finishes <span className="text-action-deep">need one plan.</span>
          </Heading>
          <p className="max-w-lg text-base leading-7 text-ink/75 lg:pb-1">{section.content.body}</p>
        </div>

        <div className="mt-9 grid gap-8 sm:mt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {photo && (
            <figure className="min-w-0">
              <DesignImage image={photo} withTab={false} frameClassName="aspect-[4/3] sm:aspect-[6/5] lg:aspect-auto lg:h-[490px]" sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 100vw" />
              <figcaption className="flex flex-wrap justify-between gap-x-4 gap-y-2 border-b border-ink/15 py-4 text-xs leading-5 text-ink/70">
                <span>{photo.label}</span>
                <span>Bathroom remodeling</span>
              </figcaption>
            </figure>
          )}
          <div className="flex min-w-0 flex-col justify-center">
            <ul className="divide-y divide-ink/15 border-y border-ink/15">
              {details.map(({ title, copy, icon: Icon }) => (
                <li key={title} className="grid grid-cols-[28px_1fr] gap-4 py-6 sm:gap-5 sm:py-7">
                  <Icon aria-hidden="true" className="mt-1 size-6 text-action-deep" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl leading-snug font-semibold tracking-tight sm:text-2xl">{title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-ink/75 sm:text-base sm:leading-7">{copy}</p>
                  </div>
                </li>
              ))}
            </ul>
            <ContextLinks links={links} className="mt-5" />
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-5 bg-sage px-5 py-5 sm:px-7 lg:flex-row lg:items-center">
          <p className="max-w-sm text-sm leading-6 font-medium">{section.content.bullets[0]}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {section.content.bullets.slice(4).map((label) => (
              <li key={label} className="flex items-center gap-2 text-sm leading-6">
                <Check aria-hidden="true" className="size-4 shrink-0 text-action-deep" />{label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
