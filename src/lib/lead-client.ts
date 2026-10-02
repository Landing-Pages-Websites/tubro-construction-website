import { mintCaptchaToken } from "./recaptcha-client";
import { solveLeadProof } from "./leadProof";
import type { LeadFields } from "./lead-validation";

declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; } }
const TRACKED_PARAMS = { utm_source: "utmSource", utm_medium: "utmMedium", utm_campaign: "utmCampaign", utm_term: "utmTerm", utm_content: "utmContent", gclid: "gclid", fbclid: "fbclid" };

function collectTracking(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(Object.entries(TRACKED_PARAMS).flatMap(([source, target]) => {
    const value = params.get(source);
    return value ? [[target, value.slice(0, 500)]] : [];
  }));
}

async function verification(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  try { return { captchaToken: await mintCaptchaToken() }; }
  catch {
    const response = await fetch("/api/lead", { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Verification couldn't load. Please try again or call our office.");
    const challenge = await response.json() as { powIssuedAt: string; powChallenge: string; powSignature: string };
    const fields = { ...payload, ...challenge };
    const powNonce = await solveLeadProof(fields, challenge.powIssuedAt);
    const remaining = 800 - (Date.now() - Number(challenge.powIssuedAt));
    if (remaining > 0) await new Promise((resolve) => window.setTimeout(resolve, remaining));
    return { ...challenge, powNonce };
  }
}

export async function postLead(formKey: string, fields: LeadFields, pageVariant: string): Promise<void> {
  try {
    const payload = { form_key: formKey, form_data: { ...fields, pageVariant, ...collectTracking() } };
    const proof = await verification(payload);
    const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, ...proof }), signal: AbortSignal.timeout(25000) });
    const result = await response.json() as { ok?: boolean; error?: string };
    if (!response.ok || result.ok !== true) throw new Error(result.error || "We couldn't send your request. Please try again.");
  } catch (error) { throw error instanceof Error ? error : new Error("The connection failed. Please try again."); }
}
