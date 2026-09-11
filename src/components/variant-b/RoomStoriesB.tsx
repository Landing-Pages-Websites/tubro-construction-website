import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import { ROOMS } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { Reveal } from "@/components/shared/Reveal";

const RULER_TICKS = 14;

export function RoomStoriesB(): ReactElement {
  return (
    <section id="rooms" aria-labelledby="rooms-b-heading" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-10 lg:py-24">
        <Reveal className="lg:col-span-4">
          <h2
            id="rooms-b-heading"
            className="max-w-xs font-fjalla text-[40px] leading-[0.98] text-ink uppercase lg:text-[52px]"
          >
            {ROOMS.heading}
          </h2>
          <p className="mt-6 max-w-sm font-poppins text-sm leading-relaxed text-ink/80">
            {ROOMS.intro}
          </p>
          <a
            href="#services"
            className="group mt-9 inline-flex min-h-12 items-center gap-2.5 rounded-sm bg-action px-6 py-3 font-fjalla text-sm tracking-[0.08em] text-white uppercase transition-colors hover:bg-action-deep"
          >
            {ROOMS.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </Reveal>

        <div className="mt-12 space-y-10 lg:col-span-7 lg:mt-0">
          <Reveal delayMs={40}>
            <figure className="border border-ink/10 bg-white shadow-sm">
              <div className="relative aspect-16/9">
                <Image
                  src={IMAGES.roomsKitchen.src}
                  alt={IMAGES.roomsKitchen.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex flex-col gap-1.5 border-t border-ink/10 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                <span className="shrink-0 font-fjalla text-sm tracking-[0.1em] text-timber-ink uppercase">
                  {ROOMS.kitchen.title}
                </span>
                <span aria-hidden="true" className="hidden h-6 w-px bg-ink/15 sm:block" />
                <span className="font-poppins text-[13px] leading-relaxed text-ink/75">
                  {ROOMS.kitchen.body}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delayMs={80}>
            <figure className="border border-ink/10 bg-white shadow-sm">
              <div className="relative aspect-16/9">
                <Image
                  src={IMAGES.roomsBathroom.src}
                  alt={IMAGES.roomsBathroom.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex flex-col gap-1.5 border-t border-ink/10 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                <span className="shrink-0 font-fjalla text-sm tracking-[0.1em] text-timber-ink uppercase">
                  {ROOMS.bathroom.title}
                </span>
                <span aria-hidden="true" className="hidden h-6 w-px bg-ink/15 sm:block" />
                <span className="font-poppins text-[13px] leading-relaxed text-ink/75">
                  {ROOMS.bathroom.body}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div
          aria-hidden="true"
          className="hidden lg:col-span-1 lg:flex lg:flex-col lg:items-center lg:justify-between lg:py-2"
        >
          <span className="font-fjalla text-xs tracking-[0.1em] text-action">02</span>
          <span className="font-fjalla text-[88px] leading-none text-ink">03</span>
          <span className="flex flex-1 flex-col items-center justify-center gap-2 py-6">
            {Array.from({ length: RULER_TICKS }, (_, index) => (
              <span
                key={index}
                className={`h-px bg-ink/30 ${index % 4 === 0 ? "w-4" : "w-2"}`}
              />
            ))}
          </span>
          <span className="font-fjalla text-xs tracking-[0.1em] text-action">04</span>
        </div>
      </div>
    </section>
  );
}
