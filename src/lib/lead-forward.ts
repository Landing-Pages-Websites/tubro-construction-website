import { upstreamPayload, type LeadPayload } from "./lead-server";

const ENDPOINT = "https://analytics.gomega.ai/submission/submit";
const FORWARD_TIMEOUT_MS = 25_000;
type SubmitResult = { ok: true; id?: string };

async function readResult(response: Response): Promise<SubmitResult> {
  try {
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) throw new Error("The receiver did not confirm delivery.");
    const id = "id" in result && typeof result.id === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(result.id) ? result.id : undefined;
    return { ok: true, ...(id ? { id } : {}) };
  } catch (error) {
    if (error && typeof error === "object" && "name" in error && error.name === "SyntaxError") throw new Error("The receiver returned an unreadable delivery result.");
    throw error;
  }
}

/** One delivery attempt: an ambiguous transport failure is never retried, so a lead is never sent twice. */
export async function forwardLead(body: LeadPayload): Promise<SubmitResult> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(upstreamPayload(body)), signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS) });
  } catch {
    throw new Error("The office connection is unavailable. Please retry or call 253-216-2633.");
  }
  if (!response.ok) throw new Error("The receiver refused the request.");
  return readResult(response);
}
