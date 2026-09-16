"use client";

import { useCallback, useRef, useState } from "react";
import type { FormEvent, RefObject } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const SUBMIT_ENDPOINT = "https://analytics.gomega.ai/submission/submit";
const CUSTOMER_ID = "b002784f-9543-4362-8814-b7da19078f23";
const DEFAULT_FORM_KEY = "homepage_estimate";
const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt", ".rtf"];
const RESUME_MAX_BYTES = 10 * 1024 * 1024;

export type EstimateStatus = "idle" | "submitting" | "success" | "error";

export interface EstimateErrors {
  name?: string;
  email?: string;
  contact?: string;
  projectDetails?: string;
  consent?: string;
  resume?: string;
}

export interface EstimateFormOptions {
  /** Submission form key; defaults to the homepage estimate key. */
  formKey?: string;
  /** Require the contact-consent checkbox (field name "consent"). */
  requireConsent?: boolean;
  /** Require a résumé file (field name "resume"); only its filename is transmitted. */
  requireResume?: boolean;
}

export interface EstimateForm {
  formRef: RefObject<HTMLFormElement | null>;
  status: EstimateStatus;
  errors: EstimateErrors;
  validateAndSubmit: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  focusFirstField: () => void;
}

function readFields(form: HTMLFormElement): Record<string, string> {
  const data = new FormData(form);
  const value = (key: string): string => String(data.get(key) ?? "").trim();
  const fields: Record<string, string> = {
    projectType: value("projectType"),
    name: value("name"),
    email: value("email"),
    phone: value("phone"),
    projectDetails: value("projectDetails"),
  };
  const projectCity = value("projectCity");
  if (projectCity) fields.projectCity = projectCity;
  return fields;
}

function readResume(form: HTMLFormElement): File | null {
  const input = form.querySelector<HTMLInputElement>('input[name="resume"]');
  return input?.files?.[0] ?? null;
}

function validateResume(file: File | null): string | undefined {
  if (!file) return "Please attach your résumé.";
  const name = file.name.toLowerCase();
  if (!RESUME_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return "Please attach a PDF, Word, or text document.";
  }
  if (file.size > RESUME_MAX_BYTES) {
    return "Please attach a file smaller than 10 MB.";
  }
  return undefined;
}

function validateFields(
  fields: Record<string, string>,
  form: HTMLFormElement,
  options: EstimateFormOptions,
): EstimateErrors {
  const errors: EstimateErrors = {};
  if (!fields.name) {
    errors.name = "Please enter your name.";
  }
  if (!fields.email && !fields.phone) {
    errors.contact = "Please provide an email or a phone number.";
  }
  if (fields.email && !EMAIL_PATTERN.test(fields.email)) {
    errors.email = "That email address doesn’t look right.";
  }
  if (!fields.projectDetails) {
    errors.projectDetails = "Please tell us a little about the project.";
  }
  const consentBox = form.querySelector<HTMLInputElement>('input[name="consent"]');
  if (options.requireConsent && !consentBox?.checked) {
    errors.consent = "Please confirm we may contact you about this request.";
  }
  if (options.requireResume) {
    const resumeError = validateResume(readResume(form));
    if (resumeError) errors.resume = resumeError;
  }
  return errors;
}

function collectTrackingParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const tracked: Record<string, string> = {};
  for (const key of TRACKED_PARAMS) {
    const value = params.get(key);
    if (value) {
      tracked[key] = value;
    }
  }
  return tracked;
}

function focusFirstInvalid(form: HTMLFormElement, errors: EstimateErrors): void {
  const order: Array<[keyof EstimateErrors, string]> = [
    ["name", "name"],
    ["contact", "email"],
    ["email", "email"],
    ["projectDetails", "projectDetails"],
    ["resume", "resume"],
    ["consent", "consent"],
  ];
  for (const [errorKey, fieldName] of order) {
    if (errors[errorKey]) {
      form.querySelector<HTMLElement>(`[name="${fieldName}"]`)?.focus();
      return;
    }
  }
}

async function postSubmission(
  formKey: string,
  fields: Record<string, string>,
  pageVariant: string,
  resumeFileName: string | null,
): Promise<void> {
  const response = await fetch(SUBMIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: CUSTOMER_ID,
      form_key: formKey,
      form_data: {
        ...fields,
        ...(resumeFileName ? { resumeFileName } : {}),
        page_variant: pageVariant,
        ...collectTrackingParams(),
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`);
  }
}

export function useEstimateForm(
  pageVariant: string,
  options: EstimateFormOptions = {},
): EstimateForm {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<EstimateStatus>("idle");
  const [errors, setErrors] = useState<EstimateErrors>({});
  const { formKey = DEFAULT_FORM_KEY, requireConsent = false, requireResume = false } = options;

  const validateAndSubmit = useCallback((): void => {
    const form = formRef.current;
    if (!form) return;
    const fieldErrors = validateFields(readFields(form), form, { requireConsent, requireResume });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      focusFirstInvalid(form, fieldErrors);
      return;
    }
    form.requestSubmit();
  }, [requireConsent, requireResume]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      const form = event.currentTarget;
      const fields = readFields(form);
      const fieldErrors = validateFields(fields, form, { requireConsent, requireResume });
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0) {
        focusFirstInvalid(form, fieldErrors);
        return;
      }
      setStatus("submitting");
      try {
        const resume = requireResume ? readResume(form) : null;
        if (requireConsent) fields.consent = "yes";
        await postSubmission(formKey, fields, pageVariant, resume?.name ?? null);
        window.dataLayer = window.dataLayer ?? [];
        window.dataLayer.push({ event: "form_submission" });
        setStatus("success");
        form.reset();
      } catch {
        setStatus("error");
      }
    },
    [pageVariant, formKey, requireConsent, requireResume],
  );

  const focusFirstField = useCallback((): void => {
    formRef.current?.querySelector<HTMLElement>('[name="name"]')?.focus();
  }, []);

  return { formRef, status, errors, validateAndSubmit, handleSubmit, focusFirstField };
}
