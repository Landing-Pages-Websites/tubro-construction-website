"use client";

import { useEffect } from "react";
import { scheduleWhenIdle } from "./scheduleWhenIdle";

let configured = false;

function queueGoogleAnalytics(id: string): void {
  const w = window as typeof window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer ?? [];
  w.gtag = w.gtag ?? ((...args: unknown[]) => w.dataLayer?.push(args));
  if (configured) return;
  w.gtag("js", new Date());
  w.gtag("config", id);
  configured = true;
}

function loadGoogleAnalytics(id: string): void {
  if (document.querySelector(`script[data-ga4="${id}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.dataset.ga4 = id;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

export function GoogleAnalytics(): null {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA4_ID;
    if (!id || document.querySelector(`script[data-ga4="${id}"]`)) return;
    queueGoogleAnalytics(id);
    return scheduleWhenIdle(() => loadGoogleAnalytics(id));
  }, []);
  return null;
}
