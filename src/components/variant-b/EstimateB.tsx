"use client";

import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Check,
  Clock,
  MapPin,
  MoveRight,
  Phone,
} from "lucide-react";
import type { ReactElement } from "react";
import styles from "./LowerB.module.css";
import { BRAND, ESTIMATE, PROJECT_TYPES } from "@/lib/content";
import { useEstimateForm } from "@/hooks/useEstimateForm";
import { EstimateField } from "@/components/shared/EstimateField";
import { EstimateStatusNote } from "@/components/shared/EstimateStatusNote";

const FIELD_CLASSES =
  "w-full border border-ink/25 bg-white px-3.5 py-2.5 font-poppins text-sm text-ink placeholder:text-ink/40 focus:border-action";

const LABEL_CLASSES = "font-fjalla text-[10px] tracking-[0.14em] text-ink uppercase";

export function EstimateB(): ReactElement {
  const form = useEstimateForm("variant-b");

  return (
    <section id="estimate" aria-labelledby="estimate-b-heading" className={styles.estimate}>
      <div className="border-y border-ink/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 sm:px-8">
          <p className="font-fjalla text-xs tracking-[0.14em] text-ink uppercase">
            Tubro Construction
          </p>
          <span aria-hidden="true" className="flex items-center gap-2">
            <span className="h-1 w-12 bg-action" />
            <span className="h-1 w-4 bg-action/40" />
          </span>
        </div>
      </div>

      <div className={styles.estimateInner}>
        <div className={styles.estimateCopy}>
          <p className="font-fjalla text-xs tracking-[0.14em] uppercase">
            <span className="text-action">07</span>
            <span className="text-ink/60"> / Estimate</span>
          </p>
          <h2
            id="estimate-b-heading"
            className="mt-4 max-w-md font-fjalla text-[40px] leading-[0.98] text-ink uppercase lg:text-[52px]"
          >
            {ESTIMATE.heading}
          </h2>
          <p className="mt-5 max-w-sm font-poppins text-sm leading-relaxed text-ink/80">
            {ESTIMATE.body}
          </p>

          <ul className="mt-9 divide-y divide-ink/15 border-y border-ink/15">
            <li className="flex items-start gap-4 py-4">
              <Phone className="mt-1 size-5 shrink-0 text-ink" aria-hidden="true" />
              <div>
                <h3 className={LABEL_CLASSES}>Call us</h3>
                <a
                  href={BRAND.phoneHref}
                  className="mt-0.5 inline-flex min-h-8 items-center font-fjalla text-xl tracking-[0.04em] text-action-deep hover:text-action"
                >
                  {BRAND.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4 py-4">
              <MapPin className="mt-1 size-5 shrink-0 text-ink" aria-hidden="true" />
              <div>
                <h3 className={LABEL_CLASSES}>Service area</h3>
                <p className="mt-1 font-poppins text-sm text-ink/85">{BRAND.serviceArea}</p>
              </div>
            </li>
            <li className="flex items-start gap-4 py-4">
              <Clock className="mt-1 size-5 shrink-0 text-ink" aria-hidden="true" />
              <div>
                <h3 className={LABEL_CLASSES}>Hours</h3>
                <p className="mt-1 font-poppins text-sm text-ink/85">{BRAND.hours}</p>
              </div>
            </li>
            <li className="flex items-start gap-4 py-4">
              <BriefcaseBusiness className="mt-1 size-5 shrink-0 text-ink" aria-hidden="true" />
              <div>
                <h3 className={LABEL_CLASSES}>Careers</h3>
                <p className="mt-1 font-poppins text-sm text-ink/85">
                  {BRAND.careersNote}{" "}
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="text-action-deep underline underline-offset-2"
                  >
                    {BRAND.emailUser}@<wbr />
                    {BRAND.emailDomain}
                  </a>
                  .
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4 py-4">
              <Award className="mt-1 size-5 shrink-0 text-timber-ink" aria-hidden="true" />
              <p className="font-poppins text-sm leading-relaxed text-timber-ink">{BRAND.discount}</p>
            </li>
          </ul>
        </div>

        <div className={styles.estimateForm}>
          <form ref={form.formRef} onSubmit={form.handleSubmit} noValidate>
            <fieldset>
              <legend className="w-full">
                <span className="flex items-center gap-4">
                  <span className="shrink-0 font-fjalla text-sm tracking-[0.1em] text-ink uppercase">
                    Step 1: Select your project type
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-ink/20" />
                </span>
              </legend>
              <div className={styles.projectTypes}>
                {PROJECT_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex min-h-13 cursor-pointer items-center gap-4 border-2 border-ink/15 bg-white px-4 py-3 transition-colors has-checked:border-action has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-action"
                  >
                    <input
                      type="radio"
                      name="projectType"
                      value={type}

                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-ink/30 peer-checked:border-action peer-checked:bg-action"
                    >
                      <Check className={`size-3.5 text-white ${styles.projectCheck}`} />
                    </span>
                    <span className="font-poppins text-[15px] text-ink">{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 flex items-center gap-4">
              <p className="shrink-0 font-fjalla text-sm tracking-[0.1em] text-ink uppercase">
                Step 2: Contact details
              </p>
              <span aria-hidden="true" className="h-px flex-1 bg-ink/20" />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <EstimateField
                id="b-name"
                name="name"
                label="Name"
                autoComplete="name"
                error={form.errors.name}
                errorId="b-name-error"
                fieldClassName={FIELD_CLASSES}
                labelClassName={LABEL_CLASSES}
              />
              <EstimateField
                id="b-phone"
                name="phone"
                label="Phone"
                type="tel"
                autoComplete="tel"
                invalid={Boolean(form.errors.contact)}
                errorId="b-contact-error"
                fieldClassName={FIELD_CLASSES}
                labelClassName={LABEL_CLASSES}
              />
              <EstimateField
                id="b-email"
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                invalid={Boolean(form.errors.email ?? form.errors.contact)}
                errorId="b-contact-error"
                fieldClassName={FIELD_CLASSES}
                labelClassName={LABEL_CLASSES}
              />
            </div>
            {(form.errors.contact ?? form.errors.email) && (
              <p id="b-contact-error" className="mt-2 font-poppins text-xs text-red-700">
                {form.errors.contact ?? form.errors.email}
              </p>
            )}

            <EstimateField
              id="b-details"
              name="projectDetails"
              label="Project details"
              multiline
              error={form.errors.projectDetails}
              errorId="b-details-error"
              fieldClassName={FIELD_CLASSES}
              labelClassName={LABEL_CLASSES}
              className="mt-4"
            />

            <div className="mt-7 flex flex-col gap-5 border-t border-ink/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2.5 font-poppins text-xs text-ink/70">
                <MoveRight className="size-4 shrink-0 text-action" aria-hidden="true" />
                <span>
                  Send your project details to{" "}
                  <span className="font-semibold text-ink">{BRAND.email}</span>
                </span>
              </p>
              <button
                type="button"
                onClick={form.validateAndSubmit}
                disabled={form.status === "submitting"}
                className="group inline-flex min-h-13 items-center justify-center gap-2.5 rounded-sm bg-action px-7 py-3.5 font-fjalla text-sm tracking-[0.08em] text-white uppercase transition-colors hover:bg-action-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {form.status === "submitting" ? ESTIMATE.submittingCta : ESTIMATE.submitCta}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>

            <EstimateStatusNote status={form.status} />
          </form>
        </div>
      </div>
    </section>
  );
}
