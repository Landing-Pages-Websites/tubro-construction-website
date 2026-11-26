import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BRAND } from "@/lib/content";
import { siteMetadata } from "@/lib/seo";
import styles from "./stairs.module.css";

const PATH = "/stairs";
const ESTIMATE_PATH = "/schedule-an-estimate";
const ESTIMATE_LABEL = "Request a free estimate";

export const metadata: Metadata = siteMetadata(
  "Stair Installation & Remodeling | Tubro Construction",
  "Tubro Construction plans and builds residential stairs as part of deck, addition, and remodeling projects across King and Pierce Counties.",
  PATH,
);

const SCOPE = [
  {
    title: "Deck and outdoor stairs",
    body: "Stairs that connect a deck, porch, or patio to the yard, including the landing and how the run meets the existing path.",
  },
  {
    title: "Stairs in an addition or remodel",
    body: "A new or rebuilt stair when a home addition, basement, or whole-home remodel changes how people move through the house.",
  },
  {
    title: "Layout before finishes",
    body: "Rise, run, landings, and headroom are settled with the structure. A finish such as decking, flooring, or a handrail is chosen after the layout works.",
  },
] as const;

const QUESTIONS = [
  "Where the stair starts and where it needs to land.",
  "Who uses it every day, including children, guests, or someone who needs a shallower rise.",
  "Whether the stair is inside the home or outside on a deck, porch, or entry.",
  "What has to stay clear: a door, a hallway, a window, or space under an elevated deck.",
  "Which material you want to review, and whether a handrail or guard is part of the same project.",
] as const;

const LINKS = [
  { href: "/blog/deck-remodel-planning", label: "Plan a deck remodel, including stairs" },
  { href: "/blog/deck-cost-king-county-wa-composite-vs-lumber", label: "What changes a deck estimate in King County" },
  { href: "/home-additions", label: "Home additions" },
  { href: "/aging-in-place", label: "Entries and aging-in-place remodeling" },
  { href: "/service-areas", label: "Service areas in King and Pierce Counties" },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.tubroconstruction.com/stairs#service",
  name: "Residential stair installation and remodeling",
  serviceType: "Residential stair installation and remodeling",
  description:
    "Residential stair installation and remodeling for homeowners in King and Pierce Counties, Washington, including stairs that are part of a deck, addition, or whole-home remodel.",
  url: "https://www.tubroconstruction.com/stairs",
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
        <section data-mega-section="hero" id="hero" className={styles.hero} aria-labelledby="stairs-heading">
          <div className={styles.rule} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Stair installation and remodeling</p>
            <h1 id="stairs-heading">Stairs planned as part of the project, not as an afterthought.</h1>
            <p className={styles.lede}>
              Tubro Construction designs and builds residential stairs for homeowners in King and Pierce Counties. Most stair work happens inside a deck, an addition, or a remodel, where the stair has to meet the rest of the house.
            </p>
            <EstimateActions cta="stairs-hero" />
            <p className={styles.note}>A submitted form starts an estimate inquiry. It does not reserve an appointment.</p>
          </div>
          <aside className={styles.office} aria-label="Service details">
            <p><span>Service</span>Residential stair installation and remodeling</p>
            <p><span>Serving</span>{BRAND.serviceArea}</p>
            <p><span>Company</span>Veteran-owned general contractor</p>
            <p><span>Office hours</span>{BRAND.hours}</p>
          </aside>
        </section>

        <section data-mega-section="scope" id="scope" className={styles.scope} aria-labelledby="scope-heading">
          <div className={styles.sectionIntro}>
            <h2 id="scope-heading">Where stair work fits</h2>
            <p>A stair is part of how you move through the property. The useful first question is where it has to go, not which finish to pick.</p>
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
            <p>You do not need a finished drawing. These details are enough to start a useful conversation.</p>
          </div>
          <ol className={styles.questionList}>
            {QUESTIONS.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
          <p className={styles.planningNote}>
            Guard and handrail requirements depend on the property and the local jurisdiction. Tubro confirms those requirements for the specific project rather than treating a general rule as approval.
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
          <h2 id="contact-heading">Planning a stair as part of a deck, addition, or remodel?</h2>
          <p>Tell us where the stair needs to go and what the rest of the project includes. The office follows up during business hours.</p>
          <EstimateActions cta="stairs-footer" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
