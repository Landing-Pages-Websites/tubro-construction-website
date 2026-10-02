"use client";

import { useEffect } from "react";
import { loadRecaptcha } from "@/lib/recaptcha-client";
import { STAGING_SENTINEL } from "@/lib/lead-policy";
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export function RecaptchaBootstrap(): null {
  useEffect(() => {
    document.documentElement.dataset.recaptchaSitekey = SITE_KEY;
    if (!SITE_KEY || SITE_KEY === STAGING_SENTINEL) return;
    const prepare = (event: Event): void => {
      if (!(event.target instanceof Element) || !event.target.closest("form")) return;
      void loadRecaptcha().catch(() => { /* The submit path offers the signed proof fallback. */ });
    };
    document.addEventListener("focusin", prepare);
    return () => document.removeEventListener("focusin", prepare);
  }, []);
  return null;
}
