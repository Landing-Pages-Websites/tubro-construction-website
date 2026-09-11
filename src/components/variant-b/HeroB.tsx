import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND, HERO, WORK } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { RegMark } from "@/components/variant-b/RegMark";
import styles from "./UpperB.module.css";

export function HeroB(): ReactElement {
  return (
    <section id="hero" aria-labelledby="hero-b-heading" className={styles.hero}>
      <div className={styles.heroCopy}>
        <RegMark className={styles.topMark} /><RegMark className={styles.bottomMark} />
        <p className={styles.eyebrow}>{HERO.eyebrow}</p>
        <h1 id="hero-b-heading" className={styles.heroHeading}><span>Built around</span>{" "}<span>the way you</span>{" "}<span>want to live</span></h1>
        <p className={styles.heroBody}>{HERO.body}</p>
        <a href="#estimate" className={styles.cta}>{HERO.primaryCta}<ArrowRight size={18} aria-hidden="true" /></a>
        <a href={BRAND.phoneHref} className={styles.phone}><Phone size={18} aria-hidden="true" />{HERO.secondaryCta}</a>
        <div className={styles.photoNote}><RegMark /><div><p>{WORK.photoLabel}</p><p>King &amp; Pierce Counties</p></div></div>
      </div>
      <div className={styles.heroImage}>
        <Image src={IMAGES.hero.src} alt={IMAGES.hero.alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className={styles.image} />
        <span aria-hidden="true" className={styles.heroNumber}>01</span>
        <RegMark className={styles.imageTopMark} tone="ink" /><RegMark className={styles.imageBottomMark} tone="ink" />
      </div>
    </section>
  );
}
