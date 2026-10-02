import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const PROOF_MAX_AGE = 90_000;
const MIN_PROOF_AGE = 750;
const LOCAL_SECRET = randomBytes(32).toString("hex");
const consumed = new Map<string, number>();
export type LeadChallenge = { powIssuedAt: string; powChallenge: string; powSignature: string };

function secret(): string | undefined {
  return process.env.LEAD_PROOF_SECRET || (process.env.VERCEL_ENV === "development" ? LOCAL_SECRET : undefined);
}

export function proofAvailable(): boolean {
  return Boolean(secret() && (process.env.VERCEL_ENV === "development" || (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)));
}

function signature(host: string, issuedAt: string, challenge: string, key: string): string {
  return createHmac("sha256", key).update(JSON.stringify(["tubro-lead-v2", host, issuedAt, challenge])).digest("hex");
}

export function issueChallenge(host: string, key = secret(), now = Date.now()): LeadChallenge | null {
  if (!key) return null;
  const powIssuedAt = String(now);
  const powChallenge = randomBytes(24).toString("hex");
  return { powIssuedAt, powChallenge, powSignature: signature(host, powIssuedAt, powChallenge, key) };
}

export function validChallenge(fields: Record<string, unknown>, host: string, key = secret(), now = Date.now()): boolean {
  const { powIssuedAt, powChallenge, powSignature } = fields;
  if (!key || typeof powIssuedAt !== "string" || typeof powChallenge !== "string" || typeof powSignature !== "string") return false;
  if (!/^\d{13}$/.test(powIssuedAt) || !/^[a-f0-9]{48}$/.test(powChallenge) || !/^[a-f0-9]{64}$/.test(powSignature)) return false;
  const age = now - Number(powIssuedAt);
  if (age < MIN_PROOF_AGE || age > PROOF_MAX_AGE) return false;
  return timingSafeEqual(Buffer.from(powSignature, "hex"), Buffer.from(signature(host, powIssuedAt, powChallenge, key), "hex"));
}

/** Atomic claim in shared storage on Vercel; process memory is development-only. */
export async function consumeChallenge(challenge: string): Promise<boolean> {
  try {
    if (process.env.VERCEL_ENV === "development") {
      for (const [key, expires] of consumed) if (expires < Date.now()) consumed.delete(key);
      if (consumed.has(challenge)) return false;
      consumed.set(challenge, Date.now() + PROOF_MAX_AGE);
      return true;
    }
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return false;
    const response = await fetch(process.env.KV_REST_API_URL, {
      method: "POST", headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["SET", `tubro:lead-proof:${challenge}`, "used", "NX", "EX", String(PROOF_MAX_AGE / 1000)]),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    return (await response.json() as { result?: string }).result === "OK";
  } catch { return false; }
}
