import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND, HERO, WORK } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { RegMark } from "@/components/variant-b/RegMark";

export function HeroB(): ReactElement {
  return (
    <section id="hero" aria-labelledby="hero-b-heading" className="relative bg-white">
      <div className="lg:grid lg:min-h-[660px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative flex flex-col px-5 py-12 sm:px-8 lg:py-16 lg:pr-10 lg:pl-14">
          <RegMark className="absolute top-5 left-5 hidden lg:block" />
          <RegMark className="absolute bottom-5 left-5 hidden lg:block" />

          <p className="font-fjalla text-xs tracking-[0.1em] text-action uppercase">
            {HERO.eyebrow}
          </p>
          <h1
            id="hero-b-heading"
            className="mt-4 font-fjalla text-[44px] leading-[0.95] tracking-[0.01em] text-balance text-ink uppercase sm:text-[56px] lg:text-[64px]"
          >
            {HERO.heading}
          </h1>
          <span aria-hidden="true" className="mt-6 block h-px w-12 bg-ink/30" />
          <p className="mt-5 max-w-sm font-poppins text-sm leading-relaxed text-ink/80">
            {HERO.body}
          </p>
          <div className="mt-8 flex flex-col items-start gap-5">
            <a
              href="#estimate"
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-sm bg-action px-6 py-3 font-fjalla text-sm tracking-[0.08em] text-white uppercase transition-colors hover:bg-action-deep"
            >
              {HERO.primaryCta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a
              href={BRAND.phoneHref}
              className="inline-flex min-h-11 items-center gap-2 font-poppins text-sm font-medium text-ink underline decoration-ink/40 underline-offset-4 hover:text-action-deep"
            >
              <Phone className="size-4 text-action" aria-hidden="true" />
              {HERO.secondaryCta}
            </a>
          </div>

          <div className="mt-12 lg:mt-auto lg:pt-12">
            <p className="flex items-center gap-2.5 font-fjalla text-[11px] tracking-[0.14em] text-ink/70 uppercase">
              <RegMark />
              {WORK.photoLabel}
            </p>
            <p className="mt-1.5 pl-[26px] font-fjalla text-[11px] tracking-[0.14em] text-timber-ink uppercase">
              King &amp; Pierce Counties
            </p>
          </div>
        </div>

        <div className="relative aspect-4/3 lg:aspect-auto">
          <Image
            src={IMAGES.hero.src}
            alt={IMAGES.hero.alt}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[68%] hidden w-px bg-action/80 lg:block"
          />
          <span
            aria-hidden="true"
            className="absolute top-6 right-4 font-fjalla text-[96px] leading-none text-white/85 select-none sm:text-[130px] lg:top-10 lg:text-[180px]"
          >
            01
          </span>
        </div>
      </div>
    </section>
  );
}
