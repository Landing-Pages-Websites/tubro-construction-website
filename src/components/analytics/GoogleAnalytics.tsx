"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type {} from "@/lib/lead-client";
let lastLocation = "";

function initialize(id: string): void {
  if (document.querySelector('script[data-tubro-ga4]')) return;
  window.dataLayer ??= [];
  // Google's official forwarding contract requires an Arguments object.
  window.gtag = function (): void { window.dataLayer?.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
  const script = document.createElement("script");
  script.async = true; script.dataset.tubroGa4 = id;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

export function GoogleAnalytics(): null {
  const pathname = usePathname();
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA4_ID;
    if (!id || new URLSearchParams(window.location.search).get("embed") === "realwork") return;
    initialize(id);
    const location = window.location.href;
    if (location === lastLocation) return;
    lastLocation = location;
    window.gtag?.("event", "page_view", { send_to: id, page_location: location, page_title: document.title });
  }, [pathname]);
  return null;
}
