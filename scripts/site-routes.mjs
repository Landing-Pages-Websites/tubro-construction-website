/**
 * The approved public route set, mirroring sitemap.json exactly ("/" first).
 * Shared by the build-artifact generator and the verification script.
 */
export const CITY_SLUGS = [
  "maple-valley",
  "tacoma",
  "covington",
  "renton",
  "kent",
  "auburn",
  "ravensdale",
  "enumclaw",
  "issaquah",
  "bellevue",
  "newcastle",
  "black-diamond",
  "fairwood",
  "sumner",
  "bonney-lake",
  "buckley",
  "snoqualmie",
  "north-bend",
  "sammamish",
];

const CORE = [
  ["/", "homepage"],
  ["/general-contractor", "general-contractor"],
  ["/kitchen-remodeling", "kitchen-remodeling"],
  ["/bathroom-remodeling", "bathroom-remodeling"],
  ["/interior-exterior-painting", "interior-exterior-painting"],
  ["/custom-home-services", "custom-home-services"],
  ["/recent-projects", "recent-projects"],
  ["/about-us", "about-us"],
  ["/service-areas", "service-areas"],
  ["/blog", "blog"],
  ["/careers", "careers"],
  ["/contact", "contact"],
  ["/schedule-an-estimate", "schedule-an-estimate"],
];

export const SITE_ROUTES = [
  ...CORE.map(([path, slug]) => ({ path, slug })),
  ...CITY_SLUGS.map((city) => ({
    path: `/service-area/home-remodeling-${city}`,
    slug: `service-area--home-remodeling-${city}`,
  })),
  { path: "/privacy", slug: "privacy" },
];

export const DESIGNED_ROUTES = SITE_ROUTES.filter((route) => route.path !== "/");
