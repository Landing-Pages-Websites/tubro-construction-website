import type { ReactElement } from "react";
import { PROOF } from "@/lib/content";
import { Reveal } from "@/components/shared/Reveal";
import { RegMark } from "@/components/variant-b/RegMark";

const ROW_STAGGER = ["lg:ml-0", "lg:ml-[8%]", "lg:ml-[16%]", "lg:ml-[24%]", "lg:ml-[32%]"] as const;

export function ProofLedgerB(): ReactElement {
  return (
    <section id="trust-bar" aria-labelledby="proof-b-heading" className="relative overflow-hidden bg-mineral">
      <RegMark className="absolute top-1/2 left-4 hidden -translate-y-1/2 xl:block" tone="ink" />
      <RegMark className="absolute top-1/2 right-4 hidden -translate-y-1/2 xl:block" tone="ink" />

      <div className="mx-auto max-w-7xl items-center px-5 py-16 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-24">
        <div className="hidden lg:col-span-1 lg:flex lg:flex-col lg:items-center lg:gap-2">
          <span aria-hidden="true" className="h-6 w-px bg-ink/30" />
          <span className="font-fjalla text-base tracking-[0.1em] text-action">02</span>
          <span aria-hidden="true" className="h-6 w-px bg-ink/30" />
        </div>

        <Reveal className="border-ink/20 lg:col-span-5 lg:border-l lg:pl-8">
          <h2
            id="proof-b-heading"
            className="max-w-md font-fjalla text-[34px] leading-[1.04] text-ink uppercase lg:text-[44px]"
          >
            {PROOF.heading}
          </h2>
          <p className="mt-8 flex items-baseline gap-3 font-poppins text-sm leading-relaxed lg:mt-12">
            <span aria-hidden="true" className="inline-block h-px w-6 shrink-0 self-center bg-timber" />
            <span>
              <span className="font-medium text-ink">{PROOF.captionLead}</span>{" "}
              <span className="text-timber-ink">
                {PROOF.captionAccent} {PROOF.captionTail}
              </span>
            </span>
          </p>
        </Reveal>

        <Reveal className="relative mt-10 lg:col-span-6 lg:mt-0" delayMs={80}>
          <span
            aria-hidden="true"
            className="absolute -top-10 -bottom-10 left-[56%] hidden border-l border-dashed border-action/60 lg:block"
          />
          <ol className="space-y-2.5">
            {PROOF.points.map((point, index) => (
              <li
                key={point}
                className={`relative flex min-h-12 items-center gap-4 border border-ink/10 bg-white px-5 py-3 shadow-xs ${ROW_STAGGER[index]}`}
              >
                <span className="w-7 shrink-0 font-fjalla text-sm tracking-[0.06em] text-action">
                  0{index + 1}
                </span>
                <span aria-hidden="true" className="h-5 w-px bg-ink/20" />
                <span className="font-fjalla text-sm tracking-[0.07em] text-ink uppercase">
                  {point}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
