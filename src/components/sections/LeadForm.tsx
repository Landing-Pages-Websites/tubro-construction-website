"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import type { ReactElement } from "react";
import { useEstimateForm } from "@/hooks/useEstimateForm";
import { defaultProjectType } from "@/lib/form-keys";
import { EstimateField } from "@/components/shared/EstimateField";
import { EstimateStatusNote } from "@/components/shared/EstimateStatusNote";

const FIELD_CLASSES =
  "w-full rounded-md border border-ink/25 bg-white px-3.5 py-2.5 font-poppins text-sm text-ink placeholder:text-ink/40 focus:border-action";
const LABEL_CLASSES = "font-fjalla text-[11px] tracking-[0.1em] text-ink/70 uppercase";

export interface LeadFormProps {
  /** Distinct submission key per route, e.g. "estimate_contact". */
  formKey: string;
  /** Route path recorded with the lead. */
  pagePath: string;
  /** Approved project-type options from the manifest. */
  options: string[];
  submitLabel: string;
  /** Careers application: adds the résumé attachment field. */
  withResume?: boolean;
  idPrefix: string;
  /** Editable initial city on a location-specific estimate page. */
  defaultCity?: string;
}

/**
 * Shared lead form mechanics (not a composition): validate-first submit,
 * consent, honest success/error states. Leads route to the Tubro office
 * inbox — no scheduling or Buildertrend integration is claimed.
 */
export function LeadForm({
  formKey,
  pagePath,
  options,
  submitLabel,
  withResume = false,
  idPrefix,
  defaultCity,
}: LeadFormProps): ReactElement {
  const form = useEstimateForm(pagePath, {
    formKey,
    requireConsent: true,
    requireResume: withResume,
  });
  const busy = form.status === "submitting";

  return (
    <form ref={form.formRef} onSubmit={form.handleSubmit} noValidate aria-label={submitLabel}>
      {options.length > 0 && (
        <fieldset>
          <legend className={LABEL_CLASSES}>{withResume ? "Work area" : "Project type"}</legend>
          <div className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
            {options.map((option) => (
              <label
                key={option}
                className="flex min-h-11 cursor-pointer items-center gap-3 py-2.5 font-poppins text-sm text-ink"
              >
                <input
                  type="radio"
                  name="projectType"
                  value={option}
                  defaultChecked={option === defaultProjectType(pagePath, options)}
                  className="size-4 shrink-0 accent-[#0C883D]"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <EstimateField
          id={`${idPrefix}-name`}
          name="name"
          label="Name"
          errorId={`${idPrefix}-name-error`}
          fieldClassName={FIELD_CLASSES}
          labelClassName={LABEL_CLASSES}
          autoComplete="name"
          error={form.errors.name}
        />
        <EstimateField
          id={`${idPrefix}-phone`}
          name="phone"
          label="Phone"
          errorId={`${idPrefix}-email-error`}
          fieldClassName={FIELD_CLASSES}
          labelClassName={LABEL_CLASSES}
          type="tel"
          autoComplete="tel"
          invalid={Boolean(form.errors.contact)}
        />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <EstimateField
          id={`${idPrefix}-email`}
          name="email"
          label="Email"
          errorId={`${idPrefix}-email-error`}
          fieldClassName={FIELD_CLASSES}
          labelClassName={LABEL_CLASSES}
          type="email"
          autoComplete="email"
          error={form.errors.email ?? form.errors.contact}
        />
        <EstimateField
          id={`${idPrefix}-city`}
          name="projectCity"
          defaultValue={defaultCity}
          label={withResume ? "City" : "Project city"}
          errorId={`${idPrefix}-city-error`}
          fieldClassName={FIELD_CLASSES}
          labelClassName={LABEL_CLASSES}
          autoComplete="address-level2"
        />
      </div>
      <EstimateField
        id={`${idPrefix}-details`}
        name="projectDetails"
        label={withResume ? "Experience and trade background" : "Project details"}
        errorId={`${idPrefix}-details-error`}
        fieldClassName={FIELD_CLASSES}
        labelClassName={LABEL_CLASSES}
        multiline
        className="mt-4"
        error={form.errors.projectDetails}
      />
      {withResume && (
        <div className="mt-4">
          <label htmlFor={`${idPrefix}-resume`} className={LABEL_CLASSES}>
            Résumé (PDF or Word)
          </label>
          <input
            id={`${idPrefix}-resume`}
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,.txt,.rtf"
            aria-invalid={Boolean(form.errors.resume)}
            aria-describedby={form.errors.resume ? `${idPrefix}-resume-error` : undefined}
            className="mt-1.5 block w-full cursor-pointer font-poppins text-sm text-ink/80 file:mr-3 file:rounded-md file:border file:border-action file:bg-white file:px-3.5 file:py-2 file:font-poppins file:text-sm file:font-semibold file:text-action-deep hover:file:bg-sage"
          />
          {form.errors.resume && (
            <p id={`${idPrefix}-resume-error`} className="mt-1.5 font-poppins text-xs text-red-700">
              {form.errors.resume}
            </p>
          )}
          <p className="mt-1.5 font-poppins text-xs text-ink/60">
            Submitting sends your details and résumé filename to the office; the team follows up
            by email to collect the document. You can also send it to{" "}
            <a href="mailto:workorders@tubroconstruction.com" className="underline underline-offset-2">
              workorders@tubroconstruction.com
            </a>
            .
          </p>
        </div>
      )}
      <div className="mt-5">
        <label className="flex cursor-pointer gap-3 font-poppins text-xs leading-relaxed text-ink/75">
          <input
            type="checkbox"
            name="consent"
            aria-invalid={Boolean(form.errors.consent)}
            aria-describedby={form.errors.consent ? `${idPrefix}-consent-error` : undefined}
            className="mt-0.5 size-4 shrink-0 accent-[#0C883D]"
          />
          Tubro Construction may contact me about this request by phone or email.
        </label>
        {form.errors.consent && (
          <p id={`${idPrefix}-consent-error`} className="mt-1.5 font-poppins text-xs text-red-700">
            {form.errors.consent}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={form.validateAndSubmit}
        disabled={busy}
        className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-md bg-action px-6 py-3 font-poppins text-[15px] font-semibold text-white shadow-md shadow-action/25 transition-colors hover:bg-action-deep disabled:cursor-wait disabled:opacity-75 sm:w-auto"
      >
        {busy ? (
          <>
            Sending…
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          </>
        ) : (
          <>
            {submitLabel}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </>
        )}
      </button>
      <EstimateStatusNote
        status={form.status}
        topic={withResume ? "application" : "estimate request"}
        idleNote={
          withResume
            ? "Your details go to the Tubro office; the team follows up by phone or email."
            : submitLabel === "Send Message"
              ? "No spam — your message goes straight to the Tubro office."
              : "Free estimate. No spam — your details go straight to the Tubro team."
        }
        successNote={
          withResume
            ? "Thanks — your application details are in. The office follows up by email to collect your résumé document; you can also send it to workorders@tubroconstruction.com."
            : undefined
        }
      />
    </form>
  );
}
