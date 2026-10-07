import assert from "node:assert/strict";
import test from "node:test";
import { captchaMode, stagingTokenAccepted } from "../src/lib/lead-policy.ts";
import { validateLeadFields } from "../src/lib/lead-validation.ts";
import { createSubmissionLock } from "../src/lib/submission-lock.ts";

const sentinel = "recaptcha-staging-bypass-key";
const preview = "tubro-construction-website-example-mega-websites.vercel.app";
const valid = { name: "Local Test", email: "test@example.com", phone: "(253) 216-2633", projectDetails: "Local intercepted test", projectType: "Kitchen", consent: true };

test("staging requires sanctioned exact host, env and key", () => {
  const env = { VERCEL_ENV: "preview", VERCEL_URL: preview, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: sentinel };
  assert.equal(captchaMode(preview, env), "staging");
  assert.equal(captchaMode("other.vercel.app", env), "denied");
  assert.equal(captchaMode(preview, { ...env, VERCEL_ENV: "production" }), "denied");
  assert.equal(captchaMode("localhost", { ...env, VERCEL_ENV: "development" }), "staging");
  assert.equal(captchaMode("localhost", env), "denied");
});

test("production hosts fail closed and never permit wildcard aliases or sentinel", () => {
  const env = { VERCEL_ENV: "production", RECAPTCHA_HOSTNAMES: "www.tubroconstruction.com,tubroconstruction.com", NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "configured-production-key" };
  assert.equal(captchaMode("www.tubroconstruction.com", env), "enterprise");
  assert.equal(captchaMode("www.tubroconstruction.com.attacker.test", env), "denied");
  assert.equal(captchaMode(preview, { ...env, RECAPTCHA_HOSTNAMES: "*.vercel.app" }), "denied");
  assert.equal(captchaMode("www.tubroconstruction.com", { ...env, RECAPTCHA_HOSTNAMES: "" }), "denied");
  assert.equal(captchaMode("www.tubroconstruction.com", { ...env, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: sentinel }), "denied");
  assert.equal(stagingTokenAccepted("staging", sentinel), true);
  for (const token of ["", "lead-submit", "arbitrary-token"]) assert.equal(stagingTokenAccepted("staging", token), false);
  assert.equal(stagingTokenAccepted("enterprise", sentinel), false);
});

test("shared validation requires full phone, TLD, project fields and boolean consent", () => {
  assert.deepEqual(validateLeadFields(valid, { consent: true, projectType: true }), {});
  for (const phone of ["55512", "123456789", "123456789012", "17576855050", "+1 (253) 216-2633", "12532162633", "++12532162633", "1abc2532162633"]) assert.ok(validateLeadFields({ ...valid, phone }).phone);
  for (const email of ["me@x", "me@x.c", "me@x.123", "me@@x.com", "me@-x.com"]) assert.ok(validateLeadFields({ ...valid, email }).email);
  for (const consent of [false, "true", "yes", 1, undefined]) assert.ok(validateLeadFields({ ...valid, consent }, { consent: true }).consent);
  for (const field of ["name", "projectDetails", "projectType"]) assert.ok(validateLeadFields({ ...valid, [field]: " " }, { projectType: true })[field]);
});

test("submission lock is synchronous and retains success, permits retry after failure", () => {
  const lock = createSubmissionLock();
  assert.equal(lock.acquire(), true); assert.equal(lock.acquire(), false);
  lock.release(); assert.equal(lock.acquire(), true);
  lock.complete(); assert.equal(lock.acquire(), false); lock.release(); assert.equal(lock.acquire(), false);
});
