import Link from "next/link";
import type { ReactElement } from "react";

/** The eight priority city pages named in the November 25, 2026 audit. */
export const PRIORITY_CITY_LINKS = [
  { href: "/service-area/home-remodeling-auburn", label: "Auburn" },
  { href: "/service-area/home-remodeling-black-diamond", label: "Black Diamond" },
  { href: "/service-area/home-remodeling-covington", label: "Covington" },
  { href: "/service-area/home-remodeling-enumclaw", label: "Enumclaw" },
  { href: "/service-area/home-remodeling-issaquah", label: "Issaquah" },
  { href: "/service-area/home-remodeling-kent", label: "Kent" },
  { href: "/service-area/home-remodeling-maple-valley", label: "Maple Valley" },
  { href: "/service-area/home-remodeling-renton", label: "Renton" },
] as const;

/**
 * Visible city navigation for the homepage and service pages.
 * Each link goes straight to a live city page.
 */
export function PriorityCityLinks(): ReactElement {
  return (
    <section className="border-t border-ink/10 bg-white" aria-labelledby="areas-we-serve-heading" data-mega-section="areas-we-serve">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <h2 id="areas-we-serve-heading" className="font-fjalla text-2xl text-ink">
          Areas we serve
        </h2>
        <p className="mt-3 max-w-2xl font-poppins text-sm leading-relaxed text-ink/75">
          Tubro Construction remodels homes across King and Pierce Counties. These city pages cover local remodeling work and a free estimate.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
          {PRIORITY_CITY_LINKS.map((city) => (
            <li key={city.href}>
              <Link
                href={city.href}
                className="inline-flex min-h-11 items-center rounded-sm border border-ink/15 px-4 font-poppins text-sm font-semibold text-ink hover:border-action hover:text-action-deep"
              >
                {city.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
