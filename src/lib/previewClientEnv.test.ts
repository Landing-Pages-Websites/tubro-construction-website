import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { consentHiddenInPreview } from "../components/consent/previewHidden";
import { previewClientEnv } from "./previewClientEnv";

const shown = (env: Record<string, string | undefined>): boolean =>
  !consentHiddenInPreview(previewClientEnv(env).NEXT_PUBLIC_MEGA_PREVIEW_MODE);

test("derivation table: only MEGA_PREVIEW_MODE=1 hides the banner", () => {
  assert.equal(shown({ MEGA_PREVIEW_MODE: "1" }), false);
  for (const v of [undefined, "", "0", "true", " 1", "1 ", "11", "yes"]) {
    assert.equal(shown({ MEGA_PREVIEW_MODE: v }), true, String(v));
  }
});

test("a stray client-only value without MEGA_PREVIEW_MODE is overwritten and the banner shows", () => {
  for (const v of ["1", "true", "0"]) {
    const env = { NEXT_PUBLIC_MEGA_PREVIEW_MODE: v };
    assert.equal(previewClientEnv(env).NEXT_PUBLIC_MEGA_PREVIEW_MODE, "0", v);
    assert.equal(shown(env), true, v);
  }
});

test("next.config.ts inlines the derived value", () => {
  const src = readFileSync(new URL("../../next.config.ts", import.meta.url), "utf8");
  assert.match(src, /\.\.\.previewClientEnv\(\)/);
});
