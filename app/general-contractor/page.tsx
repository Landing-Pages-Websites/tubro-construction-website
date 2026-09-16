import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DesignedPage, designedPageMetadata } from "@/components/site/DesignedPage";
import { GeneralContractorMotion } from "./GeneralContractorMotion";

const SLUG = "general-contractor";

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  return <GeneralContractorMotion><DesignedPage slug={SLUG} /></GeneralContractorMotion>;
}
