import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PriorityCityLinks } from "@/components/shared/PriorityCityLinks";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BRAND } from "@/lib/content";
import { siteMetadata } from "@/lib/seo";
import styles from "./commercial.module.css";

const PATH = "/commercial";
const ESTIMATE_PATH = "/schedule-an-estimate";
const ESTIMATE_LABEL = "Request a commercial remodeling estimate";

export const metadata: Metadata = siteMetadata(
  "Commercial Remodeling & Interior Fit-Outs | Tubro Construction",
  "Veteran-owned Tubro Construction helps property owners and businesses in King and Pierce Counties plan commercial remodeling and interior fit-outs.",
  PATH,
);

/** Copy restates what the site already says about commercial work; no new claims. */
const INTRO =
  "Tubro Construction helps property owners and businesses across Western Washington plan commercial remodeling and interior fit-outs. We clarify the scope, plan the work, and move toward a clear estimate.";

const STEPS = [
  { title: "Tell us about the space", detail: "Share where the project is and what you’re considering for it." },
  { title: "We clarify the scope", detail: "We talk through what the work includes so everyone is planning the same project." },
  { title: "We plan the work", detail: "The work is planned around your operation, not the other way around." },
  { title: "You get a clear estimate", detail: "You see what the project involves before you decide on the next step." },
] as const;

const LINKS = [
  { href: "/recent-projects#commercial-remodeling", label: "Commercial remodeling on our projects page" },
  { href: "/general-contractor", label: "General contracting" },
  { href: "/service-areas", label: "Service areas in King and Pierce Counties" },
] as const;

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
      <SiteHeader />
      <main className={styles.page} id="main-content" tabIndex={-1}>
        <section data-mega-section="hero" id="hero" className={styles.hero} aria-labelledby="commercial-heading">
          <div className={styles.rule} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Commercial Remodeling &amp; Interior Fit-Outs</p>
            <h1 id="commercial-heading">Commercial projects, planned around your operation.</h1>
            <p className={styles.lede}>{INTRO}</p>
            <EstimateActions cta="commercial-hero" />
            <p className={styles.note}>A submitted form starts an estimate inquiry; it does not reserve an appointment.</p>
          </div>
          <aside className={styles.office} aria-label="Company details">
            <p><span>For</span>Property owners and businesses</p>
            <p><span>Serving</span>{BRAND.serviceArea}</p>
            <p><span>Company</span>Veteran-owned general contractor</p>
            <p><span>Office hours</span>{BRAND.hours}</p>
          </aside>
        </section>

        <section data-mega-section="how-it-works" id="how-it-works" className={styles.steps} aria-labelledby="steps-heading">
          <div className={styles.sectionIntro}>
            <h2 id="steps-heading">How a commercial project starts</h2>
            <p>From the first conversation to a clear estimate.</p>
          </div>
          <ol className={styles.stepList}>
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{step.title}</strong>
                  <span className={styles.stepDetail}>{step.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section data-mega-section="related" id="related" className={styles.related} aria-labelledby="related-heading">
          <div className={styles.sectionIntro}>
            <h2 id="related-heading">More from Tubro Construction</h2>
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
          <h2 id="contact-heading">Planning a commercial remodel or interior fit-out?</h2>
          <p>Tell us what you&rsquo;re considering and we&rsquo;ll discuss the right next step.</p>
          <EstimateActions cta="commercial-footer" />
        </section>
        <PriorityCityLinks />
      </main>
      <SiteFooter />
    </div>
  );
}
