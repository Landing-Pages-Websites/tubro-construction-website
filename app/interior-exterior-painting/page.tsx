import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DesignedPage, designedPageMetadata } from "@/components/site/DesignedPage";
import { PaintingMotion } from "@/components/sections/PaintingMotion";

const SLUG = "interior-exterior-painting";

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  return <PaintingMotion><DesignedPage slug={SLUG} /></PaintingMotion>;
}
