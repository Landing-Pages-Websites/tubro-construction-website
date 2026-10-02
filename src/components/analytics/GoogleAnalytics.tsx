"use client";

import { useEffect } from "react";

export function GoogleAnalytics(): null {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA4_ID;
    if (!id || document.querySelector(`script[data-ga4="${id}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.dataset.ga4 = id;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
    const w = window as typeof window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
    w.dataLayer = w.dataLayer ?? [];
    w.gtag = w.gtag ?? ((...args: unknown[]) => w.dataLayer?.push(args));
    w.gtag("js", new Date());
    w.gtag("config", id);
  }, []);
  return null;
}
