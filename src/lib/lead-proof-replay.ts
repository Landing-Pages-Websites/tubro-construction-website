import { createHash } from "node:crypto";
import { PROOF_MAX_AGE } from "./leadProof";

export { PROOF_MAX_AGE } from "./leadProof";
export const MAX_REMEMBERED_PROOFS = 100_000;
type ProofClaim = "claimed" | "replay" | "capacity";
type ReplayGuard = { consume: (key: string, issuedAt: number, now: number) => ProofClaim };

/** Canonical instance-local contract: never evict fresh proofs to make room. */
export function createProofReplayGuard(capacity = MAX_REMEMBERED_PROOFS): ReplayGuard {
  const seen = new Map<string, number>();
  return {
    consume(proofKey, issuedAt, now) {
      const key = createHash("sha256").update(proofKey).digest("base64");
      if (seen.size >= capacity) {
        for (const [entry, expires] of seen) if (expires < now) seen.delete(entry);
      }
      if (seen.has(key)) return "replay";
      if (seen.size >= capacity) return "capacity";
      seen.set(key, issuedAt + PROOF_MAX_AGE);
      return "claimed";
    },
  };
}
