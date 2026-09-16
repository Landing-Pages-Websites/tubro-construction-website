import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DesignedPage, designedPageMetadata } from "@/components/site/DesignedPage";
import { KitchenMotion } from "./KitchenMotion";

const SLUG = "kitchen-remodeling";

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  return <KitchenMotion><DesignedPage slug={SLUG} /></KitchenMotion>;
}
