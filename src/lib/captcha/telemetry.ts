import { megaTagEvent } from "@/lib/megaTag";
import { trackEvent } from "@/lib/track";

/**
 * Why the captcha could not produce a token.
 *
 * Kept as distinct values rather than one boolean because the causes have
 * different owners and wildly different frequencies. `script_blocked` is a
 * visitor-side network condition and is expected to dominate; `unconfigured`
 * is a provisioning defect and should be zero. Collapsing them would make the
 * common case hide the one that means a site shipped wrong — the same shape as
 * the go-live check that reported "wrong target" for a site that simply had no
 * captcha.
 */
export type CaptchaUnavailableReason =
  /** No site key in the bundle. A provisioning failure, never a visitor one. */
  | "unconfigured"
  /** The provider's script did not load: ad blocker, DNS sinkhole, firewall. */
  | "script_blocked"
  /** Script loaded, widget would not render. */
  | "render_failed"
  /** The provider's own error callback fired after a successful render. */
  | "runtime_error"
  /** The challenge expired before submit. */
  | "expired"
  /** execute() exceeded its timeout. */
  | "execute_timeout"
  /** execute() threw or the widget was gone by then. */
  | "execute_failed";

/**
 * Record that a visitor could not obtain a captcha token.
 *
 * Reported once per settled attempt, never from a timer that can outlive it:
 * a lead that was sent must not also count here.
 *
 * What it costs the visitor depends on the provider. On Turnstile `/api/lead`
 * fails closed, so the submission never leaves the browser and this counter is
 * the only trace of a lost lead. On reCAPTCHA the proof-of-work fallback
 * delivers it instead (lib/captcha/leadVerification.ts), labelled as
 * unverified, so here it measures how often reCAPTCHA could not vouch.
 *
 * Best-effort by construction. It is called from a form the visitor is trying
 * to submit, so it must never throw, never block and never be the reason a
 * retry fails. No PII: the reason and the provider are the whole payload.
 */
export function reportCaptchaUnavailable(
  reason: CaptchaUnavailableReason,
  provider: "recaptcha" | "turnstile",
): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    megaTagEvent("captcha_unavailable", { reason, provider });
    trackEvent("captcha_unavailable", { reason, provider });
  } catch {
    // An analytics failure must never cost the visitor their retry.
  }
}
