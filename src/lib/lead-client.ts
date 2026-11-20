import { mintCaptchaToken } from "./recaptcha-client";
import type { LeadFields } from "./lead-validation";

const TRACKED_PARAMS = { utm_source: "utmSource", utm_medium: "utmMedium", utm_campaign: "utmCampaign", utm_term: "utmTerm", utm_content: "utmContent", gclid: "gclid", fbclid: "fbclid" };
const POST_TIMEOUT_MS = 60_000; // Covers the server's reCAPTCHA assessment (8 s) and its single receiver attempt (25 s).
export type LeadResult = { ok?: boolean; ignored?: boolean; code?: string; error?: string };

function collectTracking(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(Object.entries(TRACKED_PARAMS).flatMap(([source, target]) => {
    const value = params.get(source);
    return value ? [[target, value.slice(0, 500)]] : [];
  }));
}

const UNVERIFIED_MESSAGE = "We couldn't verify this request. Please refresh the page and try again.";

/** reCAPTCHA is required: without a token the server would refuse the lead, so say so before posting (the form adds the office phone link). */
async function captchaToken(): Promise<string> {
  try { return await mintCaptchaToken(); }
  catch { throw new Error(UNVERIFIED_MESSAGE); }
}

async function send(payload: Record<string, unknown>, token: string): Promise<{ response: Response; result: LeadResult }> {
  try {
    const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, captchaToken: token }), signal: AbortSignal.timeout(POST_TIMEOUT_MS) });
    return { response, result: await response.json() as LeadResult };
  } catch { throw new Error("We couldn't confirm delivery. Please retry or contact our office."); }
}

/** Resolves to the route's confirmed answer ({ok:true}); throws on every other outcome. */
export async function postLead(formKey: string, fields: LeadFields, pageVariant: string): Promise<LeadResult> {
  try {
    const { website = "", ...formFields } = fields;
    const payload = { form_key: formKey, form_data: { ...formFields, pageVariant, ...collectTracking() }, website };
    const outcome = await send(payload, await captchaToken());
    if (!outcome.response.ok || outcome.result.ok !== true) throw new Error(outcome.result.error || "We couldn't send your request. Please try again.");
    return outcome.result;
  } catch (error) { throw error instanceof Error ? error : new Error("The connection failed. Please try again."); }
}
