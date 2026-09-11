import type { ReactElement } from "react";
import { PROOF } from "@/lib/content";
import { Reveal } from "@/components/shared/Reveal";

export function ProofRailA(): ReactElement {
  return (
    <section id="trust-bar" aria-labelledby="proof-a-heading" className="a-proof relative bg-plaster">
      <div className="mx-auto max-w-7xl items-center px-5 py-14 sm:px-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-14 lg:py-20">
        <Reveal className="relative pl-6 lg:pl-8">
          <span
            aria-hidden="true"
            className="absolute top-[-14px] bottom-[-14px] left-0 w-px bg-action"
          />
          <span aria-hidden="true" className="absolute top-[-14px] left-0 h-px w-10 bg-action" />
          <span aria-hidden="true" className="absolute bottom-[-14px] left-0 h-px w-10 bg-action" />
          <h2
            id="proof-a-heading"
            className="max-w-xs font-poppins text-[28px] leading-snug font-bold tracking-tight text-ink lg:text-[32px]"
          >
            {PROOF.heading}
          </h2>
        </Reveal>

        <Reveal className="mt-10 lg:mt-0" delayMs={80}>
          <ul className="hidden items-end justify-between gap-4 lg:flex">
            {PROOF.points.map((point) => (
              <li key={point} className="flex max-w-[130px] flex-col items-center text-center">
                <span className="mb-2 font-fjalla text-[11px] leading-tight tracking-[0.06em] text-ink uppercase">
                  {point}
                </span>
                <span aria-hidden="true" className="h-3 w-px bg-action" />
                <span aria-hidden="true" className="z-10 -mb-[5px] size-2.5 rounded-full bg-action" />
              </li>
            ))}
          </ul>
          <div aria-hidden="true" className="hidden h-px bg-ink/25 lg:block" />

          <ul className="space-y-3 border-l-2 border-action pl-5 lg:hidden">
            {PROOF.points.map((point) => (
              <li key={point} className="relative font-fjalla text-[13px] tracking-[0.06em] text-ink uppercase">
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 -left-[26px] size-2 rounded-full bg-action"
                />
                {point}
              </li>
            ))}
          </ul>

          <p className="mt-8 font-fjalla text-xs tracking-[0.06em] text-ink uppercase lg:mt-6">
            {PROOF.captionLead}{" "}
            <span className="text-action-deep">{PROOF.captionAccent}</span> {PROOF.captionTail}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
