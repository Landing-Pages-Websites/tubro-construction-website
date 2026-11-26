import type { Metadata } from "next";
import { BRAND } from "./content";

export const SITE_URL = "https://www.tubroconstruction.com";
const SOCIAL_IMAGE = "/images/tc-logo.png";

/** SEO excerpts never change the authored visible copy. */
export function seoText(value: string, limit: number): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).replace(/\s+\S*$/, "").replace(/[,;:]$/, "")}…`;
}

export function siteMetadata(title: string, description: string, path: string, image = SOCIAL_IMAGE): Metadata {
  const seoTitle = seoText(title, 70);
  const seoDescription = seoText(description, 165);
  return {
    title: seoTitle, description: seoDescription, alternates: { canonical: path },
    openGraph: { type: "website", title: seoTitle, description: seoDescription, url: path, siteName: BRAND.name, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title: seoTitle, description: seoDescription, images: [image] },
  };
}

/**
 * Confirmed public facts only.
 * Phone, email, and Monday–Friday 7:00 a.m.–4:00 p.m. hours are visible in the site footer.
 * The eight cities are the audit's priority service cities and are linked from live city pages.
 * No street address: the public site shows a service area, not a storefront. The Maple Valley
 * PMB is a mailing address, and directory copies are not a confirmed public location.
 * No geo or priceRange: those are not independently confirmed on the site.
 * sameAs lists the Google, Houzz, Nextdoor, Facebook, and Instagram profiles
 * verified as Tubro Construction (remodeling), phone (253) 216-2633.
 * No carpet-cleaning profile.
 */
export const PRIORITY_SERVICE_CITIES = [
  "Auburn, Washington",
  "Black Diamond, Washington",
  "Covington, Washington",
  "Enumclaw, Washington",
  "Issaquah, Washington",
  "Kent, Washington",
  "Maple Valley, Washington",
  "Renton, Washington",
] as const;

export const businessSchema = {
  "@context": "https://schema.org",
  "@type": ["GeneralContractor", "HomeAndConstructionBusiness", "LocalBusiness", "Organization"],
  "@id": `${SITE_URL}/#organization`,
  name: BRAND.name,
  url: SITE_URL,
  telephone: "+12532162633",
  email: BRAND.email,
  logo: `${SITE_URL}${SOCIAL_IMAGE}`,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "16:00",
    },
  ],
  areaServed: [
    ...PRIORITY_SERVICE_CITIES,
    "King County, Washington",
    "Pierce County, Washington",
  ],
  sameAs: [
    "https://maps.google.com/maps?cid=4189534280358030411",
    "https://www.houzz.com/professionals/general-contractors/tubro-construction-pfvwus-pf~668266200",
    "https://nextdoor.com/pages/tubro-construction-ravensdale-wa/",
    "https://www.facebook.com/TubroConstruction/",
    "https://www.instagram.com/tubro_construction/",
  ],
};
