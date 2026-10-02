import { captchaMode, stagingTokenAccepted, STAGING_SENTINEL } from "./lead-policy";
import { consumeChallenge, proofAvailable, validChallenge } from "./lead-challenge";
import { verifyLeadProof } from "./leadProof";
import { validateLeadFields, type FieldRequirements } from "./lead-validation";
import { PROJECT_TYPES } from "./content";
import { SITE_ROUTES } from "./routes";
import { formKeyForSlug } from "./form-keys";

export type LeadPayload = { form_key: string; form_data: Record<string, unknown>; [key: string]: unknown };
export type LeadAuthorization = { ok: false } | { ok: true; spamCheck: string | null };
const SPAM_CHECK_RECAPTCHA = "Passed reCAPTCHA";
const SPAM_CHECK_FALLBACK = "Unverified: reCAPTCHA did not pass; passed fallback check";
const MAX_BODY_BYTES = 24_000;
const CAREER_TYPES = ["Carpentry", "Project support", "Painting", "General construction", "Other"];
const NO_CONSENT_KEYS = new Set(["homepage_estimate", "estimate_bathroom_remodeling"]);
const FORM_KEYS = new Set(["homepage_estimate", ...SITE_ROUTES.map((route) => formKeyForSlug(route.slug))]);
const FIELD_KEYS = ["name", "email", "phone", "projectDetails", "projectType", "projectCity", "consent", "resumeFileName", "pageVariant", "utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent", "gclid", "fbclid"];

export function requirementsFor(formKey: string): FieldRequirements {
  return { consent: !NO_CONSENT_KEYS.has(formKey), projectType: true, projectTypes: formKey === "careers_application" ? CAREER_TYPES : PROJECT_TYPES, resume: formKey === "careers_application" };
}

export async function readLeadPayload(request: Request): Promise<LeadPayload> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error("Send the form as JSON.");
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new Error("Request is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("The form is empty.");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) { await reader.cancel(); throw new Error("Request is too large."); }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid form.");
    return parsed as LeadPayload;
  } catch { throw new Error("Unable to read this form. Check its size and format, then try again."); }
}

export function payloadErrors(body: LeadPayload): Record<string, string> {
  if (!FORM_KEYS.has(body.form_key) || !body.form_data || typeof body.form_data !== "object" || Array.isArray(body.form_data)) return { form: "Unknown or incomplete form." };
  for (const [key, value] of Object.entries(body.form_data)) {
    if (!FIELD_KEYS.includes(key)) return { form: "Unexpected form field." };
    if (key === "consent" && value !== true) return { consent: "Please confirm we may contact you." };
    if (key !== "consent" && (typeof value !== "string" || value.length > (key === "projectDetails" ? 5000 : 500))) return { form: "Invalid form field." };
  }
  return validateLeadFields(body.form_data, requirementsFor(body.form_key));
}

async function enterpriseAuthorized(token: string, hostname: string): Promise<boolean> {
  if (!token || token === STAGING_SENTINEL || token === "lead-submit" || token.length > 8192) return false;
  const project = process.env.RECAPTCHA_PROJECT_ID;
  const key = process.env.RECAPTCHA_API_KEY;
  if (!project || !key) return false;
  try {
    const response = await fetch(`https://recaptchaenterprise.googleapis.com/v1/projects/${project}/assessments?key=${key}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ event: { token, siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, expectedAction: "lead_submit" } }),
    });
    if (!response.ok) return false;
    const assessment = await response.json() as { tokenProperties?: { valid?: boolean; action?: string; hostname?: string }; riskAnalysis?: { score?: number; reasons?: string[] } };
    const properties = assessment.tokenProperties;
    return Boolean(properties?.valid && properties.action === "lead_submit" && properties.hostname?.toLowerCase() === hostname && (assessment.riskAnalysis?.score ?? 0) >= 0.5 && !assessment.riskAnalysis?.reasons?.length);
  } catch { return false; }
}

export async function authorizeLead(body: LeadPayload, host: string): Promise<LeadAuthorization> {
  try {
    const mode = captchaMode(host, process.env);
    if (mode === "denied") return { ok: false };
    if (mode === "staging") return stagingTokenAccepted(mode, body.captchaToken) ? { ok: true, spamCheck: null } : { ok: false };
    if (!process.env.RECAPTCHA_PROJECT_ID || !process.env.RECAPTCHA_API_KEY) return { ok: false };
    if (typeof body.captchaToken === "string" && await enterpriseAuthorized(body.captchaToken, host)) return { ok: true, spamCheck: SPAM_CHECK_RECAPTCHA };
    if (!proofAvailable() || !validChallenge(body, host) || !await verifyLeadProof(body)) return { ok: false };
    if (!consumeChallenge(String(body.powChallenge), Number(body.powIssuedAt))) return { ok: false };
    return { ok: true, spamCheck: SPAM_CHECK_FALLBACK };
  } catch { return { ok: false }; }
}

export function upstreamPayload(body: LeadPayload, spamCheck: string | null): Record<string, unknown> {
  const formData = Object.fromEntries(FIELD_KEYS.filter((key) => body.form_data[key] !== undefined).map((key) => [key, body.form_data[key]]));
  formData.phone = String(formData.phone).replace(/\D/g, "");
  if (spamCheck) formData.spamCheck = spamCheck;
  return { form_key: body.form_key, form_data: formData, customer_id: "b002784f-9543-4362-8814-b7da19078f23", site_id: "f28d515e-437b-4f9b-96c4-bc1a79a3357c", source_provider: "website-tubroconstruction" };
}
