import type { ReactElement } from "react";
import { ArrowUpRight, Check, Phone } from "lucide-react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { DesignImage } from "@/components/sections/DesignImage";
import { ContextLinks } from "@/components/sections/ContextLinks";

/** Painting-only editorial composition using the approved project photographs. */
export function PaintingSurfaces({ section, images, band, links }: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const [primary, ...details] = images;

  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-6 border-t border-ink/20 pt-8 lg:grid-cols-[3fr_2fr] lg:gap-20">
          <h2 id={headingId} className="max-w-[23ch] text-balance font-fjalla text-[clamp(2rem,3.5vw,3.25rem)] leading-[1.15] tracking-[-0.02em]">
            {section.content.headline}
          </h2>
          <p className="max-w-[42ch] text-base leading-7 text-ink/75 lg:pb-1">
            {section.content.body}
          </p>
        </div>

        <div className="mt-9 grid gap-6 lg:mt-12 lg:grid-cols-[3fr_2fr] lg:gap-8">
          {primary && (
            <figure className="min-w-0">
              <DesignImage image={primary} withTab={false} frameClassName="aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto lg:h-[480px]" sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw" />
              <figcaption className="flex items-center justify-between gap-4 border-b border-ink/15 py-4 text-sm font-medium">
                {primary.label}
                <span aria-hidden="true" className="h-px w-12 bg-action" />
              </figcaption>
            </figure>
          )}

          <div className="flex min-w-0 flex-col">
            <div className="bg-sage p-6 sm:p-8">
              <ul className="space-y-5">
                {section.content.bullets.map((bullet) => (
                  <li key={bullet}>
                    {bullet.includes("253-216-2633") ? (
                      <a href="tel:+12532162633" className="group flex min-h-11 items-center gap-3 border-t border-ink/15 pt-5 text-sm font-semibold leading-6 text-action-deep underline-offset-4 hover:underline">
                        <Phone aria-hidden="true" className="size-4 shrink-0" />
                        <span>{bullet}</span>
                        <ArrowUpRight aria-hidden="true" className="ml-auto size-5 shrink-0" />
                      </a>
                    ) : (
                      <div className="flex items-start gap-3 text-base leading-7">
                        <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-action-deep" />
                        <span>{bullet}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:flex-1">
              {details.slice(0, 2).map((photo) => (
                <figure key={photo.src} className="flex min-w-0 flex-col">
                  <DesignImage image={photo} withTab={false} frameClassName="aspect-[4/3] lg:aspect-auto lg:flex-1" sizes="(min-width: 1280px) 225px, (min-width: 1024px) 19vw, 45vw" />
                  <figcaption className="border-b border-ink/15 py-3 text-xs font-medium leading-5 sm:text-sm">{photo.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
        <ContextLinks links={links} className="mt-6" />
      </div>
    </SectionShell>
  );
}
