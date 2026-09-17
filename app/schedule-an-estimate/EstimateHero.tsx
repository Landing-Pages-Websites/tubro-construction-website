import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, MapPin, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import EstimateRequestForm from "./EstimateRequestForm";
import s from "./estimate.module.css";

export default function EstimateHero(): ReactElement {
  return <>
    <section id="hero" className={s.hero}>
      <div className={s.introduction}>
        <p className={s.pageLabel}>Your free remodeling estimate</p>
        <h1><span>Let’s build</span><br /><span>what’s next.</span></h1>
        <p className={s.lead}>A kitchen that brings everyone together. A bathroom that feels like a retreat. Tell us what you have in mind.</p>
        <a className={s.mobileStart} href="#form">Start your project request <ArrowDown size={18} /></a>
        <div className={s.location}><MapPin size={17} /><span>For homes in King &amp; Pierce Counties</span></div>
        <figure className={s.heroPhoto}>
          <Image src="/images/projects/1124003_kitchen%2002.jpeg" alt="Tubro kitchen remodel with navy and white cabinetry, a central island, and warm wood flooring" fill priority sizes="(max-width: 800px) 90vw, 43vw" />
          <figcaption><span>Room for your everyday.</span><a href="/recent-projects" aria-label="Explore Tubro's completed projects"><ArrowUpRight size={23} /></a></figcaption>
        </figure>
        <div className={s.heroContact}><span>Prefer a conversation?</span><a href={BRAND.phoneHref}><Phone size={16} />{BRAND.phoneDisplay}</a></div>
      </div>
      <EstimateRequestForm />
    </section>
    <section id="trust-bar" className={s.trust} aria-label="The Tubro approach">
      <p data-estimate-enter="heading">Your home is personal.<br /><strong>We treat it that way.</strong></p>
      <span data-estimate-enter="body" data-estimate-delay="70"><Check size={18} />Veteran-owned</span><span data-estimate-enter="body" data-estimate-delay="130"><Check size={18} />Established in 2010</span><span data-estimate-enter="body" data-estimate-delay="190"><Check size={18} />Free estimate requests</span>
    </section>
  </>;
}
