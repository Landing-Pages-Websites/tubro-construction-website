"use client";

import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import { ESTIMATE, PROJECT_TYPES } from "@/lib/content";
import type { EstimateForm } from "@/hooks/useEstimateForm";
import { EstimateField } from "./EstimateField";
import { EstimateStatusNote } from "./EstimateStatusNote";
import styles from "./homepage-estimate-form.module.css";

const FIELD_CLASSES =
  "w-full rounded-md border border-ink/25 bg-white px-3.5 py-2.5 font-poppins text-sm text-ink placeholder:text-ink/40 focus:border-action";
const LABEL_CLASSES = "font-fjalla text-[11px] tracking-[0.1em] text-ink/70 uppercase";

interface HomepageEstimateFormProps {
  form: EstimateForm;
  idPrefix?: string;
}

/** The same contact form is used on the homepage and bathroom estimate. */
export function HomepageEstimateForm({ form, idPrefix = "a" }: HomepageEstimateFormProps): ReactElement {
  return (
    <form
      ref={form.formRef}
      onSubmit={form.handleSubmit}
      noValidate
      className={`${styles.form} rounded-xl bg-white p-6 shadow-lg shadow-ink/10 sm:p-9`}
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
          id={`${idPrefix}-name`}
          name="name"
          label="Name"
          autoComplete="name"
          error={form.errors.name}
          errorId={`${idPrefix}-name-error`}
          fieldClassName={FIELD_CLASSES}
          labelClassName={LABEL_CLASSES}
        />
        <EstimateField
          id={`${idPrefix}-phone`}
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          invalid={Boolean(form.errors.contact)}
          errorId={`${idPrefix}-contact-error`}
          fieldClassName={FIELD_CLASSES}
          labelClassName={LABEL_CLASSES}
        />
      </div>

      <EstimateField
        id={`${idPrefix}-email`}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        invalid={Boolean(form.errors.email ?? form.errors.contact)}
        error={form.errors.contact ?? form.errors.email}
        errorId={`${idPrefix}-contact-error`}
        fieldClassName={FIELD_CLASSES}
        labelClassName={LABEL_CLASSES}
        className="mt-5"
      />

      <EstimateField
        id={`${idPrefix}-details`}
        name="projectDetails"
        label="Project details"
        multiline
        error={form.errors.projectDetails}
        errorId={`${idPrefix}-details-error`}
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
  );
}
