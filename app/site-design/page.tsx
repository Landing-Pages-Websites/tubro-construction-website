import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DesignCard } from "./DesignCard";
import { HomepageCard } from "./HomepageCard";
import {
  CORE_ROUTES,
  DESIGN_ROUTES,
  HOME_ROUTE,
  RESOURCE_ROUTES,
  SERVICE_AREA_ROUTES,
} from "./routes";

export const metadata: Metadata = {
  title: "Site Design Review | Tubro Construction",
  description:
    "Internal review gallery of the revised Stage 9a interior page designs for the new Tubro Construction site.",
  robots: { index: false, follow: false },
};

const CORE_CARD_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
const SERVICE_AREA_CARD_SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

const COMPOSITION_OWNER_COUNT = 26;
const SERVICE_AREA_ARCHETYPE_COUNT = 4;

const HEADER_STATS = [
  `${DESIGN_ROUTES.length} routes`,
  "1 homepage",
  `${CORE_ROUTES.length} core pages`,
  `${RESOURCE_ROUTES.length} resource & utility pages`,
  `${SERVICE_AREA_ROUTES.length} service-area pages`,
  `${COMPOSITION_OWNER_COUNT} composition owners`,
  `${SERVICE_AREA_ARCHETYPE_COUNT} local archetypes`,
];

type GallerySection = {
  id: string;
  heading: string;
  routes: typeof DESIGN_ROUTES;
  note: string;
  sizes: string;
  gridClass: string;
};

const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "core-pages",
    heading: "Core pages",
    routes: CORE_ROUTES,
    note: "Service, proof, and company pages. Each core page owns a bespoke rhythm — no two share the same ordered section sequence or hero composition.",
    sizes: CORE_CARD_SIZES,
    gridClass: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  },
  {
    id: "resource-utility-pages",
    heading: "Resources & utility",
    routes: RESOURCE_ROUTES,
    note: "Blog, careers, contact, estimate, and privacy — indexes, forms, and the quiet policy document, each with its own page grammar.",
    sizes: CORE_CARD_SIZES,
    gridClass: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  },
  {
    id: "service-area-pages",
    heading: "Service-area pages",
    routes: SERVICE_AREA_ROUTES,
    note: "One local landing page per city across King and Pierce Counties. The earlier one-shared-template approach is gone: cities rotate through four local-page archetypes — datum directory, proof rail, photo canvas, and ledger map — so no two adjacent cities repeat a hero or section sequence.",
    sizes: SERVICE_AREA_CARD_SIZES,
    gridClass: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
];

export default function SiteDesignPage(): ReactElement {
  return (
    <div className="min-h-screen bg-plaster text-ink">
      <header className="bg-carbon text-plaster">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
          <p className="font-fjalla text-xs tracking-[0.18em] text-plaster/60 uppercase">
            Tubro Construction · Internal design review · Stage 9a revision
          </p>
          <h1 className="mt-3 font-poppins text-3xl font-bold tracking-tight sm:text-4xl">
            Site design review<span className="text-action">.</span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-plaster/70">
            The revised interior-page set on the selected Direction A — “Measured Living.” This
            revision resolves the rejected repeated layout patterns: every section is built from{" "}
            {COMPOSITION_OWNER_COUNT} named composition owners, each core page follows a bespoke
            rhythm, and the {SERVICE_AREA_ROUTES.length} city pages rotate through{" "}
            {SERVICE_AREA_ARCHETYPE_COUNT} local-page archetypes instead of one shared template.
            Click any card to open the full stitched capture at full resolution.
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

        {GALLERY_SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="mt-16 lg:mt-20"
          >
            <h2
              id={`${section.id}-heading`}
              className="font-poppins text-2xl font-bold tracking-tight text-ink"
            >
              {section.heading}{" "}
              <span className="font-normal text-ink/40">· {section.routes.length}</span>
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink/60">{section.note}</p>
            <ul className={`mt-6 grid gap-6 ${section.gridClass}`}>
              {section.routes.map((route) => (
                <li key={route.path}>
                  <DesignCard route={route} sizes={section.sizes} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-16 border-t border-ink/10 pt-6 text-[13px] leading-relaxed text-ink/60">
          All previews are cropped from full-page stitched captures. Open a card to review the
          complete design at full resolution. Composition and rhythm labels come from the Stage 9a
          section manifests and layout-diversity audit.
        </p>
      </main>
    </div>
  );
}
