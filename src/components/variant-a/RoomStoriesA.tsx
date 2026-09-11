import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import { ROOMS } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { Reveal } from "@/components/shared/Reveal";

export function RoomStoriesA(): ReactElement {
  return (
    <section id="rooms" aria-labelledby="rooms-a-heading" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
          <Reveal className="relative pl-6 lg:col-span-6 lg:pl-8">
            <span aria-hidden="true" className="absolute top-0 left-0 h-16 w-px bg-action" />
            <span aria-hidden="true" className="absolute top-0 left-0 h-px w-14 bg-action" />
            <h2
              id="rooms-a-heading"
              className="max-w-lg font-poppins text-[32px] leading-[1.08] font-bold tracking-tight text-ink lg:text-[40px]"
            >
              {ROOMS.heading}
            </h2>
            <p className="mt-4 max-w-md font-fjalla text-sm leading-relaxed text-ink/80">
              {ROOMS.intro}
            </p>
          </Reveal>

          <Reveal className="relative mt-10 lg:col-span-6 lg:row-span-2 lg:mt-0 lg:-ml-6" delayMs={80}>
            <div className="relative aspect-4/3 lg:aspect-3/4 lg:h-full">
              <Image
                src={IMAGES.roomsBathroom.src}
                alt={IMAGES.roomsBathroom.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative z-10 -mt-14 mr-6 max-w-xs border-l-2 border-action bg-white p-5 shadow-lg lg:absolute lg:top-[52%] lg:left-8 lg:mt-0 lg:mr-0">
              <h3 className="font-poppins text-xl font-semibold text-action-deep">
                {ROOMS.bathroom.title}
              </h3>
              <p className="mt-2 font-fjalla text-[13px] leading-relaxed text-ink/80">
                {ROOMS.bathroom.body}
              </p>
            </div>
          </Reveal>

          <Reveal className="relative mt-14 lg:col-span-6 lg:z-10 lg:mt-16 lg:-mr-6" delayMs={40}>
            <div className="relative aspect-4/3">
              <Image
                src={IMAGES.roomsKitchen.src}
                alt={IMAGES.roomsKitchen.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover shadow-xl"
              />
            </div>
            <div className="relative z-10 -mt-14 mr-6 max-w-xs border-l-2 border-action bg-white p-5 shadow-lg lg:absolute lg:bottom-8 lg:left-6 lg:mt-0 lg:mr-0">
              <h3 className="font-poppins text-xl font-semibold text-action-deep">
                {ROOMS.kitchen.title}
              </h3>
              <p className="mt-2 font-fjalla text-[13px] leading-relaxed text-ink/80">
                {ROOMS.kitchen.body}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="relative mt-14 flex justify-start lg:mt-16 lg:justify-end">
          <span
            aria-hidden="true"
            className="absolute top-1/2 right-full hidden h-px w-24 bg-action lg:block"
          />
          <a
            href="#services"
            className="group inline-flex min-h-12 items-center gap-2.5 rounded-md bg-action px-6 py-3 font-poppins text-[15px] font-semibold text-white shadow-md shadow-action/25 transition-colors hover:bg-action-deep"
          >
            {ROOMS.cta}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
