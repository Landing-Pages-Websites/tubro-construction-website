import { isMegaPreviewMode } from "../mega-preview/preview_mode.mjs";

/**
 * The browser's half of preview mode. next.config.ts inlines this as
 * NEXT_PUBLIC_MEGA_PREVIEW_MODE, derived from the server-side MEGA_PREVIEW_MODE
 * the kit reads, so the repo wires the client flag itself instead of trusting
 * an external launcher to set it. A NEXT_PUBLIC value set without
 * MEGA_PREVIEW_MODE is overwritten with "0": a live build never hides anything.
 */
export function previewClientEnv(
  env: Record<string, string | undefined> = process.env,
): { NEXT_PUBLIC_MEGA_PREVIEW_MODE: "1" | "0" } {
  // The kit's parameter type is inferred from its `process.env` default; it only
  // reads one key, so any string map is a valid input.
  const preview = isMegaPreviewMode(env as NodeJS.ProcessEnv);
  return { NEXT_PUBLIC_MEGA_PREVIEW_MODE: preview ? "1" : "0" };
}
