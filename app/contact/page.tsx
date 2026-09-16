import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LeadForm } from "@/components/sections/LeadForm";
import { BRAND } from "@/lib/content";
import { loadManifest } from "@/lib/manifest";
import { formKeyForSlug } from "@/lib/form-keys";
import styles from "./contact.module.css";
import { ContactMotion } from "./ContactMotion";

const SLUG = "contact";

export const metadata: Metadata = designedPageMetadata(SLUG);

export default function Page(): ReactElement {
  const sections = loadManifest(SLUG).ordered_sections;
  const form = sections.find((section) => section.name === "contact-form")!;
  return (
    <div className={styles.site}>
      <SiteHeader />
      <main className={styles.page}>
        <ContactMotion />
        <section className={styles.desk} aria-labelledby="contact-heading">
          <div className={styles.topline}>
            <span>Contact Tubro Construction</span>
            <span aria-hidden="true">A good place to begin / 01</span>
          </div>
          <div className={styles.layout}>
            <div className={styles.intro}>
              <h1 id="contact-heading">Let’s talk<br />about <span>your<br className={styles.desktopBreak} /> project.</span></h1>
              <p className={styles.description}>A question, a room to rethink, or a bigger plan for your home. Tell us what you have in mind.</p>
              <div className={styles.contacts} id="02-contact-options">
                <a className={styles.phone} href={BRAND.phoneHref}>
                  <span className={styles.label}>Call the office</span>
                  <span>{BRAND.phoneDisplay}<ArrowUpRight aria-hidden="true" /></span>
                </a>
                <a className={styles.email} href={`mailto:${BRAND.email}`}>
                  <span className={styles.label}>Email project details</span>
                  <span>{BRAND.email}<ArrowUpRight aria-hidden="true" /></span>
                </a>
              </div>
              <div className={styles.note}>
                <span aria-hidden="true" className={styles.noteNumber}>01 —</span>
                <div className={styles.noteCopy}>
                  <p><strong>Start with what you know.</strong><br />You don’t need a finished plan to get in touch. Include your project city, the space you’d like to update, and what you’d like to change.</p>
                  <p>If you have a preferred timeframe or budget range, share those too. It’s fine if you’re still exploring your options.</p>
                  <p>Have photos, measurements, or inspiration? You can email them to <a href={`mailto:${BRAND.email}`}>the Tubro office</a> to give the team more context.</p>
                </div>
              </div>
            </div>
            <div className={styles.formPanel} id={form.id}>
              <div className={styles.formHeading}>
                <span className={styles.label}>Your project starts here</span>
                <span aria-hidden="true">↘</span>
              </div>
              <h2>Send a project question.</h2>
              <p className={styles.formDescription}>Share a few details so the office can follow up.</p>
              <LeadForm formKey={formKeyForSlug(SLUG)} pagePath="/contact" options={form.content.options} submitLabel={form.content.cta || "Send Message"} idPrefix={form.id} />
            </div>
          </div>
          <div className={styles.bottomline} aria-hidden="true"><span>Good work begins with a conversation.</span><span>Tubro / Washington</span></div>
        </section>
        <section className={styles.details} id="03-hours-service-area" aria-label="Office hours and service area">
          <div className={styles.detail}>
            <Clock3 aria-hidden="true" />
            <div><h2>Office hours</h2><p>Monday–Friday<br />7:00 a.m.–4:00 p.m.</p></div>
          </div>
          <div className={styles.detail}>
            <MapPin aria-hidden="true" />
            <div><h2>Built around your community</h2><p>King and Pierce Counties, Washington</p><Link href="/service-areas">Explore our service areas <ArrowUpRight aria-hidden="true" /></Link></div>
          </div>
          <div className={styles.detail}>
            <Phone aria-hidden="true" />
            <div><h2>Prefer to talk it through?</h2><p>Call the office during business hours.</p><a href={BRAND.phoneHref}>{BRAND.phoneDisplay} <ArrowUpRight aria-hidden="true" /></a></div>
          </div>
        </section>
        <nav className={styles.next} id="05-service-links" aria-label="Explore Tubro">
          <div>
            <span className={styles.label}>Contact Tubro Construction</span>
            <h2>Route visitors to the next useful page.</h2>
            <p className={styles.description}>Service links help visitors choose estimate, services, service areas, or recent projects.</p>
            <Link className={styles.nextEstimate} href="/schedule-an-estimate">Schedule a free estimate <ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className={styles.nextLinks}>
            <span className={styles.indexLabel}>Section index</span>
            {[
              { number: "01", title: "Schedule a Free Estimate", href: "/schedule-an-estimate" },
              { number: "02", title: "View Recent Projects", href: "/recent-projects" },
              { number: "03", title: "Browse Service Areas", href: "/service-areas" },
              { number: "04", title: "Explore Remodeling Services", href: "/general-contractor" },
            ].map((link) => <Link key={link.href} href={link.href}><span>{link.number}</span><span>{link.title}</span><ArrowUpRight aria-hidden="true" /></Link>)}
          </div>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
