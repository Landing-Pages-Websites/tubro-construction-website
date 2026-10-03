import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { ownedUploadKey } from "./lead-uploads";
import { MAX_REMEMBERED_PROOFS } from "./lead-proof-replay";

const VERSION = "v1";
export const UPLOAD_CAPABILITY_LIFETIME = 15 * 60 * 1000;
const MAX_FUTURE_SKEW = 5000;
const claimed = new Map<string, number>();
type UploadClaim = Record<string, unknown> & { uploadKeys?: unknown; uploadSignedKeys?: unknown; uploadCapability?: unknown; captchaToken?: unknown };

export function submissionBinding(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function signature(keys: readonly string[], binding: string, issuedAt: string, secret: string): string {
  return createHmac("sha256", secret).update(JSON.stringify(["tubro-resume-v1", issuedAt, binding, [...keys].sort()])).digest("base64url");
}

export function issueUploadCapability(keys: readonly string[], binding: string, now = Date.now()): string | null {
  const secret = process.env.LEAD_UPLOAD_SIGNING_SECRET;
  if (!secret || !/^[a-f0-9]{64}$/.test(binding) || keys.length !== 1 || !keys.every(ownedUploadKey)) return null;
  return `${VERSION}.${now}.${signature(keys, binding, String(now), secret)}`;
}

function parsedKeys(value: unknown): string[] | null {
  return Array.isArray(value) && value.length <= 1 && value.every(ownedUploadKey) ? value : null;
}

/** An empty declared subset is valid after a failed PUT; nonempty claims fail closed. */
export function authorizedUploadKeys(body: UploadClaim, now = Date.now()): string[] | null {
  if (body.uploadKeys === undefined) return [];
  const keys = parsedKeys(body.uploadKeys);
  if (!keys || keys.length === 0) return keys;
  const signedKeys = parsedKeys(body.uploadSignedKeys);
  const secret = process.env.LEAD_UPLOAD_SIGNING_SECRET;
  if (!secret || !signedKeys || !keys.every(key => signedKeys.includes(key))) return null;
  if (typeof body.captchaToken !== "string" || !body.captchaToken || typeof body.uploadCapability !== "string") return null;
  const parts = body.uploadCapability.split(".");
  const [version, issuedAt, provided] = parts;
  if (parts.length !== 3 || version !== VERSION || !/^\d{13}$/.test(issuedAt) || !/^[\w-]{43}$/.test(provided)) return null;
  const age = now - Number(issuedAt);
  if (age < -MAX_FUTURE_SKEW || age > UPLOAD_CAPABILITY_LIFETIME) return null;
  const expected = signature(signedKeys, submissionBinding(body.captchaToken), issuedAt, secret);
  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided)) ? keys : null;
}

/** Bounded warm-instance claim; MEGA also owns the persisted one-lead object claim. */
export function consumeUploadClaim(body: UploadClaim, now = Date.now()): boolean {
  const keys = authorizedUploadKeys(body, now);
  if (!keys) return false;
  if (!keys.length) return true;
  const capability = String(body.uploadCapability);
  const claim = submissionBinding(capability);
  if (claimed.size >= MAX_REMEMBERED_PROOFS) {
    for (const [key, expires] of claimed) if (expires < now) claimed.delete(key);
  }
  if (claimed.has(claim) || claimed.size >= MAX_REMEMBERED_PROOFS) return false;
  claimed.set(claim, Number(capability.split(".")[1]) + UPLOAD_CAPABILITY_LIFETIME);
  return true;
}
