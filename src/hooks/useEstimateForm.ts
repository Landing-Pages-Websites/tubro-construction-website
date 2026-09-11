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
const FORM_KEY = "homepage_estimate";
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

export type EstimateStatus = "idle" | "submitting" | "success" | "error";

export interface EstimateErrors {
  name?: string;
  email?: string;
  contact?: string;
  projectDetails?: string;
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
  return {
    projectType: value("projectType"),
    name: value("name"),
    email: value("email"),
    phone: value("phone"),
    projectDetails: value("projectDetails"),
  };
}

function validateFields(fields: Record<string, string>): EstimateErrors {
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
  ];
  for (const [errorKey, fieldName] of order) {
    if (errors[errorKey]) {
      form.querySelector<HTMLElement>(`[name="${fieldName}"]`)?.focus();
      return;
    }
  }
}

async function postSubmission(
  fields: Record<string, string>,
  pageVariant: string,
): Promise<void> {
  const response = await fetch(SUBMIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: CUSTOMER_ID,
      form_key: FORM_KEY,
      form_data: {
        ...fields,
        page_variant: pageVariant,
        ...collectTrackingParams(),
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`);
  }
}

export function useEstimateForm(pageVariant: string): EstimateForm {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<EstimateStatus>("idle");
  const [errors, setErrors] = useState<EstimateErrors>({});

  const validateAndSubmit = useCallback((): void => {
    const form = formRef.current;
    if (!form) return;
    const fieldErrors = validateFields(readFields(form));
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      focusFirstInvalid(form, fieldErrors);
      return;
    }
    form.requestSubmit();
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      const form = event.currentTarget;
      const fields = readFields(form);
      const fieldErrors = validateFields(fields);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0) {
        focusFirstInvalid(form, fieldErrors);
        return;
      }
      setStatus("submitting");
      try {
        await postSubmission(fields, pageVariant);
        window.dataLayer = window.dataLayer ?? [];
        window.dataLayer.push({ event: "form_submission" });
        setStatus("success");
        form.reset();
      } catch {
        setStatus("error");
      }
    },
    [pageVariant],
  );

  const focusFirstField = useCallback((): void => {
    formRef.current?.querySelector<HTMLElement>('[name="name"]')?.focus();
  }, []);

  return { formRef, status, errors, validateAndSubmit, handleSubmit, focusFirstField };
}
