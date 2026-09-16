import Link from "next/link";
import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { BRAND } from "@/lib/content";
import { CITY_ROUTES } from "@/lib/routes";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { LedgerList } from "@/components/sections/LedgerList";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";

const COLUMN_LETTERS = "ABC";
const RULER_TICKS = Array.from(
  { length: 41 },
  (_, tick) => `M${6 + tick * 8} 1v${tick % 4 === 0 ? 11 : 6}`,
).join("");

/** Survey ruler footing the directory field, per the approved frames. */
function MeasureRuler(): ReactElement {
  return (
    <svg viewBox="0 0 332 32" className="w-72 sm:w-80" aria-hidden="true">
      <rect x="0.5" y="0.5" width="331" height="31" fill="#F6EEDD" stroke="#0C883D" />
      <path d={RULER_TICKS} stroke="#0C883D" strokeWidth="1.5" fill="none" />
      {Array.from({ length: 10 }, (_, unit) => (
        <text key={unit} x={6 + (unit + 1) * 32} y="26" textAnchor="middle" fontSize="10" className="fill-ink font-fjalla">
          {unit + 1}
        </text>
      ))}
    </svg>
  );
}

const ENTRY_LINK =
  "-my-2 py-2 font-fjalla text-base text-ink underline-offset-4 transition-colors hover:text-action-deep hover:underline";

/** Served-city names become live routes; phone and email become real actions. */
function DirectoryEntry({ item }: { item: string }): ReactElement {
  if (item.includes(BRAND.phoneDisplay)) {
    return <a href={BRAND.phoneHref} className={ENTRY_LINK}>{item}</a>;
  }
  if (item.includes("@")) {
    return <a href={`mailto:${item}`} className={`${ENTRY_LINK} break-all`}>{item}</a>;
  }
  const city = CITY_ROUTES.find((route) => item.includes(route.city));
  if (city) {
    return <Link href={city.path} className={ENTRY_LINK}>{item}</Link>;
  }
  return <span className="font-fjalla text-base text-ink">{item}</span>;
}

/**
 * Composition owner: directory-map-list-composition.
 * Surveyed directory field: a ticked green datum rule across the top, intro
 * pinned to a ticked vertical rule, and a coded ledger grid (A01/B01…) read
 * row-major in manifest order — city entries link to their local routes.
 */
export function DirectoryMapList({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const items = section.content.items.length > 0 ? section.content.items : section.content.bullets;
  const introBullets = section.content.items.length > 0 ? section.content.bullets : [];
  const columns = items.length > 12 ? 3 : 2;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Top datum rule with survey ticks — the map edge of the directory. */}
        <div aria-hidden="true" className="relative mb-10 sm:mb-14">
          <span className="block h-0.5 w-full bg-action" />
          <span className="absolute inset-x-0 top-0 flex justify-between px-[6%]">
            {Array.from({ length: 8 }, (_, tick) => (
              <span key={tick} className="h-2 w-0.5 bg-action" />
            ))}
          </span>
        </div>
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[2fr_3fr]">
          <div className="relative pl-6 sm:pl-8">
            <span aria-hidden="true" className="absolute top-1 bottom-1 left-0 flex w-0.5 flex-col justify-between bg-action">
              {Array.from({ length: 4 }, (_, tick) => (
                <span key={tick} className="h-0.5 w-3 bg-action" />
              ))}
            </span>
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
            {introBullets.length > 0 && <LedgerList items={introBullets} className="mt-7" />}
            {(section.content.cta || section.content.secondary_cta) && (
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
                {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
              </div>
            )}
            <ContextLinks links={links} className="mt-6" />
          </div>
          <ul className={`grid content-start gap-x-8 gap-y-4 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
            {items.map((item, index) => (
              <li key={item} className="grid grid-cols-[36px_16px_1fr] items-baseline gap-x-3">
                <span aria-hidden="true" className="font-fjalla text-sm text-action">
                  {COLUMN_LETTERS[index % columns]}
                  {String(Math.floor(index / columns) + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="h-0.5 w-4 self-center bg-action" />
                <DirectoryEntry item={item} />
              </li>
            ))}
          </ul>
        </div>
        {images.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {images.map((image) => (
              <DesignImage
                key={image.src}
                image={image}
                frameClassName="aspect-[4/3]"
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              />
            ))}
          </div>
        )}
        <div className="mt-14 hidden justify-center sm:flex">
          <MeasureRuler />
        </div>
      </div>
    </SectionShell>
  );
}
