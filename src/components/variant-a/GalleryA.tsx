import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import { WORK } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { Reveal } from "@/components/shared/Reveal";

export function GalleryA(): ReactElement {
  return (
    <section id="work" aria-labelledby="work-a-heading" className="a-gallery on-dark bg-carbon text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-24">
        <Reveal className="lg:col-span-4">
          <h2
            id="work-a-heading"
            className="max-w-sm font-poppins text-[34px] leading-[1.08] font-bold tracking-tight lg:text-[40px]"
          >
            {WORK.heading}
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-white/40" />
            <p className="font-fjalla text-[11px] tracking-[0.14em] text-white/60 uppercase">
              {WORK.photoLabel}
            </p>
          </div>
          <p className="mt-4 max-w-xs font-fjalla text-sm leading-relaxed text-white/75">
            {WORK.body}
          </p>
          <a
            href="#work-gallery"
            className="group mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-md bg-action px-6 py-3 font-fjalla text-[15px] text-white transition-colors hover:bg-action-deep"
          >
            {WORK.cta}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </Reveal>

        <Reveal className="mt-12 lg:col-span-8 lg:mt-0" delayMs={80}>
          <div id="work-gallery" tabIndex={-1} className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="relative aspect-3/4 sm:row-span-2 sm:aspect-auto sm:min-h-full">
              <Image
                src={IMAGES.workBathroomDark.src}
                alt={IMAGES.workBathroomDark.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-4/3">
              <Image
                src={IMAGES.workBathroomLight.src}
                alt={IMAGES.workBathroomLight.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative aspect-square">
                <Image
                  src={IMAGES.workKitchen.src}
                  alt={IMAGES.workKitchen.alt}
                  fill
                  sizes="(min-width: 1024px) 16vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square">
                <Image
                  src={IMAGES.workDeck.src}
                  alt={IMAGES.workDeck.alt}
                  fill
                  sizes="(min-width: 1024px) 16vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
