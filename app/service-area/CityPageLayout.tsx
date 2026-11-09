import type { ReactElement } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import type { CityRoute } from "@/lib/routes";
import { CityHero } from "./CityHero";
import { CityTrust } from "./CityTrust";
import { CityProcess } from "./CityProcess";
import { CityServices } from "./CityServices";
import { CityProjects } from "./CityProjects";
import { CityQuestions } from "./CityQuestions";
import { CityEstimate } from "./CityEstimate";
import { CityMoreAreas } from "./CityMoreAreas";
import { CityMotion } from "./CityMotion";
import { CITY_PROFILES } from "./city-content";
import styles from "./city.module.css";

const BONNEY_LAKE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://www.tubroconstruction.com/service-area/home-remodeling-bonney-lake/#service",
      name: "Home Remodeling in Bonney Lake, WA",
      description: "Start a conversation with Tubro about residential remodeling in Bonney Lake.",
      serviceType: "Home remodeling",
      areaServed: "Bonney Lake, Washington",
      provider: {
        "@id": "https://www.tubroconstruction.com/#organization",
      },
      url: "https://www.tubroconstruction.com/service-area/home-remodeling-bonney-lake/",
      mainEntityOfPage: {
        "@id": "https://www.tubroconstruction.com/service-area/home-remodeling-bonney-lake/",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.tubroconstruction.com/service-area/home-remodeling-bonney-lake/#faq",
      url: "https://www.tubroconstruction.com/service-area/home-remodeling-bonney-lake/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Tubro serve Bonney Lake?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Bonney Lake is part of Tubro’s service area. Share your property location and project details so we can confirm the fit for the work you have in mind.",
          },
        },
        {
          "@type": "Question",
          name: "What should I include in my estimate request?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tell us your project city, the room or exterior area, its current condition, and what you would like to change. Include your name and an email address or phone number so we can follow up.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need a finished design before contacting you?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. You can start with an idea and a few priorities. Let us know what you have already decided and what you would like to discuss.",
          },
        },
        {
          "@type": "Question",
          name: "Is the estimate free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Tubro offers free estimates and upfront pricing with no hidden fees. The team reviews your request before discussing the scope and next steps.",
          },
        },
        {
          "@type": "Question",
          name: "What happens after I send the form?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Your request goes to the Tubro team, who follow up during office hours: Monday–Friday, 7:00 a.m.–4:00 p.m. Sending the form starts a conversation; it does not book an appointment automatically.",
          },
        },
      ],
    },
  ],
} as const;

export function CityPageLayout({ route }: { route: CityRoute }): ReactElement {
  const profile = CITY_PROFILES[route.citySlug];
  return (
    <div className={styles.frame} data-motion-variant="a">

      <SiteHeader />
      {route.citySlug === "bonney-lake" ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(BONNEY_LAKE_SCHEMA) }}
        />
      ) : null}
      <main className={styles.page} data-city-page id="main-content" tabIndex={-1}>
        <CityMotion key={route.citySlug} />
        <CityHero route={route} profile={profile} />
        <CityTrust />
        <CityProcess />
        <CityServices city={route.city} profile={profile} />
        <CityProjects profile={profile} />
        <CityQuestions city={route.city} profile={profile} />
        <CityEstimate route={route} />
        <CityMoreAreas citySlug={route.citySlug} />
      </main>
      <SiteFooter />
    </div>
  );
}
