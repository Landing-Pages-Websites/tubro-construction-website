import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DesignedPage, designedPageMetadata } from "@/components/site/DesignedPage";
import { BathroomMotion } from "./BathroomMotion";
import "./bathroom-motion.css";

const SLUG = "bathroom-remodeling";

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  return <BathroomMotion><DesignedPage slug={SLUG} /></BathroomMotion>;
}
