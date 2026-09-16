import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DesignCard } from "./DesignCard";
import { HomepageCard } from "./HomepageCard";
import { CORE_ROUTES, DESIGN_ROUTES, HOME_ROUTE, SERVICE_AREA_ROUTES } from "./routes";

export const metadata: Metadata = {
  title: "Site Design Review | Tubro Construction",
  description:
    "Internal review gallery of the approved Direction A page designs for the new Tubro Construction site.",
  robots: { index: false, follow: false },
};

const CORE_CARD_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
const SERVICE_AREA_CARD_SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

const HEADER_STATS = [
  `${DESIGN_ROUTES.length} routes`,
  "1 homepage",
  `${CORE_ROUTES.length} core pages`,
  `${SERVICE_AREA_ROUTES.length} service-area pages`,
];

export default function SiteDesignPage(): ReactElement {
  return (
    <div className="min-h-screen bg-plaster text-ink">
      <header className="bg-carbon text-plaster">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
          <p className="font-fjalla text-xs tracking-[0.18em] text-plaster/60 uppercase">
            Tubro Construction · Internal design review
          </p>
          <h1 className="mt-3 font-poppins text-3xl font-bold tracking-tight sm:text-4xl">
            Site design review<span className="text-action">.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-plaster/70">
            Every approved page design for the new site, built on the selected Direction A —
            “Measured Living.” Click any card to open the full stitched capture in a new tab.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {HEADER_STATS.map((stat) => (
              <li
                key={stat}
                className="rounded-full border border-plaster/25 px-3.5 py-1.5 font-fjalla text-xs tracking-[0.08em] text-plaster/85 uppercase"
              >
                {stat}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pt-12 pb-20 sm:px-8 lg:pt-16">
        <section id="selected-homepage" aria-labelledby="selected-homepage-heading">
          <h2
            id="selected-homepage-heading"
            className="font-poppins text-2xl font-bold tracking-tight text-ink"
          >
            Selected homepage
          </h2>
          <div className="mt-6">{HOME_ROUTE && <HomepageCard route={HOME_ROUTE} />}</div>
        </section>

        <section id="core-pages" aria-labelledby="core-pages-heading" className="mt-16 lg:mt-20">
          <h2
            id="core-pages-heading"
            className="font-poppins text-2xl font-bold tracking-tight text-ink"
          >
            Core pages <span className="font-normal text-ink/40">· {CORE_ROUTES.length}</span>
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_ROUTES.map((route) => (
              <li key={route.path}>
                <DesignCard route={route} sizes={CORE_CARD_SIZES} />
              </li>
            ))}
          </ul>
        </section>

        <section
          id="service-area-pages"
          aria-labelledby="service-area-pages-heading"
          className="mt-16 lg:mt-20"
        >
          <h2
            id="service-area-pages-heading"
            className="font-poppins text-2xl font-bold tracking-tight text-ink"
          >
            Service-area pages{" "}
            <span className="font-normal text-ink/40">· {SERVICE_AREA_ROUTES.length}</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">
            One local landing page per city across King and Pierce Counties, each following the
            shared local-page template.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_AREA_ROUTES.map((route) => (
              <li key={route.path}>
                <DesignCard route={route} sizes={SERVICE_AREA_CARD_SIZES} />
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-16 border-t border-ink/10 pt-6 text-[13px] leading-relaxed text-ink/60">
          All previews are cropped from full-page stitched captures. Open a card to review the
          complete design at full resolution.
        </p>
      </main>
    </div>
  );
}
