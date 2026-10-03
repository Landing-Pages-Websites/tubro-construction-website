"use client";

import { useEffect } from "react";
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export function RecaptchaBootstrap(): null {
  useEffect(() => {
    document.documentElement.dataset.recaptchaSitekey = SITE_KEY;
  }, []);
  return null;
}
