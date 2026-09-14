import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND, HERO } from "@/lib/content";
import { IMAGES } from "@/lib/images";

export function HeroA(): ReactElement {
  return (
    <section id="hero" aria-labelledby="hero-a-heading" className="a-hero">
      <div data-motion-hero="image" className="a-hero-photo"><Image src={IMAGES.hero.src} alt={IMAGES.hero.alt} fill priority sizes="(min-width: 768px) 65vw, 100vw" className="object-cover" /></div>
      <div className="a-hero-foreground" aria-hidden="true" />
      <div className="a-ruler" aria-hidden="true">{[4,20,38,58,70,87,91].map(top => <i key={top} style={{top:`${top}%`}} />)}</div>
      <div className="a-hero-copy">
        <p data-motion-hero="copy" className="a-eyebrow">{HERO.eyebrow}</p>
        <h1 data-motion-hero="copy" id="hero-a-heading"><span>Built Around</span><span>the Way You</span><span>Want to Live</span></h1>
        <p data-motion-hero="copy" className="a-hero-body">{HERO.body}</p>
        <div data-motion-hero="cta" className="a-hero-actions">
          <a href="#estimate" className="a-button">{HERO.primaryCta}<ArrowRight aria-hidden="true" /></a>
          <a href={BRAND.phoneHref} className="a-phone"><Phone aria-hidden="true" />{HERO.secondaryCta}</a>
        </div>
      </div>
    </section>
  );
}
