import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createProofReplayGuard, PROOF_MAX_AGE } from "./lead-proof-replay";

const MAX_FUTURE_SKEW = 5_000;
const replayGuard = createProofReplayGuard();
export type LeadChallenge = { powIssuedAt: string; powChallenge: string; powSignature: string };

function secret(): string | undefined {
  return process.env.LEAD_UPLOAD_SIGNING_SECRET;
}

export function proofAvailable(): boolean {
  return Boolean(secret());
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
  if (age < -MAX_FUTURE_SKEW || age > PROOF_MAX_AGE) return false;
  return timingSafeEqual(Buffer.from(powSignature, "hex"), Buffer.from(signature(host, powIssuedAt, powChallenge, key), "hex"));
}

/** One synchronous claim per signed challenge in the shared warm instance. */
export function consumeChallenge(challenge: string, issuedAt: number): boolean {
  return replayGuard.consume(challenge, issuedAt, Date.now()) === "claimed";
}
