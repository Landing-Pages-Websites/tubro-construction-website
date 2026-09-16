import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DesignedPage, designedPageMetadata } from "@/components/site/DesignedPage";

const SLUG = "custom-home-services";

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  return <DesignedPage slug={SLUG} />;
}
