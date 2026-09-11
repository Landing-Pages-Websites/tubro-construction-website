import type { ReactElement } from "react";
import styles from "./LowerB.module.css";
import { PROCESS } from "@/lib/content";
import { Reveal } from "@/components/shared/Reveal";
import { RegMark } from "@/components/variant-b/RegMark";


export function ProcessB(): ReactElement {
  return (
    <section id="how-it-works" aria-labelledby="process-b-heading" className={styles.process}>
      <RegMark className="absolute top-10 left-8 hidden lg:block" tone="ink" />
      <RegMark className="absolute bottom-10 left-1/3 hidden lg:block" tone="ink" />
      <RegMark className="absolute right-10 bottom-16 hidden lg:block" tone="ink" />

      <div className={styles.processInner}>
        <Reveal className={styles.processCopy}>
          <h2
            id="process-b-heading"
            className="max-w-xs font-fjalla text-[48px] leading-[0.95] text-ink uppercase lg:text-[64px]"
          >
            <span>Know</span>{" "}<span>what</span>{" "}<span>comes next.</span>
          </h2>
        </Reveal>

        <Reveal className={styles.staircase} delayMs={60}>
          <ol className={styles.steps}>
            {PROCESS.steps.map((step) => (
              <li
                key={step.number}
                className={styles.step}
              >
                <RegMark className={styles.stepMark} />
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
