import Image from "next/image";
import { Check } from "lucide-react";
import type { ReactElement } from "react";
import styles from "./LowerB.module.css";
import { CAPABILITIES } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { Reveal } from "@/components/shared/Reveal";

const DASH_COUNT = 18;

const PHOTO_TAGS = {
  paint: "Exterior paint",
  deck: "Decks & outdoor living",
  stain: "Exterior stain & materials",
} as const;

export function CapabilitiesB(): ReactElement {
  return (
    <section id="services" aria-labelledby="capabilities-b-heading" className={styles.capabilities}>
      <div aria-hidden="true" className={styles.capSurvey}><span>04</span></div>

      <div className={styles.capInner}>
        <p className="font-fjalla text-xs tracking-[0.14em] uppercase">
          <span className="text-action">04</span>
          <span className="text-ink/60"> / Capabilities</span>
        </p>

        <div className={styles.capGrid}>
          <Reveal className={styles.capCopy}>
            <h2
              id="capabilities-b-heading"
              className="max-w-md font-fjalla text-[34px] leading-[1.02] text-ink uppercase lg:text-[44px]"
            >
              <span>One experienced team</span>{" "}<span>for the whole project.</span>
            </h2>
            <p className="mt-5 max-w-md font-poppins text-sm leading-relaxed text-ink/80">
              {CAPABILITIES.body}
            </p>
            <ul className="mt-8 space-y-3">
              {CAPABILITIES.items.map((item, index) => (
                <li
                  key={item}
                  className="flex min-h-13 items-center gap-4 border border-ink/10 bg-white px-4 py-3 shadow-xs"
                >
                  <span className="inline-flex size-7 shrink-0 items-center justify-center border border-action/50 font-fjalla text-xs text-action">
                    0{index + 1}
                  </span>
                  <span className="flex-1 font-poppins text-sm font-medium text-ink">{item}</span>
                  <Check className="size-5 shrink-0 text-action" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className={styles.collage} delayMs={80}>
            <div className={styles.collageGrid}>
              <figure className="relative col-span-12 lg:col-span-8">
                <div className="relative aspect-4/3">
                  <Image
                    src={IMAGES.capExteriorPaint.src}
                    alt={IMAGES.capExteriorPaint.alt}
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="absolute bottom-3 left-3 bg-timber-ink px-2.5 py-1 font-fjalla text-[10px] tracking-[0.12em] text-white uppercase">
                  {PHOTO_TAGS.paint}
                </figcaption>
              </figure>

              <figure className="relative col-span-6 lg:col-span-4 lg:mt-16">
                <div className="relative aspect-3/4">
                  <Image
                    src={IMAGES.capExteriorStain.src}
                    alt={IMAGES.capExteriorStain.alt}
                    fill
                    sizes="(min-width: 1024px) 19vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="absolute bottom-3 left-3 bg-timber-ink px-2.5 py-1 font-fjalla text-[10px] tracking-[0.12em] text-white uppercase">
                  {PHOTO_TAGS.stain}
                </figcaption>
              </figure>

              <figure className="relative col-span-6 lg:col-span-8 lg:-mt-14">
                <div className="relative aspect-3/4 lg:aspect-16/9">
                  <Image
                    src={IMAGES.capDeck.src}
                    alt={IMAGES.capDeck.alt}
                    fill
                    sizes="(min-width: 1024px) 38vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="absolute bottom-3 left-3 bg-timber-ink px-2.5 py-1 font-fjalla text-[10px] tracking-[0.12em] text-white uppercase">
                  {PHOTO_TAGS.deck}
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
