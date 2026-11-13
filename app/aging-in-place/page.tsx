import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { Check, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BRAND } from "@/lib/content";
import { SERVICE_CITIES } from "@/lib/routes";
import { siteMetadata } from "@/lib/seo";
import styles from "./aging-in-place.module.css";

const PATH = "/aging-in-place";
const CTA_LEAD = "Book a free in-home safety assessment";

export const metadata: Metadata = siteMetadata(
  "Aging in Place & Accessibility Remodeling | Tubro Construction",
  "Aging in place and accessibility remodeling in King and Pierce County: curbless showers, door and hallway widening, ramps, grab bars and accessible kitchens.",
  PATH,
);

const SERVICES = [
  "Roll-in and curbless showers",
  "Walk-in tubs and tub-to-shower conversions",
  "Door widening to a 36″ clear opening",
  "Hallway widening",
  "Ramps and zero-step entries",
  "Grab bars, railings and lever handles",
  "Accessible kitchens",
  "Improved lighting and flooring transitions",
] as const;

function AssessmentCta({ cta }: { cta: string }): ReactElement {
  return (
    <a data-mega-cta={cta} className={styles.primary} href={BRAND.phoneHref}>
      <Phone aria-hidden="true" />
      <span>
        {CTA_LEAD}
        <span className={styles.ctaPhone}>Call {BRAND.phoneDisplay}</span>
      </span>
    </a>
  );
}

export default function Page(): ReactElement {
  return (
    <div className={styles.site}>
      <SiteHeader />
      <main className={styles.page} id="main-content" tabIndex={-1}>
        <section data-mega-section="hero" id="hero" className={styles.hero} aria-labelledby="aging-in-place-heading">
          <div className={styles.rule} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Aging in Place &amp; Accessibility Remodeling</p>
            <h1 id="aging-in-place-heading">Stay in the home you love — safely, and on your terms.</h1>
            <p className={styles.lede}>
              {CTA_LEAD}, call {BRAND.phoneDisplay}. We serve homeowners across {BRAND.serviceArea}.
            </p>
            <div className={styles.actions}>
              <AssessmentCta cta="aging-in-place-hero-call" />
            </div>
          </div>
          <aside className={styles.office} aria-label="Office details">
            <p><span>Office hours</span>{BRAND.hours}</p>
            <p><span>Serving</span>King and Pierce County</p>
          </aside>
        </section>

        <section data-mega-section="services" id="services" className={styles.services} aria-labelledby="services-heading">
          <div className={styles.servicesIntro}>
            <h2 id="services-heading">Accessibility remodeling services</h2>
          </div>
          <ul className={styles.serviceList}>
            {SERVICES.map((service) => (
              <li key={service}>
                <Check aria-hidden="true" />
                {service}
              </li>
            ))}
          </ul>
        </section>

        <section data-mega-section="service-area" id="service-area" className={styles.area} aria-labelledby="area-heading">
          <div className={styles.servicesIntro}>
            <h2 id="area-heading">Serving King and Pierce County</h2>
            <p>The same cities we cover for all of our remodeling work.</p>
          </div>
          <ul className={styles.cityList}>
            {SERVICE_CITIES.map((route) => (
              <li key={route.citySlug}>
                <Link prefetch={false} href={route.path}>{route.city}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section data-mega-section="contact" id="contact" className={styles.contact} aria-labelledby="contact-heading">
          <h2 id="contact-heading">{CTA_LEAD}</h2>
          <p>Call {BRAND.phoneDisplay} during office hours.</p>
          <div className={styles.actions}>
            <AssessmentCta cta="aging-in-place-footer-call" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
