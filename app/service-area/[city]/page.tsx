import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CITY_ROUTES } from "@/lib/routes";
import { CityPageLayout } from "../CityPageLayout";
import { CITY_PROFILES } from "../city-content";

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
  return {
    title: route.title,
    description: CITY_PROFILES[route.citySlug].intro,
    alternates: { canonical: route.path },
  };
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
