import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CITY_ROUTES } from "@/lib/routes";
import { DesignedPage, designedPageMetadata } from "@/components/site/DesignedPage";

interface CityPageParams {
  params: Promise<{ city: string }>;
}

function slugForParam(city: string): string | null {
  const route = CITY_ROUTES.find((entry) => entry.path === `/service-area/${city}`);
  return route?.slug ?? null;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ city: string }> {
  return CITY_ROUTES.map((route) => ({ city: `home-remodeling-${route.citySlug}` }));
}

export async function generateMetadata({ params }: CityPageParams): Promise<Metadata> {
  const { city } = await params;
  const slug = slugForParam(city);
  if (!slug) return {};
  return designedPageMetadata(slug);
}

export default async function CityPage({ params }: CityPageParams): Promise<ReactElement> {
  const { city } = await params;
  const slug = slugForParam(city);
  if (!slug) notFound();
  return <DesignedPage slug={slug} />;
}
