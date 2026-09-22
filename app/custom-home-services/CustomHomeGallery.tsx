import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import type { ManifestSection } from "@/lib/manifest";
import type { SectionImage } from "@/lib/section-images";
import styles from "./custom-home.module.css";

export function CustomHomeGallery({ section, images }: { section: ManifestSection; images: SectionImage[] }): ReactElement {
  return (
    <section id={section.name} className={styles.gallery} aria-labelledby="gallery-heading">
      <div className={styles.galleryIntro}><p className={styles.eyebrow}>Framing. Materials. Finishes.</p><h2 id="gallery-heading">{section.content.headline}</h2><p className={styles.body}>Explore framing and exterior finishes from Tubro’s custom-home projects.</p><a className={styles.textLink} href="/recent-projects">{section.content.cta}<ArrowUpRight aria-hidden="true" /></a></div>
      <figure className={styles.materialPhoto}><div><Image src={images[1].src} alt={images[1].alt} fill sizes="(min-width: 761px) 37vw, 100vw" /></div><figcaption><span>{images[1].label}</span><span>Care in the details</span></figcaption></figure>
      <figure className={styles.deckPhoto}><div><Image src={images[0].src} alt={images[0].alt} fill sizes="(min-width: 761px) 55vw, 100vw" /></div><figcaption><span>{images[0].label}</span><span>The shape of the build</span></figcaption></figure>
      <svg className={styles.galleryRoute} viewBox="0 0 1200 220" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M0 10H570Q590 10 590 30V178Q590 200 612 200H1177V20" /><circle cx="0" cy="10" r="4" /><path d="M1167 20H1187M1177 10V30" /></svg>
      <p className={styles.galleryNote}>A closer look at the work.<br /><span>A little inspiration for what comes next.</span></p>
    </section>
  );
}
