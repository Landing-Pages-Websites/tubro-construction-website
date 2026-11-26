import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BRAND } from "@/lib/content";
import { siteMetadata } from "@/lib/seo";
import styles from "./doors.module.css";

const PATH = "/doors";
const ESTIMATE_PATH = "/schedule-an-estimate";
const ESTIMATE_LABEL = "Request a free estimate";

export const metadata: Metadata = siteMetadata(
  "Door Installation & Replacement | Tubro Construction",
  "Tubro Construction installs and replaces residential doors as part of remodeling, accessibility, and outdoor-living projects in King and Pierce Counties.",
  PATH,
);

const SCOPE = [
  {
    title: "Doors in a remodel",
    body: "An interior or exterior door that is part of a kitchen, bathroom, addition, or whole-home remodel, including the opening, trim, and how the door meets the finished room.",
  },
  {
    title: "Sliding doors to outdoor living",
    body: "A sliding door that connects the house to a deck, patio, or covered outdoor space, planned with the route people actually use.",
  },
  {
    title: "Wider openings for access",
    body: "Door widening when an aging-in-place project needs a clearer opening for a wheelchair or walker. The opening is planned with the rest of that access work, not as a separate product.",
  },
] as const;

const QUESTIONS = [
  "Which door, and whether it is inside the home or on an exterior wall.",
  "Whether the opening stays the same size or needs to be wider.",
  "What the door has to clear: a cabinet, a hallway, a shower, or furniture.",
  "Whether the door is part of a larger remodel, a deck, or an accessibility project.",
  "Any style direction you already have, without treating a product photo as the specification.",
] as const;

const LINKS = [
  { href: "/aging-in-place", label: "Door widening and aging-in-place remodeling" },
  { href: "/bathroom-remodeling", label: "Bathroom remodeling" },
  { href: "/kitchen-remodeling", label: "Kitchen remodeling" },
  { href: "/home-additions", label: "Home additions" },
  { href: "/service-areas", label: "Service areas in King and Pierce Counties" },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.tubroconstruction.com/doors#service",
  name: "Residential door installation and replacement",
  serviceType: "Residential door installation and replacement",
  description:
    "Residential door installation and replacement for homeowners in King and Pierce Counties, Washington, including doors that are part of a remodel, a sliding door to outdoor living, and door widening for access.",
  url: "https://www.tubroconstruction.com/doors",
  provider: { "@id": "https://www.tubroconstruction.com/#organization" },
  areaServed: ["King County, Washington", "Pierce County, Washington"],
};

function EstimateActions({ cta }: { cta: string }): ReactElement {
  return (
    <div className={styles.actions}>
      <Link data-mega-cta={`${cta}-estimate`} className={styles.primary} href={ESTIMATE_PATH}>
        {ESTIMATE_LABEL}
        <ArrowUpRight aria-hidden="true" />
      </Link>
      <a data-mega-cta={`${cta}-call`} className={styles.secondary} href={BRAND.phoneHref}>
        <Phone aria-hidden="true" />
        Call {BRAND.phoneDisplay}
      </a>
    </div>
  );
}

export default function Page(): ReactElement {
  return (
    <div className={styles.site}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <SiteHeader />
      <main className={styles.page} id="main-content" tabIndex={-1}>
        <section data-mega-section="hero" id="hero" className={styles.hero} aria-labelledby="doors-heading">
          <div className={styles.rule} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Door installation and replacement</p>
            <h1 id="doors-heading">Doors planned with the room they open into.</h1>
            <p className={styles.lede}>
              Tubro Construction installs and replaces residential doors for homeowners in King and Pierce Counties. Door work is usually part of a remodel, an outdoor-living project, or an accessibility upgrade, not a standalone door order.
            </p>
            <EstimateActions cta="doors-hero" />
            <p className={styles.note}>A submitted form starts an estimate inquiry. It does not reserve an appointment.</p>
          </div>
          <aside className={styles.office} aria-label="Service details">
            <p><span>Service</span>Residential door installation and replacement</p>
            <p><span>Serving</span>{BRAND.serviceArea}</p>
            <p><span>Company</span>Veteran-owned general contractor</p>
            <p><span>Office hours</span>{BRAND.hours}</p>
          </aside>
        </section>

        <section data-mega-section="scope" id="scope" className={styles.scope} aria-labelledby="scope-heading">
          <div className={styles.sectionIntro}>
            <h2 id="scope-heading">Where door work fits</h2>
            <p>The useful first question is which opening needs to change, and what else in the project depends on it.</p>
          </div>
          <ul className={styles.scopeList}>
            {SCOPE.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section data-mega-section="planning" id="planning" className={styles.planning} aria-labelledby="planning-heading">
          <div className={styles.sectionIntro}>
            <h2 id="planning-heading">What to bring to the estimate</h2>
            <p>You do not need a product picked out. These details are enough to start a useful conversation.</p>
          </div>
          <ol className={styles.questionList}>
            {QUESTIONS.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
          <p className={styles.planningNote}>
            A door replacement that changes the size of the opening can require a permit. Tubro confirms that for the specific project rather than treating a general rule as approval.
          </p>
        </section>

        <section data-mega-section="related" id="related" className={styles.related} aria-labelledby="related-heading">
          <div className={styles.sectionIntro}>
            <h2 id="related-heading">Related Tubro Construction work</h2>
          </div>
          <ul className={styles.linkList}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link prefetch={false} href={link.href}>
                  {link.label}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section data-mega-section="contact" id="contact" className={styles.contact} aria-labelledby="contact-heading">
          <h2 id="contact-heading">Planning a door as part of a remodel or outdoor project?</h2>
          <p>Tell us which opening needs to change and what the rest of the project includes. The office follows up during business hours.</p>
          <EstimateActions cta="doors-footer" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
