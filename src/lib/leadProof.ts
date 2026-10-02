const DOMAIN = "lead-pow-v1";
const DIFFICULTY = 16;
const MAX_AGE = 90_000;
const SOLVE_TIMEOUT = 30_000;
const excluded = new Set(["captchaToken", "turnstileToken", "captchaAction", "powNonce"]);

function prefix(fields: Record<string, unknown>): string {
  const values = Object.keys(fields).filter((key) => !excluded.has(key) && fields[key] !== undefined).sort().map((key) => [key, fields[key]]);
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
  for (let nonce = 0; nonce < 2 ** 32; nonce += 1) {
    if (Date.now() - started > SOLVE_TIMEOUT) throw new Error("Verification timed out. Please retry.");
    const value = String(nonce);
    if (await bits(`${base}${value}"]`) >= DIFFICULTY) return value;
    if (nonce % 512 === 0) await new Promise((resolve) => setTimeout(resolve, 0));
  }
  throw new Error("proof unavailable");
}

export async function verifyLeadProof(fields: Record<string, unknown>): Promise<boolean> {
  const issuedAt = fields.powIssuedAt;
  const nonce = fields.powNonce;
  if (typeof issuedAt !== "string" || !/^\d{13}$/.test(issuedAt) || typeof nonce !== "string" || !/^\d{1,10}$/.test(nonce)) return false;
  const age = Date.now() - Number(issuedAt);
  if (age < -5000 || age > MAX_AGE) return false;
  return (await bits(`${prefix(fields)}${nonce}"]`)) >= DIFFICULTY;
}
