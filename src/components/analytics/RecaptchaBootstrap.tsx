"use client";

import { useEffect } from "react";
import { isEnterpriseSiteKey, loadRecaptcha } from "@/lib/recaptcha-client";
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export function RecaptchaBootstrap(): null {
  useEffect(() => {
    document.documentElement.dataset.recaptchaSitekey = SITE_KEY;
    if (!isEnterpriseSiteKey(SITE_KEY)) return;
    const prepare = (event: Event): void => {
      if (!(event.target instanceof Element) || !event.target.closest("form")) return;
      void loadRecaptcha().catch(() => { /* The submit path offers the payload-bound proof fallback. */ });
    };
    document.addEventListener("focusin", prepare);
    return () => document.removeEventListener("focusin", prepare);
  }, []);
  return null;
}
