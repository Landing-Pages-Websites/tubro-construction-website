"use client";

import { ArrowRight, Clock, HardHat, MapPin, Phone, Shield } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND, ESTIMATE, PROJECT_TYPES } from "@/lib/content";
import { useEstimateForm } from "@/hooks/useEstimateForm";
import { EstimateField } from "@/components/shared/EstimateField";
import { EstimateStatusNote } from "@/components/shared/EstimateStatusNote";

const FIELD_CLASSES =
  "w-full rounded-md border border-ink/25 bg-white px-3.5 py-2.5 font-poppins text-sm text-ink placeholder:text-ink/40 focus:border-action";
const LABEL_CLASSES = "font-fjalla text-[11px] tracking-[0.1em] text-ink/70 uppercase";

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
          <form
            ref={form.formRef}
            onSubmit={form.handleSubmit}
            noValidate
            className="rounded-xl bg-white p-6 shadow-lg shadow-ink/10 sm:p-9"
          >
            <fieldset>
              <legend className="font-fjalla text-xs tracking-[0.12em] text-ink uppercase">
                Project type
              </legend>
              <div className="mt-2 divide-y divide-ink/10 border-b border-ink/10">
                {PROJECT_TYPES.map((type, index) => (
                  <label key={type} className="flex min-h-12 cursor-pointer items-center gap-3.5 py-3">
                    <input
                      type="radio"
                      name="projectType"
                      value={type}
                      defaultChecked={index === 0}
                      className="size-5 shrink-0 appearance-none rounded-full border-2 border-ink/30 transition-colors checked:border-action checked:bg-action checked:[box-shadow:inset_0_0_0_3px_#fff]"
                    />
                    <span className="font-poppins text-sm text-ink">{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <EstimateField
                id="a-name"
                name="name"
                label="Name"
                autoComplete="name"
                error={form.errors.name}
                errorId="a-name-error"
                fieldClassName={FIELD_CLASSES}
                labelClassName={LABEL_CLASSES}
              />
              <EstimateField
                id="a-phone"
                name="phone"
                label="Phone"
                type="tel"
                autoComplete="tel"
                invalid={Boolean(form.errors.contact)}
                errorId="a-contact-error"
                fieldClassName={FIELD_CLASSES}
                labelClassName={LABEL_CLASSES}
              />
            </div>

            <EstimateField
              id="a-email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              invalid={Boolean(form.errors.email ?? form.errors.contact)}
              error={form.errors.contact ?? form.errors.email}
              errorId="a-contact-error"
              fieldClassName={FIELD_CLASSES}
              labelClassName={LABEL_CLASSES}
              className="mt-5"
            />

            <EstimateField
              id="a-details"
              name="projectDetails"
              label="Project details"
              multiline
              error={form.errors.projectDetails}
              errorId="a-details-error"
              fieldClassName={FIELD_CLASSES}
              labelClassName={LABEL_CLASSES}
              className="mt-5"
            />

            <button
              type="button"
              onClick={form.validateAndSubmit}
              disabled={form.status === "submitting"}
              className="group mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-md bg-action px-6 py-3.5 font-poppins text-base font-semibold text-white transition-colors hover:bg-action-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {form.status === "submitting" ? ESTIMATE.submittingCta : ESTIMATE.submitCta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>

            <EstimateStatusNote status={form.status} />
          </form>
        </div>
      </div>
    </section>
  );
}
