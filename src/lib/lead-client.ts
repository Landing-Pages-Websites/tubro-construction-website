import { mintCaptchaToken } from "./recaptcha-client";
import { solveLeadProof } from "./leadProof";
import type { LeadFields } from "./lead-validation";

declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; } }
const TRACKED_PARAMS = { utm_source: "utmSource", utm_medium: "utmMedium", utm_campaign: "utmCampaign", utm_term: "utmTerm", utm_content: "utmContent", gclid: "gclid", fbclid: "fbclid" };
const POST_TIMEOUT_MS = 60_000; // Two bounded receiver attempts can take 25 seconds each.
type Verification = { captchaToken: string } | { powIssuedAt: string; powNonce: string };
type LeadResult = { ok?: boolean; code?: string; error?: string };

function collectTracking(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(Object.entries(TRACKED_PARAMS).flatMap(([source, target]) => {
    const value = params.get(source);
    return value ? [[target, value.slice(0, 500)]] : [];
  }));
}

async function fallback(payload: Record<string, unknown>): Promise<Verification> {
  try {
    const response = await fetch("/api/lead", { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Verification couldn't load. Please try again or call our office.");
    const challenge = await response.json() as { issuedAt?: unknown };
    if (typeof challenge.issuedAt !== "string" || !/^\d{13}$/.test(challenge.issuedAt)) throw new Error("Verification returned an invalid timestamp. Please retry.");
    return { powIssuedAt: challenge.issuedAt, powNonce: await solveLeadProof(payload, challenge.issuedAt) };
  } catch (error) { throw error instanceof Error ? error : new Error("Verification is unavailable. Please retry."); }
}

async function verification(payload: Record<string, unknown>): Promise<Verification> {
  try { return { captchaToken: await mintCaptchaToken() }; }
  catch { return fallback(payload); }
}

async function send(payload: Record<string, unknown>, proof: Verification): Promise<{ response: Response; result: LeadResult }> {
  try {
    const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, ...proof }), signal: AbortSignal.timeout(POST_TIMEOUT_MS) });
    return { response, result: await response.json() as LeadResult };
  } catch { throw new Error("We couldn't confirm delivery. Please retry or contact our office."); }
}

export async function postLead(formKey: string, fields: LeadFields, pageVariant: string): Promise<void> {
  try {
    const { website = "", ...formFields } = fields;
    const payload = { form_key: formKey, form_data: { ...formFields, pageVariant, ...collectTracking() }, website };
    const proof = await verification(payload);
    let outcome = await send(payload, proof);
    if ("captchaToken" in proof && outcome.response.status === 403 && outcome.result.code === "verification_failed") {
      outcome = await send(payload, await fallback(payload));
    }
    if (!outcome.response.ok || outcome.result.ok !== true) throw new Error(outcome.result.error || "We couldn't send your request. Please try again.");
  } catch (error) { throw error instanceof Error ? error : new Error("The connection failed. Please try again."); }
}
