export type DesignRoute = {
  path: string;
  title: string;
  image: string;
};

export const DESIGN_ROUTES: DesignRoute[] = [
  { path: "/", title: "Residential Remodeling in King & Pierce Counties", image: "/design/a/homepage.png" },
  { path: "/general-contractor", title: "Residential General Contractor in Western Washington", image: "/design/pages/general-contractor/page.png" },
  { path: "/kitchen-remodeling", title: "Kitchen Remodeling in King & Pierce Counties", image: "/design/pages/kitchen-remodeling/page.png" },
  { path: "/bathroom-remodeling", title: "Bathroom Remodeling in King & Pierce Counties", image: "/design/pages/bathroom-remodeling/page.png" },
  { path: "/interior-exterior-painting", title: "Interior & Exterior Painting in King & Pierce Counties", image: "/design/pages/interior-exterior-painting/page.png" },
  { path: "/custom-home-services", title: "Custom Home Builder in King & Pierce Counties", image: "/design/pages/custom-home-services/page.png" },
  { path: "/recent-projects", title: "Recent Remodeling Projects", image: "/design/pages/recent-projects/page.png" },
  { path: "/about-us", title: "Meet the Tubro Construction Team", image: "/design/pages/about-us/page.png" },
  { path: "/service-areas", title: "Home Remodeling Service Areas in Western Washington", image: "/design/pages/service-areas/page.png" },
  { path: "/blog", title: "Remodeling Tips & Articles", image: "/design/pages/blog/page.png" },
  { path: "/careers", title: "Construction Careers", image: "/design/pages/careers/page.png" },
  { path: "/contact", title: "Contact Tubro Construction", image: "/design/pages/contact/page.png" },
  { path: "/schedule-an-estimate", title: "Schedule a Free Remodeling Estimate", image: "/design/pages/schedule-an-estimate/page.png" },
  { path: "/service-area/home-remodeling-maple-valley", title: "Home Remodeling in Maple Valley, WA", image: "/design/pages/service-area--home-remodeling-maple-valley/page.png" },
  { path: "/service-area/home-remodeling-tacoma", title: "Home Remodeling in Tacoma, WA", image: "/design/pages/service-area--home-remodeling-tacoma/page.png" },
  { path: "/service-area/home-remodeling-covington", title: "Home Remodeling in Covington, WA", image: "/design/pages/service-area--home-remodeling-covington/page.png" },
  { path: "/service-area/home-remodeling-renton", title: "Home Remodeling in Renton, WA", image: "/design/pages/service-area--home-remodeling-renton/page.png" },
  { path: "/service-area/home-remodeling-kent", title: "Home Remodeling in Kent, WA", image: "/design/pages/service-area--home-remodeling-kent/page.png" },
  { path: "/service-area/home-remodeling-auburn", title: "Home Remodeling in Auburn, WA", image: "/design/pages/service-area--home-remodeling-auburn/page.png" },
  { path: "/service-area/home-remodeling-ravensdale", title: "Home Remodeling in Ravensdale, WA", image: "/design/pages/service-area--home-remodeling-ravensdale/page.png" },
  { path: "/service-area/home-remodeling-enumclaw", title: "Home Remodeling in Enumclaw, WA", image: "/design/pages/service-area--home-remodeling-enumclaw/page.png" },
  { path: "/service-area/home-remodeling-issaquah", title: "Home Remodeling in Issaquah, WA", image: "/design/pages/service-area--home-remodeling-issaquah/page.png" },
  { path: "/service-area/home-remodeling-bellevue", title: "Home Remodeling in Bellevue, WA", image: "/design/pages/service-area--home-remodeling-bellevue/page.png" },
  { path: "/service-area/home-remodeling-newcastle", title: "Home Remodeling in Newcastle, WA", image: "/design/pages/service-area--home-remodeling-newcastle/page.png" },
  { path: "/service-area/home-remodeling-black-diamond", title: "Home Remodeling in Black Diamond, WA", image: "/design/pages/service-area--home-remodeling-black-diamond/page.png" },
  { path: "/service-area/home-remodeling-fairwood", title: "Home Remodeling in Fairwood, WA", image: "/design/pages/service-area--home-remodeling-fairwood/page.png" },
  { path: "/service-area/home-remodeling-sumner", title: "Home Remodeling in Sumner, WA", image: "/design/pages/service-area--home-remodeling-sumner/page.png" },
  { path: "/service-area/home-remodeling-bonney-lake", title: "Home Remodeling in Bonney Lake, WA", image: "/design/pages/service-area--home-remodeling-bonney-lake/page.png" },
  { path: "/service-area/home-remodeling-buckley", title: "Home Remodeling in Buckley, WA", image: "/design/pages/service-area--home-remodeling-buckley/page.png" },
  { path: "/service-area/home-remodeling-snoqualmie", title: "Home Remodeling in Snoqualmie, WA", image: "/design/pages/service-area--home-remodeling-snoqualmie/page.png" },
  { path: "/service-area/home-remodeling-north-bend", title: "Home Remodeling in North Bend, WA", image: "/design/pages/service-area--home-remodeling-north-bend/page.png" },
  { path: "/service-area/home-remodeling-sammamish", title: "Home Remodeling in Sammamish, WA", image: "/design/pages/service-area--home-remodeling-sammamish/page.png" },
  { path: "/privacy", title: "Privacy Policy", image: "/design/pages/privacy/page.png" },
];

const SERVICE_AREA_PREFIX = "/service-area/";

export const HOME_ROUTE = DESIGN_ROUTES.find((route) => route.path === "/");
export const CORE_ROUTES = DESIGN_ROUTES.filter(
  (route) => route.path !== "/" && !route.path.startsWith(SERVICE_AREA_PREFIX),
);
export const SERVICE_AREA_ROUTES = DESIGN_ROUTES.filter((route) =>
  route.path.startsWith(SERVICE_AREA_PREFIX),
);
