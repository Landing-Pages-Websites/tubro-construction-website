import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND, HERO } from "@/lib/content";
import { IMAGES } from "@/lib/images";

const TICK_POSITIONS = [0, 20, 40, 60, 80, 100];

export function HeroA(): ReactElement {
  return (
    <section id="hero" aria-labelledby="hero-a-heading" className="relative bg-plaster">
      <div className="relative lg:min-h-[660px]">
        <div className="relative z-0 aspect-4/3 sm:aspect-16/9 lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[60%]">
          <Image
            src={IMAGES.hero.src}
            alt={IMAGES.hero.alt}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="relative z-10 bg-plaster lg:absolute lg:inset-y-0 lg:left-0 lg:w-[56%] lg:pr-32 lg:[clip-path:polygon(0_0,100%_0,calc(100%-9rem)_100%,0_100%)]">
          <div
            aria-hidden="true"
            className="absolute inset-y-8 left-5 hidden w-px bg-action/50 lg:block"
          >
            {TICK_POSITIONS.map((top) => (
              <span
                key={top}
                className="absolute -left-[5px] h-px w-[11px] bg-action/70"
                style={{ top: `${top}%` }}
              />
            ))}
          </div>

          <div className="px-5 py-12 sm:px-8 sm:py-16 lg:py-24 lg:pl-16 xl:pl-24">
            <p className="font-fjalla text-[13px] tracking-[0.08em] text-action uppercase">
              {HERO.eyebrow}
            </p>
            <h1
              id="hero-a-heading"
              className="mt-3 max-w-xl font-poppins text-[40px] leading-[1.02] font-extrabold tracking-tight text-balance text-ink sm:text-[52px] lg:text-[60px] lg:leading-[0.98]"
            >
              {HERO.heading}
            </h1>
            <p className="mt-5 max-w-md font-fjalla text-[15px] leading-relaxed text-ink/80">
              {HERO.body}
            </p>
            <div className="mt-8 flex flex-col items-start gap-5">
              <a
                href="#estimate"
                className="group inline-flex min-h-12 items-center gap-2.5 rounded-md bg-action px-6 py-3 font-poppins text-[15px] font-semibold text-white shadow-md shadow-action/25 transition-colors hover:bg-action-deep"
              >
                {HERO.primaryCta}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
              <a
                href={BRAND.phoneHref}
                className="inline-flex min-h-11 items-center gap-2 font-fjalla text-[15px] text-ink underline decoration-action/60 underline-offset-4 hover:text-action-deep"
              >
                <Phone className="size-4 text-action" aria-hidden="true" />
                {HERO.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
