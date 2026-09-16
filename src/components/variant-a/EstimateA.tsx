"use client";

import { ArrowRight, Clock, HardHat, MapPin, Phone, Shield } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND, ESTIMATE } from "@/lib/content";
import { useEstimateForm } from "@/hooks/useEstimateForm";
import { HomepageEstimateForm } from "@/components/shared/HomepageEstimateForm";

export function EstimateA(): ReactElement {
  const form = useEstimateForm("/");

  return (
    <section id="estimate" aria-labelledby="estimate-a-heading" className="a-estimate bg-plaster">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-14 lg:py-24">
        <div className="lg:col-span-5">
          <h2
            id="estimate-a-heading"
            className="max-w-md font-poppins text-[38px] leading-[1.04] font-extrabold tracking-tight text-ink lg:text-[52px]"
          >
            {ESTIMATE.heading}
          </h2>
          <p className="mt-5 max-w-sm font-fjalla text-[15px] leading-relaxed text-ink/80">
            {ESTIMATE.body}
          </p>
          <span aria-hidden="true" className="mt-7 block h-0.5 w-28 bg-action" />
          <div className="mt-8 flex flex-col items-start gap-5">
            <button
              type="button"
              onClick={form.focusFirstField}
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-md bg-action px-6 py-3 font-poppins text-[15px] font-semibold text-white shadow-md shadow-action/25 transition-colors hover:bg-action-deep"
            >
              {ESTIMATE.submitCta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
            <a
              href={BRAND.phoneHref}
              className="inline-flex min-h-11 items-center gap-2.5 font-poppins text-lg font-semibold text-action-deep hover:text-action"
            >
              <Phone className="size-5" aria-hidden="true" />
              Call {BRAND.phoneDisplay}
            </a>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink/15 pt-8 lg:grid-cols-4 lg:gap-x-5">
            <li>
              <MapPin className="size-5 text-action" aria-hidden="true" />
              <h3 className="mt-2.5 font-fjalla text-[11px] tracking-[0.08em] text-ink uppercase">Service area</h3>
              <p className="mt-1.5 font-fjalla text-xs leading-relaxed text-ink/70">{BRAND.serviceArea}</p>
            </li>
            <li>
              <Clock className="size-5 text-action" aria-hidden="true" />
              <h3 className="mt-2.5 font-fjalla text-[11px] tracking-[0.08em] text-ink uppercase">Hours</h3>
              <p className="mt-1.5 font-fjalla text-xs leading-relaxed text-ink/70">{BRAND.hours}</p>
            </li>
            <li>
              <Shield className="size-5 text-action" aria-hidden="true" />
              <h3 className="mt-2.5 font-fjalla text-[11px] tracking-[0.08em] text-ink uppercase">
                Military &amp; first responder discount
              </h3>
              <p className="mt-1.5 font-fjalla text-xs leading-relaxed text-ink/70">{BRAND.discount}</p>
            </li>
            <li>
              <HardHat className="size-5 text-action" aria-hidden="true" />
              <h3 className="mt-2.5 font-fjalla text-[11px] tracking-[0.08em] text-ink uppercase">Careers</h3>
              <p className="mt-1.5 font-fjalla text-xs leading-relaxed text-ink/70">
                {BRAND.careersNote}{" "}
                <a href={`mailto:${BRAND.email}`} className="text-action-deep underline underline-offset-2">
                  {BRAND.emailUser}@<wbr />
                  {BRAND.emailDomain}
                </a>
                .
              </p>
            </li>
          </ul>
        </div>

        <div className="mt-12 lg:col-span-7 lg:mt-0">
          <HomepageEstimateForm form={form} />
        </div>
      </div>
    </section>
  );
}
