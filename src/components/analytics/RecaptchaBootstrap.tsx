"use client";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export function RecaptchaBootstrap(): null {
  if (typeof document !== "undefined" && SITE_KEY) {
    document.documentElement.dataset.recaptchaSitekey = SITE_KEY;
  }
  return null;
}
