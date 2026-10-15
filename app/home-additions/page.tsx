import type { Metadata } from "next";
import type { ReactElement } from "react";
import { bandForSection, loadManifest } from "@/lib/manifest";
import { resolveSectionImages } from "@/lib/section-images";
import { contextualLinks, ctaHref } from "@/lib/section-links";
import { COMPOSITION_REGISTRY } from "@/components/sections/registry";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteMotion } from "@/components/shared/SiteMotion";
import { siteMetadata } from "@/lib/seo";
import { Fragment } from "react";

const SLUG = "home-additions";
const PATH = "/home-additions";

export const metadata: Metadata = siteMetadata(
  "Home Addition Contractors in King and Pierce Counties",
  "Plan a home addition, ADU, or DADU with Tubro Construction. Get clear scope, project management, and a free estimate in King or Pierce County.",
  PATH,
);

const faqItems = [
  { question: "Can Tubro Construction help with a home addition in my area?", answer: "Tubro Construction serves homeowners in King County and Pierce County in Western Washington. Start with the property location, the space you want to add, and what the new space needs to do." },
  { question: "Is an attached ADU different from a detached DADU?", answer: "Yes. An attached ADU is connected to or part of the existing home, while a detached DADU is a separate structure on the same property. The layout, access, utilities, site conditions, and local requirements can differ." },
  { question: "Will my home addition need permits?", answer: "Many structural additions require permits, but the exact requirements depend on the project and jurisdiction. Permit questions should be confirmed for the specific property before construction plans are treated as approved." },
  { question: "Can you tell me whether my lot can support an addition?", answer: "Tubro can help start a feasibility conversation around the home, lot, access, utilities, and intended scope. Final feasibility and approval depend on the applicable property and jurisdiction requirements." },
  { question: "How much does a home addition cost?", answer: "The cost depends on the size, design, structural connection, foundation, utilities, site conditions, materials, finish choices, and permit or design requirements. Request a free estimate to discuss the actual home and scope instead of relying on a generic figure." },
];

const serviceSchema = {
  "@type": "Service",
  "@id": "https://www.tubroconstruction.com/home-additions#service",
  name: "Home addition construction and ADU planning",
  serviceType: "Home addition construction and ADU planning",
  description: "Home addition construction and ADU planning for homeowners in King and Pierce Counties, Washington. Tubro Construction offers clear scope, assigned project management, and free estimates.",
  url: "https://www.tubroconstruction.com/home-additions",
  provider: { "@id": "https://www.tubroconstruction.com/#organization" },
  areaServed: ["King County, Washington", "Pierce County, Washington"],
};

const faqSchema = {
  "@type": "FAQPage",
  "@id": "https://www.tubroconstruction.com/home-additions#faq",
  mainEntity: faqItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const pageSchema = { "@context": "https://schema.org", "@graph": [serviceSchema, faqSchema] };

export default function Page(): ReactElement {
  const manifest = loadManifest(SLUG);
  const formAnchor = manifest.ordered_sections.find((section) => section.composition.startsWith("form-"))?.name;
  return (
    <div data-motion-variant="a" suppressHydrationWarning>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <SiteMotion variant="a" />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        {manifest.ordered_sections.map((section, index) => {
          const Composition = COMPOSITION_REGISTRY[section.composition];
          if (!Composition) throw new Error(`No composition owner registered for "${section.composition}" (${SLUG})`);
          const destination = section.content.cta ? ctaHref(section.content.cta) : "";
          const ctaTarget = (destination === PATH || destination === "#") && formAnchor ? `#${formAnchor}` : destination;
          return (
            <Fragment key={section.id}>
              <Composition
                section={section}
                images={resolveSectionImages(SLUG, section)}
                band={bandForSection(manifest, section.id)}
                links={contextualLinks(SLUG, section, PATH)}
                slug={SLUG}
                path={PATH}
                ctaTarget={ctaTarget}
                isFirst={index === 0}
              />
            </Fragment>
          );
        })}
      </main>
      <SiteFooter />
    </div>
  );
}
