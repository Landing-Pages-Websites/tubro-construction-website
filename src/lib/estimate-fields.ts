import { validateLeadFields, type LeadFields, type LeadErrors } from "./lead-validation";
export type EstimateFormOptions = { formKey?: string; requireConsent?: boolean; requireResume?: boolean };

export function readFields(form: HTMLFormElement): LeadFields {
  const data = new FormData(form);
  const keys = ["projectType", "name", "email", "phone", "projectDetails", "projectCity", "website"];
  const fields: LeadFields = Object.fromEntries(keys.map((key) => [key, String(data.get(key) ?? "").trim()]));
  const consent = form.querySelector<HTMLInputElement>('[name="consent"]');
  if (consent) fields.consent = consent.checked;
  const resume = form.querySelector<HTMLInputElement>('[name="resume"]')?.files?.[0];
  if (resume) fields.resumeFileName = resume.name;
  return fields;
}

export function formErrors(form: HTMLFormElement, options: EstimateFormOptions): LeadErrors {
  const fields = readFields(form);
  const projectTypes = Array.from(form.querySelectorAll<HTMLInputElement>('[name="projectType"]')).map((input) => input.value);
  const errors = validateLeadFields(fields, { projectTypes: projectTypes.length ? projectTypes : undefined, consent: options.requireConsent, projectType: Boolean(form.querySelector('[name="projectType"]')), resume: options.requireResume });
  const resume = form.querySelector<HTMLInputElement>('[name="resume"]')?.files?.[0];
  if (options.requireResume && resume && resume.size > 10 * 1024 * 1024) errors.resume = "Choose a file smaller than 10 MB.";
  return errors;
}

export function focusInvalid(form: HTMLFormElement, errors: LeadErrors): void {
  const field = Object.keys(errors)[0];
  if (field) form.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
}
