import type { ReactElement } from "react";
import { PROCESS } from "@/lib/content";
import { Reveal } from "@/components/shared/Reveal";
import { RegMark } from "@/components/variant-b/RegMark";

const CARD_STAGGER = ["lg:mr-[36%]", "lg:mx-[12%]", "lg:ml-[24%] lg:mr-[6%]", "lg:ml-[36%]"] as const;

export function ProcessB(): ReactElement {
  return (
    <section id="how-it-works" aria-labelledby="process-b-heading" className="relative overflow-hidden bg-sage">
      <RegMark className="absolute top-10 left-8 hidden lg:block" tone="ink" />
      <RegMark className="absolute bottom-10 left-1/3 hidden lg:block" tone="ink" />
      <RegMark className="absolute right-10 bottom-16 hidden lg:block" tone="ink" />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-24">
        <Reveal className="lg:col-span-4">
          <h2
            id="process-b-heading"
            className="max-w-xs font-fjalla text-[48px] leading-[0.95] text-ink uppercase lg:text-[64px]"
          >
            {PROCESS.heading}
          </h2>
        </Reveal>

        <Reveal className="relative mt-12 lg:col-span-8 lg:mt-0" delayMs={60}>
          <span
            aria-hidden="true"
            className="absolute -top-8 -bottom-8 left-1/2 hidden border-l-2 border-dashed border-action/60 lg:block"
          />
          <ol className="flex flex-col gap-5 lg:flex-col-reverse lg:gap-7">
            {PROCESS.steps.map((step, index) => (
              <li
                key={step.number}
                className={`relative flex items-stretch gap-5 border border-ink/10 bg-white px-5 py-5 shadow-md sm:px-6 ${CARD_STAGGER[index]}`}
              >
                <RegMark className="absolute -top-2 -left-2 hidden lg:block" />
                <span className="self-center font-fjalla text-[44px] leading-none text-action sm:text-[52px]">
                  {step.number}
                </span>
                <span aria-hidden="true" className="border-l border-dashed border-ink/25" />
                <span className="flex flex-col justify-center">
                  <h3 className="font-poppins text-base leading-snug font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-xs font-poppins text-[13px] leading-relaxed text-ink/75">
                    {step.body}
                  </p>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
