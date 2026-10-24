import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DesignedPage } from "@/components/site/DesignedPage";
import { siteMetadata } from "@/lib/seo";
import { BathroomMotion } from "./BathroomMotion";
import "./bathroom-motion.css";

const SLUG = "bathroom-remodeling";

export const metadata: Metadata = siteMetadata(
  "Bathroom Remodeling in King & Pierce Counties | Tubro",
  "Bathroom remodeling in King and Pierce Counties with clear scope, free estimates, walk-in showers, tub conversions, and an assigned project manager.",
  "/bathroom-remodeling",
);

export default function Page(): ReactElement {
  return <BathroomMotion><DesignedPage slug={SLUG} /></BathroomMotion>;
}
