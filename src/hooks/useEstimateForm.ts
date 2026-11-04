"use client";

import { useRef, useState, type FormEvent, type RefObject } from "react";
import { readFields, formErrors, focusInvalid, type EstimateFormOptions } from "@/lib/estimate-fields";
import { reportLeadValidationError, submitEstimateLead } from "@/lib/estimate-lead-attempt";
import type { AttemptOutcome } from "@/lib/lead-attempt";
import { createSubmissionLock, type SubmissionLock } from "@/lib/submission-lock";
import type { LeadErrors } from "@/lib/lead-validation";

export type EstimateStatus = "idle" | "submitting" | "success" | "error";
export type EstimateErrors = LeadErrors;
export type { EstimateFormOptions } from "@/lib/estimate-fields";
export interface EstimateForm {
  formKey: string;
  formRef: RefObject<HTMLFormElement | null>; status: EstimateStatus; errors: EstimateErrors;
  errorMessage: string; validateAndSubmit: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>; focusFirstField: () => void;
}
type SubmitContext = { lock: SubmissionLock; formKey: string; pageVariant: string; setStatus: (status: EstimateStatus) => void; setMessage: (message: string) => void };

const FALLBACK_ERROR = "Please try again or contact our office.";

function settle(form: HTMLFormElement, context: SubmitContext, outcome: AttemptOutcome): void {
  if (outcome.kind === "confirmed") {
    context.lock.complete(); context.setStatus("success"); form.reset();
    return;
  }
  context.lock.release(); context.setStatus("error");
  context.setMessage(outcome.error instanceof Error ? outcome.error.message : FALLBACK_ERROR);
}

async function submit(form: HTMLFormElement, context: SubmitContext): Promise<void> {
  if (!context.lock.acquire()) return;
  context.setStatus("submitting"); context.setMessage("");
  await submitEstimateLead({
    form, formKey: context.formKey, fields: readFields(form), pageVariant: context.pageVariant,
    onSettled: (outcome) => settle(form, context, outcome),
  });
}

export function useEstimateForm(pageVariant: string, options: EstimateFormOptions = {}): EstimateForm {
  const formKey = options.formKey || "homepage_estimate";
  const formRef = useRef<HTMLFormElement>(null);
  const lock = useRef(createSubmissionLock());
  const [status, setStatus] = useState<EstimateStatus>("idle");
  const [errors, setErrors] = useState<EstimateErrors>({});
  const [errorMessage, setMessage] = useState("");
  const validate = (form: HTMLFormElement): boolean => {
    const next = formErrors(form, options); setErrors(next);
    const valid = !Object.keys(next).length && form.reportValidity();
    if (!valid) { focusInvalid(form, next); reportLeadValidationError(formKey); }
    return valid;
  };
  const validateAndSubmit = (): void => {
    const form = formRef.current;
    if (form && status !== "submitting" && status !== "success" && validate(form)) form.requestSubmit();
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!validate(event.currentTarget)) return;
    await submit(event.currentTarget, { lock: lock.current, formKey, pageVariant, setStatus, setMessage });
  };
  const focusFirstField = (): void => { formRef.current?.querySelector<HTMLElement>('[name="name"]')?.focus(); };
  return { formKey, formRef, status, errors, errorMessage, validateAndSubmit, handleSubmit, focusFirstField };
}
