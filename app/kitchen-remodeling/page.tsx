import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DesignedPage, designedPageMetadata } from "@/components/site/DesignedPage";
import { KitchenMotion } from "./KitchenMotion";

const SLUG = "kitchen-remodeling";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.tubroconstruction.com/kitchen-remodeling#service",
  name: "Kitchen remodeling services",
  serviceType: "Kitchen remodeling",
  description:
    "Kitchen remodeling services for homeowners in King and Pierce Counties, Washington, including kitchen design, custom cabinetry and storage, kitchen island remodeling, countertops, flooring, tile work, appliance installation, lighting, and coordinated installation. Tubro Construction provides free estimates.",
  url: "https://www.tubroconstruction.com/kitchen-remodeling",
  provider: {
    "@id": "https://www.tubroconstruction.com/#organization",
  },
  areaServed: ["King County, Washington", "Pierce County, Washington"],
};

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  return (
    <KitchenMotion>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <DesignedPage slug={SLUG} />
    </KitchenMotion>
  );
}
