"use client";

import { useRef, useState, type FormEvent, type RefObject } from "react";
import { readFields, formErrors, focusInvalid, type EstimateFormOptions } from "@/lib/estimate-fields";
import { postLead } from "@/lib/lead-client";
import { createSubmissionLock, type SubmissionLock } from "@/lib/submission-lock";
import type { LeadErrors } from "@/lib/lead-validation";
import type { RecaptchaHandle } from "@/lib/recaptcha-client";

export type EstimateStatus = "idle" | "submitting" | "success" | "error";
export type EstimateErrors = LeadErrors;
export type { EstimateFormOptions } from "@/lib/estimate-fields";
export interface EstimateForm {
  formKey: string; captchaRef: RefObject<RecaptchaHandle | null>;
  formRef: RefObject<HTMLFormElement | null>; status: EstimateStatus; errors: EstimateErrors;
  errorMessage: string; validateAndSubmit: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>; focusFirstField: () => void;
}
type SubmitContext = { lock: SubmissionLock; formKey: string; widget: RecaptchaHandle | null; pageVariant: string; setStatus: (status: EstimateStatus) => void; setMessage: (message: string) => void };

async function submit(form: HTMLFormElement, context: SubmitContext): Promise<void> {
  if (!context.lock.acquire()) return;
  context.setStatus("submitting"); context.setMessage("");
  try {
    await postLead(context.formKey, readFields(form), context.pageVariant, context.widget);
    context.lock.complete();
    window.dataLayer ??= [];
    window.dataLayer.push({ event: "form_submission" });
    context.setStatus("success"); form.reset();
  } catch (error) {
    context.lock.release(); context.setStatus("error");
    context.setMessage(error instanceof Error ? error.message : "Please try again or contact our office.");
  }
}

export function useEstimateForm(pageVariant: string, options: EstimateFormOptions = {}): EstimateForm {
  const formKey = options.formKey || "homepage_estimate";
  const captchaRef = useRef<RecaptchaHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lock = useRef(createSubmissionLock());
  const [status, setStatus] = useState<EstimateStatus>("idle");
  const [errors, setErrors] = useState<EstimateErrors>({});
  const [errorMessage, setMessage] = useState("");
  const validate = (form: HTMLFormElement): boolean => {
    const next = formErrors(form, options); setErrors(next);
    if (Object.keys(next).length) { focusInvalid(form, next); return false; }
    return form.reportValidity();
  };
  const validateAndSubmit = (): void => {
    const form = formRef.current;
    if (form && status !== "submitting" && status !== "success" && validate(form)) form.requestSubmit();
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!validate(event.currentTarget)) return;
    await submit(event.currentTarget, { lock: lock.current, formKey, widget: captchaRef.current, pageVariant, setStatus, setMessage });
  };
  const focusFirstField = (): void => { formRef.current?.querySelector<HTMLElement>('[name="name"]')?.focus(); };
  return { formKey, captchaRef, formRef, status, errors, errorMessage, validateAndSubmit, handleSubmit, focusFirstField };
}
