import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DesignedPage, designedPageMetadata } from "@/components/site/DesignedPage";
import { BathroomMotion } from "./BathroomMotion";
import "./bathroom-motion.css";

const SLUG = "bathroom-remodeling";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.tubroconstruction.com/bathroom-remodeling#service",
  name: "Bathroom remodeling services",
  serviceType: "Bathroom remodeling",
  description:
    "Bathroom remodeling services for homeowners in King and Pierce Counties, Washington, including bathroom renovations, shower and tub changes, tile, fixtures, flooring, drywall, and layout reconfiguration. Tubro Construction provides assigned project management and free estimates.",
  url: "https://www.tubroconstruction.com/bathroom-remodeling",
  provider: {
    "@id": "https://www.tubroconstruction.com/#organization",
  },
  areaServed: ["King County, Washington", "Pierce County, Washington"],
};

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  return (
    <BathroomMotion>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <DesignedPage slug={SLUG} />
    </BathroomMotion>
  );
}
