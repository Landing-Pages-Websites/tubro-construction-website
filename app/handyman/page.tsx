import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { BRAND } from "@/lib/content";
import { siteMetadata } from "@/lib/seo";
import styles from "./handyman.module.css";

const PATH = "/handyman";
const CONTACT_PATH = "/contact";

export const metadata: Metadata = siteMetadata(
  "Handyman Projects | Tubro Construction",
  "Have a smaller home project in mind? Tell Tubro Construction what needs attention and where you are, and our team can discuss the scope and next steps.",
  PATH,
);

const DETAILS = [
  { title: "What needs attention", body: "A short description of the project, in your own words. A rough idea is enough to start the conversation." },
  { title: "Where you are", body: `The city your home is in. We work with homeowners across ${BRAND.serviceArea}.` },
  { title: "Photos, if you have them", body: "Pictures of the area help the team understand the project before following up." },
] as const;

const HOLIDAY_SPECIAL = [
  { title: "Trip fee", body: "Our $250 trip fee is waived." },
  { title: "First hour", body: "$150 for the first hour, plus materials." },
  { title: "Projects like", body: "Small repairs, drywall patching, fixture or door installs, and deck or fence repairs." },
] as const;

export default function Page(): ReactElement {
  return (
    <div className={styles.site}>
      <SiteHeader />
      <main className={styles.page} id="main-content" tabIndex={-1}>
        <section data-mega-section="hero" id="hero" className={styles.hero} aria-labelledby="handyman-heading">
          <div className={styles.rule} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Handyman projects</p>
            <h1 id="handyman-heading">Have a smaller home project in mind?</h1>
            <p className={styles.lede}>Tell us what needs attention and where you are. Our team can discuss the scope and next steps.</p>
            <div className={styles.actions}>
              <Link data-mega-cta="handyman-hero-contact" className={styles.primary} href={CONTACT_PATH}>
                Tell us about your project <ArrowUpRight aria-hidden="true" />
              </Link>
              <PhoneCta />
            </div>
          </div>
          <aside className={styles.office} aria-label="Office details">
            <p><span>Office hours</span>{BRAND.hours}</p>
            <p><span>Serving</span>{BRAND.region}</p>
          </aside>
        </section>

        <section data-mega-section="holiday-special" id="holiday-special" className={styles.details} aria-labelledby="holiday-special-heading">
          <div className={styles.detailsIntro}>
            <h2 id="holiday-special-heading">Holiday Special</h2>
            <p>Have a few smaller items on your list? Here’s our Holiday Special for handyman projects.</p>
          </div>
          <dl className={styles.detailList}>
            {HOLIDAY_SPECIAL.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section data-mega-section="inquiry-details" id="what-to-share" className={styles.details} aria-labelledby="details-heading">
          <div className={styles.detailsIntro}>
            <h2 id="details-heading">What to include in your message</h2>
            <p>You don’t need a finished plan. A few details help the office understand the project and follow up.</p>
          </div>
          <dl className={styles.detailList}>
            {DETAILS.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section data-mega-section="contact" id="contact" className={styles.contact} aria-labelledby="contact-heading">
          <h2 id="contact-heading">Ready to tell us about it?</h2>
          <p>Send a project question through the contact page, or call the office during business hours.</p>
          <div className={styles.actions}>
            <Link data-mega-cta="handyman-footer-contact" className={styles.primary} href={CONTACT_PATH}>
              Tell us about your project <ArrowUpRight aria-hidden="true" />
            </Link>
            <a className={styles.secondary} href={`mailto:${BRAND.email}`}>Email {BRAND.email}</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
