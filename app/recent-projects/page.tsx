import type { Metadata } from "next";
import type { ReactElement } from "react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import ProjectPortfolio from "./ProjectPortfolio";
import { RealWorkEmbed } from "./RealWorkEmbed";
import styles from "./shell.module.css";

const SLUG = "recent-projects";

const serviceSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": "https://www.tubroconstruction.com/recent-projects#service-kitchen-remodeling",
      "@type": "Service",
      name: "Kitchen remodeling",
      serviceType: "Kitchen remodeling",
      description: "Kitchen remodel with cabinets, countertops, and flooring.",
      provider: {
        "@id": "https://www.tubroconstruction.com/#organization",
      },
      areaServed: [
        "King County, Washington",
        "Pierce County, Washington",
      ],
      url: "https://www.tubroconstruction.com/recent-projects",
    },
    {
      "@id": "https://www.tubroconstruction.com/recent-projects#service-bathroom-remodeling",
      "@type": "Service",
      name: "Bathroom remodeling",
      serviceType: "Bathroom remodeling",
      description: "Primary bathroom remodel.",
      provider: {
        "@id": "https://www.tubroconstruction.com/#organization",
      },
      areaServed: [
        "King County, Washington",
        "Pierce County, Washington",
      ],
      url: "https://www.tubroconstruction.com/recent-projects",
    },
    {
      "@id": "https://www.tubroconstruction.com/recent-projects#service-outdoor-exterior",
      "@type": "Service",
      name: "Outdoor & exterior",
      serviceType: "Outdoor & exterior",
      description: "Outdoor kitchen and fireplace rebuild.",
      provider: {
        "@id": "https://www.tubroconstruction.com/#organization",
      },
      areaServed: [
        "King County, Washington",
        "Pierce County, Washington",
      ],
      url: "https://www.tubroconstruction.com/recent-projects",
    },
    {
      "@id": "https://www.tubroconstruction.com/recent-projects#service-commercial-remodeling",
      "@type": "Service",
      name: "Commercial remodeling",
      serviceType: "Commercial remodeling",
      description: "Planning a commercial remodel or interior fit-out in Western Washington? Tubro Construction helps property owners and businesses clarify the scope, plan the work, and move toward a clear estimate. Tell us what you’re considering and we’ll discuss the right next step.",
      provider: {
        "@id": "https://www.tubroconstruction.com/#organization",
      },
      areaServed: [
        "King County, Washington",
        "Pierce County, Washington",
      ],
      url: "https://www.tubroconstruction.com/recent-projects",
    },
    {
      "@id": "https://www.tubroconstruction.com/recent-projects#service-interior-fit-outs",
      "@type": "Service",
      name: "Interior fit-outs",
      serviceType: "Interior fit-outs",
      description: "Explore Tubro Construction’s residential projects, then learn how our team approaches commercial remodeling and interior fit-outs in Western Washington.",
      provider: {
        "@id": "https://www.tubroconstruction.com/#organization",
      },
      areaServed: [
        "King County, Washington",
        "Pierce County, Washington",
      ],
      url: "https://www.tubroconstruction.com/recent-projects",
    },
  ],
};

type Props = { searchParams: Promise<{ embed?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { embed } = await searchParams;
  return {
    ...designedPageMetadata(SLUG),
    description: "Explore Tubro Construction remodeling projects and learn how we help Western Washington property owners plan commercial remodels and interior fit-outs.",
    ...(embed === "realwork" ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Page({ searchParams }: Props): Promise<ReactElement> {
  // Keep the vendor's configured pathname, while isolating its document and metadata mutations.
  if ((await searchParams).embed === "realwork") return <RealWorkEmbed />;
  return <div className={styles.shell}>
    <SiteHeader />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <ProjectPortfolio />
    <SiteFooter />
  </div>;
}
