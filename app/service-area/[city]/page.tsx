import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CITY_ROUTES } from "@/lib/routes";
import { CityPageLayout } from "../CityPageLayout";
import { siteMetadata } from "@/lib/seo";

interface CityPageParams {
  params: Promise<{ city: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ city: string }> {
  return CITY_ROUTES.map((route) => ({
    city: `home-remodeling-${route.citySlug}`,
  }));
}

export async function generateMetadata({
  params,
}: CityPageParams): Promise<Metadata> {
  const { city } = await params;
  const route = CITY_ROUTES.find(
    (entry) => entry.path === `/service-area/${city}`,
  );
  if (!route) return {};
  return siteMetadata(route.title, `Plan your home remodel in ${route.city}, Washington with Tubro Construction. Explore local kitchen, bathroom and renovation services and request a free estimate.`, route.path);
}

export default async function CityPage({
  params,
}: CityPageParams): Promise<ReactElement> {
  const { city } = await params;
  const route = CITY_ROUTES.find(
    (entry) => entry.path === `/service-area/${city}`,
  );
  if (!route) notFound();
  return <CityPageLayout route={route} />;
}
