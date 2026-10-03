import type { RecaptchaHandle } from "./recaptcha-client";
import { solveLeadProof } from "./leadProof";
import type { LeadFields } from "./lead-validation";
import { resumeFileError, type AttachmentStatus } from "./lead-uploads";
import { uploadResume } from "./resume-upload-client";

export type LeadResult = { attachment: AttachmentStatus };

declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; } }
const TRACKED_PARAMS = { utm_source: "utmSource", utm_medium: "utmMedium", utm_campaign: "utmCampaign", utm_term: "utmTerm", utm_content: "utmContent", gclid: "gclid", fbclid: "fbclid" };

function collectTracking(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(Object.entries(TRACKED_PARAMS).flatMap(([source, target]) => {
    const value = params.get(source);
    return value ? [[target, value.slice(0, 500)]] : [];
  }));
}

async function fallbackProof(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  try {
    const response = await fetch("/api/lead", { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Verification couldn't load. Please try again or call our office.");
    const challenge = await response.json() as { issuedAt: string; powChallenge: string; powSignature: string };
    if (typeof challenge.issuedAt !== "string" || !challenge.powChallenge || !challenge.powSignature) throw new Error("Verification couldn't load. Please retry.");
    const proof = { powIssuedAt: challenge.issuedAt, powChallenge: challenge.powChallenge, powSignature: challenge.powSignature };
    const powNonce = await solveLeadProof({ ...payload, ...proof }, proof.powIssuedAt);
    return { ...proof, powNonce };
  } catch { throw new Error("Verification couldn't finish. Please try again or call our office."); }
}

async function send(payload: Record<string, unknown>): Promise<{ ok: boolean; verificationFailed: boolean; error?: string }> {
  try {
    const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(25000) });
    const result = await response.json() as { ok?: boolean; error?: string; code?: string };
    return { ok: response.ok && result.ok === true, verificationFailed: response.status === 403 && result.code === "verification_failed", error: result.error };
  } catch { throw new Error("The connection failed. Please try again."); }
}

export async function postLead(formKey: string, fields: LeadFields, pageVariant: string, widget: RecaptchaHandle | null, resume?: File): Promise<LeadResult> {
  try {
    const fileError = resume ? resumeFileError(resume) : null;
    if (fileError) throw new Error(fileError);
    const token = await widget?.getToken();
    const claim = resume && token ? await uploadResume(resume, token) : null;
    const payload = { ...claim, form_key: formKey, form_data: { ...fields, pageVariant, ...collectTracking() } };
    const verified = token ? { ...payload, captchaToken: token } : { ...payload, ...await fallbackProof(payload) };
    let result = await send(verified);
    if (token && result.verificationFailed) result = await send({ ...verified, ...await fallbackProof(verified) });
    if (!result.ok) throw new Error(result.error || "We couldn't send your request. Please try again.");
    return { attachment: resume ? claim ? "uploaded" : "failed" : "none" };
  } catch (error) { throw error instanceof Error ? error : new Error("The connection failed. Please try again."); }
}
