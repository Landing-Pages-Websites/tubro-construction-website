import Image from "next/image";
import { ArrowDown, ArrowRight, Phone } from "lucide-react";
import type { ReactElement } from "react";
import type { ManifestSection } from "@/lib/manifest";
import type { SectionImage } from "@/lib/section-images";
import { BRAND } from "@/lib/content";
import { HouseDrawing } from "./HouseDrawing";
import styles from "./custom-home.module.css";

export function CustomHomeHero({ section, images }: { section: ManifestSection; images: SectionImage[] }): ReactElement {
  return (
    <>
      <section id="hero" className={styles.hero} aria-labelledby="custom-home-heading">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{section.content.eyebrow}</p>
          <h1 id="custom-home-heading">A Custom Home<br /><span>Shaped <br />Around You.</span></h1>
          <p className={styles.heroBody}>{section.content.body}</p>
          <a className={styles.button} href="#estimate-cta">{section.content.cta}<ArrowRight aria-hidden="true" /></a>
          <a className={styles.phone} href={BRAND.phoneHref}><Phone aria-hidden="true" />{section.content.secondary_cta}</a>
          <a className={styles.explore} href="#planning-design-build"><ArrowDown aria-hidden="true" /> Explore the possibilities</a>
        </div>
        <div className={styles.heroVisual}>
          <figure className={styles.heroPhoto}><Image src={images[0].src} alt={images[0].alt} fill priority sizes="(min-width: 901px) 56vw, 100vw" /><figcaption>{images[0].label}<span>Tubro project portfolio</span></figcaption></figure>
          <div className={styles.elevation}><p>A place to begin.</p><HouseDrawing /><span>Concept elevation · Your home starts with your ideas</span></div>
          <svg className={styles.heroRoute} viewBox="0 0 660 750" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M14 14H644V605Q644 627 622 627H510V718H398" /><path d="M5 14H23M14 5V23M634 14H654M644 4V24" /><circle cx="398" cy="718" r="4" /></svg>
        </div>
      </section>
      <div id="trust-bar" className={styles.promiseBar}><span>Thoughtfully planned. Carefully built.</span><ul>{section.content.bullets.map(item => <li key={item}><span aria-hidden="true" />{item}</li>)}</ul></div>
    </>
  );
}
