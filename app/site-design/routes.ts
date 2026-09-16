export type RouteGroup = "home" | "core" | "resources" | "service-areas";

export type DesignRoute = {
  path: string;
  title: string;
  image: string;
  group: RouteGroup;
  /** Page-level rhythm family (core/resources) or service-area archetype. */
  rhythm: string;
  sectionCount: number;
  /** Concise composition summary derived from the Stage 9a section manifests. */
  summary: string;
};

type ServiceAreaArchetype =
  | "local-datum-directory"
  | "local-proof-rail"
  | "local-photo-canvas"
  | "local-ledger-map";

const SERVICE_AREA_SUMMARIES: Record<ServiceAreaArchetype, string> = {
  "local-datum-directory":
    "Diagonal-cropped local hero, map-and-list verified local scope, editorial guidance index, oversized-question FAQ ledger, centered estimate CTA.",
  "local-proof-rail":
    "Typographic manifesto hero with proof rail, filmstrip local evidence band, annotated material callouts, oversized-question FAQ ledger, split estimate form with contact ledger.",
  "local-photo-canvas":
    "Headline-over-photo local hero, image-as-canvas local scope, vertical milestone guidance spine, oversized-question FAQ ledger, estimate form overlaid on a photo material field.",
  "local-ledger-map":
    "Architectural stepped-split local hero, room-scale focal gallery with detail strip, map-and-list local guidance, oversized-question FAQ ledger, centered estimate CTA.",
};

function serviceArea(
  citySlug: string,
  cityName: string,
  archetype: ServiceAreaArchetype,
): DesignRoute {
  return {
    path: `/service-area/home-remodeling-${citySlug}`,
    title: `Home Remodeling in ${cityName}, WA`,
    image: `/design/pages/service-area--home-remodeling-${citySlug}/page.png`,
    group: "service-areas",
    rhythm: archetype,
    sectionCount: 5,
    summary: SERVICE_AREA_SUMMARIES[archetype],
  };
}

export const DESIGN_ROUTES: DesignRoute[] = [
  {
    path: "/",
    title: "Residential Remodeling in King & Pierce Counties",
    image: "/design/a/homepage.png",
    group: "home",
    rhythm: "Measured Living — selected Direction A",
    sectionCount: 7,
    summary:
      "Approved homepage: measured green construction line from hero through trust bar, capabilities, rooms, work gallery, process, and the estimate form.",
  },
  {
    path: "/general-contractor",
    title: "Residential General Contractor in Western Washington",
    image: "/design/pages/general-contractor/page.png",
    group: "core",
    rhythm: "architectural scope narrative",
    sectionCount: 5,
    summary:
      "Cinematic image-field hero with inset slab, editorial scope index, asymmetric masonry project ledger, staggered process path, split estimate form with contact ledger.",
  },
  {
    path: "/kitchen-remodeling",
    title: "Kitchen Remodeling in King & Pierce Counties",
    image: "/design/pages/kitchen-remodeling/page.png",
    group: "core",
    rhythm: "room-scale visual planning",
    sectionCount: 5,
    summary:
      "Architectural stepped-split hero, room-scale focal gallery with detail strip, annotated material callouts, compact numbered process strip, centered estimate CTA.",
  },
  {
    path: "/bathroom-remodeling",
    title: "Bathroom Remodeling in King & Pierce Counties",
    image: "/design/pages/bathroom-remodeling/page.png",
    group: "core",
    rhythm: "material and detail-led bathroom planning",
    sectionCount: 5,
    summary:
      "Headline-over-photo hero with quiet zone, horizontal filmstrip evidence band, annotated material callouts, vertical milestone process spine, form overlaid on a photo material field.",
  },
  {
    path: "/interior-exterior-painting",
    title: "Interior & Exterior Painting in King & Pierce Counties",
    image: "/design/pages/interior-exterior-painting/page.png",
    group: "core",
    rhythm: "surface and color-field evidence",
    sectionCount: 5,
    summary:
      "Image-led collage hero with marginal copy, surface color-field photo proof, compact numbered preparation strip, filmstrip gallery with FAQ band, centered estimate CTA.",
  },
  {
    path: "/custom-home-services",
    title: "Custom Home Builder in King & Pierce Counties",
    image: "/design/pages/custom-home-services/page.png",
    group: "core",
    rhythm: "blueprint and sequence grammar",
    sectionCount: 5,
    summary:
      "Typographic manifesto hero with proof rail, editorial planning index, vertical milestone construction spine, asymmetric masonry gallery with FAQ, form overlaid on a photo material field.",
  },
  {
    path: "/recent-projects",
    title: "Recent Remodeling Projects",
    image: "/design/pages/recent-projects/page.png",
    group: "core",
    rhythm: "proof-first portfolio wall",
    sectionCount: 4,
    summary:
      "Headline-over-photo hero, asymmetric masonry project ledger, filmstrip evidence band with filters and review proof, centered estimate CTA.",
  },
  {
    path: "/about-us",
    title: "Meet the Tubro Construction Team",
    image: "/design/pages/about-us/page.png",
    group: "core",
    rhythm: "accountability and team editorial system",
    sectionCount: 5,
    summary:
      "Typographic manifesto hero with proof rail, image-as-canvas company story, editorial team roster without portraits, milestone spine for how-we-work and veteran-owned, split estimate form.",
  },
  {
    path: "/service-areas",
    title: "Home Remodeling Service Areas in Western Washington",
    image: "/design/pages/service-areas/page.png",
    group: "core",
    rhythm: "regional index and directory",
    sectionCount: 5,
    summary:
      "Diagonal-cropped hero, editorial county overview index, map-and-list city directory, image-as-canvas project map, centered estimate CTA.",
  },
  {
    path: "/blog",
    title: "Remodeling Tips & Articles",
    image: "/design/pages/blog/page.png",
    group: "resources",
    rhythm: "publication and planning index",
    sectionCount: 5,
    summary:
      "Publication-index hero, editorial featured-article index, map-and-list topic groups, oversized question ledger for recent articles and service links, centered estimate CTA.",
  },
  {
    path: "/careers",
    title: "Construction Careers",
    image: "/design/pages/careers/page.png",
    group: "resources",
    rhythm: "applicant journey and work-culture rhythm",
    sectionCount: 5,
    summary:
      "Image-led collage hero, filmstrip work-environment band, editorial benefits index, staggered hiring-process path, split application form with contact ledger.",
  },
  {
    path: "/contact",
    title: "Contact Tubro Construction",
    image: "/design/pages/contact/page.png",
    group: "resources",
    rhythm: "contact ledger and direct paths",
    sectionCount: 5,
    summary:
      "Contact-ledger hero, editorial contact-options index, map-and-list hours and service area, split contact form with narrow ledger, editorial service-links index.",
  },
  {
    path: "/schedule-an-estimate",
    title: "Schedule a Free Remodeling Estimate",
    image: "/design/pages/schedule-an-estimate/page.png",
    group: "resources",
    rhythm: "estimate brief and work-order grammar",
    sectionCount: 5,
    summary:
      "Centered estimate-brief hero, editorial qualification guidance, estimate form overlaid on a photo material field, compact numbered what-happens-next strip, phone-option contact ledger.",
  },
  serviceArea("maple-valley", "Maple Valley", "local-datum-directory"),
  serviceArea("tacoma", "Tacoma", "local-proof-rail"),
  serviceArea("covington", "Covington", "local-photo-canvas"),
  serviceArea("renton", "Renton", "local-ledger-map"),
  serviceArea("kent", "Kent", "local-datum-directory"),
  serviceArea("auburn", "Auburn", "local-proof-rail"),
  serviceArea("ravensdale", "Ravensdale", "local-photo-canvas"),
  serviceArea("enumclaw", "Enumclaw", "local-ledger-map"),
  serviceArea("issaquah", "Issaquah", "local-datum-directory"),
  serviceArea("bellevue", "Bellevue", "local-proof-rail"),
  serviceArea("newcastle", "Newcastle", "local-photo-canvas"),
  serviceArea("black-diamond", "Black Diamond", "local-ledger-map"),
  serviceArea("fairwood", "Fairwood", "local-datum-directory"),
  serviceArea("sumner", "Sumner", "local-proof-rail"),
  serviceArea("bonney-lake", "Bonney Lake", "local-photo-canvas"),
  serviceArea("buckley", "Buckley", "local-ledger-map"),
  serviceArea("snoqualmie", "Snoqualmie", "local-datum-directory"),
  serviceArea("north-bend", "North Bend", "local-proof-rail"),
  serviceArea("sammamish", "Sammamish", "local-photo-canvas"),
  {
    path: "/privacy",
    title: "Privacy Policy",
    image: "/design/pages/privacy/page.png",
    group: "resources",
    rhythm: "quiet document",
    sectionCount: 1,
    summary: "Single quiet editorial policy document, migrated verbatim.",
  },
];

export const HOME_ROUTE = DESIGN_ROUTES.find((route) => route.group === "home");
export const CORE_ROUTES = DESIGN_ROUTES.filter((route) => route.group === "core");
export const RESOURCE_ROUTES = DESIGN_ROUTES.filter((route) => route.group === "resources");
export const SERVICE_AREA_ROUTES = DESIGN_ROUTES.filter(
  (route) => route.group === "service-areas",
);
