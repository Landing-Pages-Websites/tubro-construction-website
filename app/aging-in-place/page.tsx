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

const INTRO =
  "Most people don\u2019t want to leave their home \u2014 they just need it to work for them again. Tubro Construction designs and builds accessibility upgrades across King and Pierce County that make everyday life easier and safer: step-free showers you can roll into, doors and hallways wide enough for a walker or wheelchair, and entries without stairs. One licensed team, clear pricing, and an assigned project manager from first visit to final walkthrough.";

const FUNDING =
  "Many of our clients pay for this work with help from WA Cares, Medicaid (COPES), VA home-improvement grants (HISA/SAH), or King County housing repair programs.";

const VISIT =
  "30-minute visit: we walk the home with you, flag the fall and access risks, and leave a written, itemized quote. No pressure, no obligation.";

const SERVICES = [
  { title: "Roll-in & curbless showers", detail: "Zero-threshold entries, grab bars, handheld showerheads, built-in seating" },
  { title: "Walk-in tubs & tub-to-shower conversions" },
  { title: "Door widening", detail: "To a full 36\u2033 clear opening for wheelchairs and walkers" },
  { title: "Hallway widening & layout changes", detail: "For turning radius and circulation" },
  { title: "Ramps & zero-step entries", detail: "Permanent wood/concrete or modular aluminum" },
  { title: "Grab bars, railings & lever handles", detail: "Throughout the home" },
  { title: "Accessible kitchens", detail: "Lowered/varied counter heights, pull-out storage, clear floor space" },
  { title: "Improved lighting & flooring transitions", detail: "To cut fall risk" },
] as const satisfies readonly { title: string; detail?: string }[];

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
            <p className={styles.lede}>{INTRO}</p>
            <div className={styles.actions}>
              <AssessmentCta cta="aging-in-place-hero-call" />
            </div>
            <p className={styles.visit}>{VISIT}</p>
          </div>
          <aside className={styles.office} aria-label="Office details">
            <p><span>Office hours</span>{BRAND.hours}</p>
            <p><span>Serving</span>King and Pierce County</p>
          </aside>
        </section>

        <section data-mega-section="services" id="services" className={styles.services} aria-labelledby="services-heading">
          <div className={styles.servicesIntro}>
            <h2 id="services-heading">Accessibility remodeling services</h2>
            <p>{FUNDING}</p>
          </div>
          <ul className={styles.serviceList}>
            {SERVICES.map((service) => (
              <li key={service.title}>
                <Check aria-hidden="true" />
                <span>
                  {service.title}
                  {"detail" in service ? <span className={styles.serviceDetail}>{service.detail}</span> : null}
                </span>
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
          <p>{VISIT}</p>
          <div className={styles.actions}>
            <AssessmentCta cta="aging-in-place-footer-call" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
