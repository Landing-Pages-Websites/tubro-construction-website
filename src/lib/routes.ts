export interface SiteRoute {
  /** Public path, exactly as listed in the approved sitemap.json. */
  path: string;
  /** Design-artifact slug under public/design/pages/<slug>. */
  slug: string;
  /** Approved sitemap title (also the metadata title source). */
  title: string;
}

export interface CityRoute extends SiteRoute {
  city: string;
  citySlug: string;
}

const CITY_NAMES: Record<string, string> = {
  "maple-valley": "Maple Valley",
  tacoma: "Tacoma",
  covington: "Covington",
  renton: "Renton",
  kent: "Kent",
  auburn: "Auburn",
  ravensdale: "Ravensdale",
  enumclaw: "Enumclaw",
  issaquah: "Issaquah",
  bellevue: "Bellevue",
  newcastle: "Newcastle",
  "black-diamond": "Black Diamond",
  fairwood: "Fairwood",
  sumner: "Sumner",
  "bonney-lake": "Bonney Lake",
  buckley: "Buckley",
  snoqualmie: "Snoqualmie",
  "north-bend": "North Bend",
  sammamish: "Sammamish",
};

/** Sitemap order is contractual: this array mirrors sitemap.json exactly, "/" first. */
export const CORE_ROUTES_BEFORE_CITIES: SiteRoute[] = [
  { path: "/", slug: "homepage", title: "Residential Remodeling in King & Pierce Counties | Tubro Construction" },
  { path: "/general-contractor", slug: "general-contractor", title: "Residential General Contractor in Western Washington" },
  { path: "/kitchen-remodeling", slug: "kitchen-remodeling", title: "Kitchen Remodeling in King & Pierce Counties" },
  { path: "/bathroom-remodeling", slug: "bathroom-remodeling", title: "Bathroom Remodeling in King & Pierce Counties" },
  { path: "/interior-exterior-painting", slug: "interior-exterior-painting", title: "Interior & Exterior Painting in King & Pierce Counties" },
  { path: "/custom-home-services", slug: "custom-home-services", title: "Custom Home Builder in King & Pierce Counties" },
  { path: "/recent-projects", slug: "recent-projects", title: "Recent Remodeling Projects | Tubro Construction" },
  { path: "/about-us", slug: "about-us", title: "Meet the Tubro Construction Team" },
  { path: "/service-areas", slug: "service-areas", title: "Home Remodeling Service Areas in Western Washington" },
  { path: "/blog", slug: "blog", title: "Remodeling Tips & Articles | Tubro Construction" },
  { path: "/careers", slug: "careers", title: "Construction Careers | Tubro Construction" },
  { path: "/contact", slug: "contact", title: "Contact Tubro Construction" },
  { path: "/schedule-an-estimate", slug: "schedule-an-estimate", title: "Schedule a Free Remodeling Estimate" },
];

/** City order mirrors sitemap.json exactly. */
const CITY_ORDER = [
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
] as const;

export const CITY_ROUTES: CityRoute[] = CITY_ORDER.map((citySlug) => ({
  path: `/service-area/home-remodeling-${citySlug}`,
  slug: `service-area--home-remodeling-${citySlug}`,
  title: `Home Remodeling in ${CITY_NAMES[citySlug]}, WA`,
  city: CITY_NAMES[citySlug],
  citySlug,
}));

export const PRIVACY_ROUTE: SiteRoute = {
  path: "/privacy",
  slug: "privacy",
  title: "Privacy Policy | Tubro Construction",
};

/** All 33 public routes in exact sitemap.json order. */
export const SITE_ROUTES: SiteRoute[] = [
  ...CORE_ROUTES_BEFORE_CITIES,
  ...CITY_ROUTES,
  PRIVACY_ROUTE,
];

/** The 32 designed non-homepage routes, keyed by design slug. */
export const DESIGNED_ROUTES: SiteRoute[] = SITE_ROUTES.filter((route) => route.path !== "/");

export function routeForSlug(slug: string): SiteRoute {
  const route = SITE_ROUTES.find((entry) => entry.slug === slug);
  if (!route) throw new Error(`Unknown design slug: ${slug}`);
  return route;
}

export const NAV_SERVICES = [
  { href: "/general-contractor", label: "General Contractor" },
  { href: "/kitchen-remodeling", label: "Kitchen Remodeling" },
  { href: "/bathroom-remodeling", label: "Bathroom Remodeling" },
  { href: "/interior-exterior-painting", label: "Interior & Exterior Painting" },
  { href: "/custom-home-services", label: "Custom Home Services" },
] as const;

export const NAV_COMPANY = [
  { href: "/recent-projects", label: "Recent Projects" },
  { href: "/about-us", label: "About Us" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const NAV_FOOTER_EXTRA = [
  { href: "/careers", label: "Careers" },
  { href: "/schedule-an-estimate", label: "Schedule an Estimate" },
  { href: "/privacy", label: "Privacy Policy" },
] as const;
