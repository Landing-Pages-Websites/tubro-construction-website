const DOMAIN = "lead-pow-v1";
const DIFFICULTY = 16;
export const PROOF_MAX_AGE = 90_000;
const SOLVE_TIMEOUT = 30_000;
const SOLVE_BATCH_SIZE = 512;
const MAX_NONCE = 2 ** 32;
const excluded = new Set(["captchaToken", "turnstileToken", "captchaAction", "powNonce"]);

function prefix(fields: Record<string, unknown>): string {
  const values = Object.keys(fields).filter((key) => !excluded.has(key) && fields[key] !== undefined).sort().map((key) => [key, JSON.stringify(fields[key])]);
  return JSON.stringify([DOMAIN, ...values, ""]).slice(0, -2);
}

async function bits(text: string): Promise<number> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
  let count = 0;
  for (const byte of digest) {
    if (byte === 0) { count += 8; continue; }
    return count + Math.clz32(byte) - 24;
  }
  return count;
}

export async function solveLeadProof(fields: Record<string, unknown>, issuedAt: string): Promise<string> {
  const base = prefix({ ...fields, powIssuedAt: issuedAt });
  const started = Date.now();
  try {
    for (let start = 0; start < MAX_NONCE; start += SOLVE_BATCH_SIZE) {
      if (Date.now() - started > SOLVE_TIMEOUT) break;
      const nonces = Array.from({ length: SOLVE_BATCH_SIZE }, (_, i) => String(start + i));
      const hashes = await Promise.all(nonces.map((nonce) => bits(`${base}${nonce}"]`)));
      const found = hashes.findIndex((value) => value >= DIFFICULTY);
      if (found !== -1) return nonces[found];
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    throw new Error("Verification timed out. Please retry.");
  } catch { throw new Error("Verification couldn't finish. Please retry or call our office."); }
}

export async function verifyLeadProof(fields: Record<string, unknown>): Promise<boolean> {
  const issuedAt = fields.powIssuedAt;
  const nonce = fields.powNonce;
  if (typeof issuedAt !== "string" || !/^\d{13}$/.test(issuedAt) || typeof nonce !== "string" || !/^\d{1,10}$/.test(nonce)) return false;
  const age = Date.now() - Number(issuedAt);
  if (age < -5000 || age > PROOF_MAX_AGE) return false;
  try { return (await bits(`${prefix(fields)}${nonce}"]`)) >= DIFFICULTY; }
  catch { return false; }
}
