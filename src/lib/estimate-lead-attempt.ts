import { runLeadAttempt, type AttemptOutcome } from "@/lib/lead-attempt";
import { postLead } from "@/lib/lead-client";
import type { LeadFields } from "@/lib/lead-validation";
import { megaTagEvent } from "@/lib/megaTag";
import { pushDataLayer, trackEvent } from "@/lib/track";
import { markFormSubmitFailed, markFormSubmitted, markFormSubmitting } from "@/lib/tracking/form-submit";

export interface EstimateLeadSubmit {
  form: HTMLFormElement;
  /** The lead route's form_key, also the form's data-mega-form label. */
  formKey: string;
  fields: LeadFields;
  pageVariant: string;
  /** Applies the outcome to the form's UI. Called exactly once. */
  onSettled: (outcome: AttemptOutcome) => void;
}

// postLead mints its own reCAPTCHA token and falls back to the proof of work
// itself, so the attempt's token step carries nothing.
const noToken = (): Promise<string> => Promise.resolve("");
const sendWithoutToken = (): string => "";

/** A submit the form's own validation stopped before any request. */
export function reportLeadValidationError(formKey: string): void {
  trackEvent("form_error", { form_key: formKey, kind: "validation" });
}

function settleTracking(form: HTMLFormElement, formKey: string, outcome: AttemptOutcome): void {
  if (outcome.kind === "confirmed") {
    markFormSubmitted(form);
    return;
  }
  trackEvent("form_error", { form_key: formKey, kind: outcome.reason });
  markFormSubmitFailed(form);
}

/** Lead and conversion events, fired only after the server confirmed a real lead. */
function trackLeadConfirmed(formKey: string): void {
  pushDataLayer({ event: "form_submission" });
  megaTagEvent("form_submit", { form: formKey });
  trackEvent("lead_form_submit", { form_key: formKey });
}

/**
 * One submit attempt of a site-owned estimate form, through the template's
 * runLeadAttempt: in flight before the request, submitted only on the
 * server's `{ok:true}`, failed on every other path (including throws), and
 * lead events only after a confirmed, non-ignored success.
 */
export function submitEstimateLead(submit: EstimateLeadSubmit): Promise<AttemptOutcome> {
  const { form, formKey, fields, pageVariant } = submit;
  markFormSubmitting(form);
  return runLeadAttempt({
    mintToken: noToken,
    missingToken: sendWithoutToken,
    send: () => postLead(formKey, fields, pageVariant),
    settle: (outcome) => {
      settleTracking(form, formKey, outcome);
      submit.onSettled(outcome);
    },
    afterConfirmed: () => trackLeadConfirmed(formKey),
  });
}
