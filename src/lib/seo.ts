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

export const businessSchema = {
  "@context": "https://schema.org", "@type": ["LocalBusiness", "Organization"],
  "@id": `${SITE_URL}/#organization`, name: BRAND.name, url: SITE_URL,
  telephone: "+12532162633", email: BRAND.email, logo: `${SITE_URL}${SOCIAL_IMAGE}`,
  areaServed: ["King County, Washington", "Pierce County, Washington"],
};
