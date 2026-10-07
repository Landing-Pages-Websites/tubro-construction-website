import { createHash } from "node:crypto";

/** Independent lead-pow-v1 encoder; no network and no verification bypass. */
export function prove(payload, issuedAt = String(Date.now())) {
  const fields = { ...payload, powIssuedAt: issuedAt };
  const excluded = new Set(["captchaToken", "turnstileToken", "captchaAction", "powNonce"]);
  const values = Object.keys(fields).filter((key) => !excluded.has(key) && fields[key] !== undefined).sort().map((key) => [key, fields[key]]);
  const prefix = JSON.stringify(["lead-pow-v1", ...values, ""]).slice(0, -2);
  for (let nonce = 0; nonce < 2 ** 32; nonce += 1) {
    const hash = createHash("sha256").update(`${prefix}${nonce}"]`).digest();
    if (hash[0] === 0 && hash[1] === 0) return { ...fields, powNonce: String(nonce) };
  }
  throw new Error("Unable to solve fixture");
}
