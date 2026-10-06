"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { afterCriticalPaint } from "@/lib/analytics-idle";
import type {} from "@/lib/lead-client";
let lastLocation = "";
let initialized = false;

function initialize(id: string): void {
  if (initialized) return;
  window.dataLayer ??= [];
  // Google's official forwarding contract requires an Arguments object.
  window.gtag = function (): void { window.dataLayer?.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
  initialized = true;
}

function loadTag(id: string): void {
  if (document.querySelector('script[data-tubro-ga4]')) return;
  const script = document.createElement("script");
  script.async = true; script.dataset.tubroGa4 = id;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  // A failed transfer must not prevent a later navigation from retrying the tag.
  script.onerror = () => script.remove();
  document.head.appendChild(script);
}

export function GoogleAnalytics(): null {
  const pathname = usePathname();
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA4_ID;
    if (!id || new URLSearchParams(window.location.search).get("embed") === "realwork") return;
    initialize(id);
    const location = window.location.href;
    if (location !== lastLocation) {
      lastLocation = location;
      window.gtag?.("event", "page_view", { send_to: id, page_location: location, page_title: document.title });
    }
    return afterCriticalPaint(() => loadTag(id));
  }, [pathname]);
  return null;
}
