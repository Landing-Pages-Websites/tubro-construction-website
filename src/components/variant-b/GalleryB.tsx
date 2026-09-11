import Image from "next/image";
import { ArrowRight, Crop, Target } from "lucide-react";
import type { ReactElement } from "react";
import styles from "./LowerB.module.css";
import { WORK } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { Reveal } from "@/components/shared/Reveal";

const CONTACT_SHEET = [
  IMAGES.workBathroomDark,
  IMAGES.workBathroomLight,
  IMAGES.workKitchen,
  IMAGES.workDeck,
] as const;

export function GalleryB(): ReactElement {
  return (
    <section id="work" aria-labelledby="work-b-heading" className={`on-dark ${styles.gallery}`}>
      <div className={styles.galleryInner}>
        <Reveal className={styles.galleryCopy}>
          <p className="font-fjalla text-xl tracking-[0.1em] text-action">06</p>
          <h2
            id="work-b-heading"
            className="mt-4 max-w-sm font-fjalla text-[32px] leading-[1.05] uppercase lg:text-[42px]"
          >
            <span>See what we&apos;ve built</span>{" "}<span>across western</span>{" "}<span>Washington.</span>
          </h2>
          <p className="mt-5 max-w-xs font-poppins text-sm leading-relaxed text-white/75">
            {WORK.body}
          </p>
          <a
            href="#work-gallery"
            className="group mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-sm bg-action px-6 py-3 font-poppins text-sm font-medium text-white transition-colors hover:bg-action-deep"
          >
            {WORK.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <ul className="mt-10 space-y-3.5">
            <li className="flex items-center gap-3 font-fjalla text-[11px] tracking-[0.14em] text-white/80 uppercase">
              <Crop className="size-4 text-action" aria-hidden="true" />
              {WORK.photoLabel}
            </li>
            <li className="flex items-center gap-3 font-fjalla text-[11px] tracking-[0.14em] text-white/80 uppercase">
              <Target className="size-4 text-action" aria-hidden="true" />
              RealWork Labs experience
            </li>
          </ul>
        </Reveal>

        <Reveal className={styles.galleryPhotos} delayMs={80}>
          <div id="work-gallery" tabIndex={-1} className={styles.contactSheet}>
            {CONTACT_SHEET.map((photo) => (
              <figure key={photo.alt} className="bg-white p-2 pb-0 shadow-md">
                <div className="relative aspect-4/3">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="flex items-center gap-2 px-1 py-2.5">
                  <span aria-hidden="true" className="inline-block size-2.5 bg-timber-ink" />
                  <span className="font-fjalla text-[10px] tracking-[0.16em] text-ink uppercase">
                    Authentic project photo
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
