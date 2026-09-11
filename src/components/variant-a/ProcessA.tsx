import type { ReactElement } from "react";
import { PROCESS } from "@/lib/content";
import { Reveal } from "@/components/shared/Reveal";

export function ProcessA(): ReactElement {
  return (
    <section id="how-it-works" aria-labelledby="process-a-heading" className="relative overflow-hidden bg-sage">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <Reveal>
          <h2
            id="process-a-heading"
            className="max-w-sm font-poppins text-[38px] leading-[1.02] font-extrabold tracking-tight text-balance text-ink lg:text-[54px]"
          >
            {PROCESS.heading}
          </h2>
        </Reveal>

        <Reveal className="relative mt-12 lg:mt-24" delayMs={60}>
          <div aria-hidden="true" className="absolute top-0 right-0 left-0 hidden h-px bg-action lg:block" />
          <div aria-hidden="true" className="absolute right-0 -top-20 hidden h-20 w-px bg-action lg:block">
            <span className="absolute -top-1 -left-[3.5px] size-2 rounded-full bg-action" />
          </div>
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-2 left-[5px] w-px bg-action lg:hidden"
          />
          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {PROCESS.steps.map((step) => (
              <li key={step.number} className="relative pl-8 lg:pt-12 lg:pl-0">
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-action bg-sage lg:hidden"
                />
                <span aria-hidden="true" className="absolute top-0 left-1 hidden h-9 w-px bg-action lg:block" />
                <span
                  aria-hidden="true"
                  className="absolute top-9 left-[0.5px] hidden size-2 -translate-x-[3px] rounded-full bg-action lg:block"
                />
                <p className="font-fjalla text-[56px] leading-none text-action lg:text-[64px]">
                  {step.number}
                </p>
                <h3 className="mt-3 max-w-[220px] font-poppins text-lg leading-snug font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[240px] font-fjalla text-sm leading-relaxed text-ink/80">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
