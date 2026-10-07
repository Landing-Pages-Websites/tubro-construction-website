import { randomUUID } from "node:crypto";
import { upstreamPayload, type LeadAuthorization, type LeadPayload } from "./lead-server";

const ENDPOINT = "https://analytics.gomega.ai/submission/submit";
const CLAIM_TOKEN_PATTERN = /^[0-9a-f]{64}$/;
const FORWARD_TIMEOUT_MS = 25_000;
const MAX_CLAIM_ATTEMPTS = 2;
const REFUSALS = new Set([400, 401, 403, 409]);
type SubmitResult = { ok: true; id?: string };
type ForwardRequest = { body: string; headers: Record<string, string>; claim: boolean };

export class LeadClaimRefused extends Error {}
class InvalidUpstreamResult extends Error {}

function forwardRequest(body: LeadPayload, authorization: LeadAuthorization): ForwardRequest {
  const payload = upstreamPayload(body, authorization);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authorization === "captcha") return { body: JSON.stringify(payload), headers, claim: false };
  const token = process.env.LEAD_PROOF_CLAIM_TOKEN?.trim();
  if (!token || !CLAIM_TOKEN_PATTERN.test(token)) throw new Error("Fallback delivery is unavailable: claim credential is not configured.");
  // One ID per inbound POST, before retrying. Proof covers the exact raw email.
  payload.proof_claim = { issued_at: body.powIssuedAt, nonce: body.powNonce, email: body.form_data.email, attempt_id: randomUUID() };
  headers["x-mega-proof-claim-token"] = token;
  return { body: JSON.stringify(payload), headers, claim: true };
}

async function readResult(response: Response, claim: boolean): Promise<SubmitResult> {
  try {
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) throw new InvalidUpstreamResult("The receiver did not confirm delivery.");
    if (claim && (!("proof_claim" in result) || (result.proof_claim !== "claimed" && result.proof_claim !== "retry"))) throw new InvalidUpstreamResult("The receiver did not confirm the proof claim.");
    const id = "id" in result && typeof result.id === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(result.id) ? result.id : undefined;
    return { ok: true, ...(id ? { id } : {}) };
  } catch (error) {
    if (error && typeof error === "object" && "name" in error && error.name === "SyntaxError") throw new InvalidUpstreamResult("The receiver returned an unreadable delivery result.");
    throw error;
  }
}

async function sendAttempt(request: ForwardRequest): Promise<SubmitResult | null> {
  try {
    const response = await fetch(ENDPOINT, { method: "POST", headers: request.headers, body: request.body, signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS) });
    if (request.claim && REFUSALS.has(response.status)) throw new LeadClaimRefused("The receiver refused this verification proof.");
    if (response.ok) return await readResult(response, request.claim);
    if (response.status >= 500) return null;
    throw new InvalidUpstreamResult("The receiver refused the request.");
  } catch (error) {
    if (error instanceof LeadClaimRefused || error instanceof InvalidUpstreamResult) throw error;
    return null; // Transport failures are ambiguous; only claimed delivery can retry safely.
  }
}

export async function forwardLead(body: LeadPayload, authorization: LeadAuthorization): Promise<SubmitResult> {
  try {
    const request = forwardRequest(body, authorization);
    const attempts = request.claim ? MAX_CLAIM_ATTEMPTS : 1;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const result = await sendAttempt(request);
      if (result) return result;
    }
    throw new Error("The office connection is unavailable. Please retry or call 253-216-2633.");
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unable to confirm lead delivery.");
  }
}
