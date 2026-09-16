import pageLinks from "@/data/page-links.json";
import type { ManifestSection } from "@/lib/manifest";
import { BRAND } from "@/lib/content";
import { SITE_ROUTES } from "@/lib/routes";

export interface ResolvedLink {
  href: string;
  label: string;
}

const ROUTE_LABELS: Record<string, string> = {
  "/schedule-an-estimate": "Schedule a free estimate",
  "/recent-projects": "See recent projects",
  "/contact": "Contact the office",
  "/service-areas": "Browse service areas",
  "/general-contractor": "General contractor services",
  "/kitchen-remodeling": "Kitchen remodeling",
  "/bathroom-remodeling": "Bathroom remodeling",
  "/interior-exterior-painting": "Interior & exterior painting",
  "/custom-home-services": "Custom home services",
  "/about-us": "Meet the team",
  "/blog": "Remodeling tips & articles",
  "/careers": "Construction careers",
};

const CTA_ROUTES: Record<string, string> = {
  "Schedule a Free Estimate": "/schedule-an-estimate",
  "View Recent Projects": "/recent-projects",
  "Contact Us": "/contact",
  "Request a Quote": "/schedule-an-estimate",
};

/** Resolves an approved manifest CTA string to its destination. */
export function ctaHref(cta: string): string {
  if (cta.startsWith("Call")) return BRAND.phoneHref;
  const route = CTA_ROUTES[cta];
  if (route) return route;
  // Form-submitting CTAs (Apply Now, Submit Application, Send Message) stay in-section.
  return "#";
}

type PageLinkMap = Record<string, Record<string, { internal_links: string[]; cta: string }>>;

/**
 * Blueprint contextual links for a manifest section (union across merged
 * blueprint sections), excluding the section's own CTA destination and the
 * current page.
 */
export function contextualLinks(
  slug: string,
  section: ManifestSection,
  currentPath: string,
): ResolvedLink[] {
  const bySection = (pageLinks as PageLinkMap)[slug] ?? {};
  const seen = new Set<string>([currentPath]);
  if (section.content.cta) seen.add(ctaHref(section.content.cta));
  const links: ResolvedLink[] = [];
  for (const name of section.source_blueprint_sections) {
    for (const href of bySection[name]?.internal_links ?? []) {
      if (seen.has(href)) continue;
      seen.add(href);
      const label = ROUTE_LABELS[href] ?? SITE_ROUTES.find((route) => route.path === href)?.title;
      if (label) links.push({ href, label });
    }
  }
  return links;
}
