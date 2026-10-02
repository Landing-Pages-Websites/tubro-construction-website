"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

let lastLocation = "";
const INITIALIZATION_DELAY = 800;

function capturePage(): void {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  if (!posthog.__loaded) posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false, capture_pageleave: true, person_profiles: "identified_only",
    opt_out_useragent_filter: true, disable_surveys: true,
  });
  if (lastLocation === window.location.href) return;
  lastLocation = window.location.href;
  posthog.capture("$pageview", { $current_url: lastLocation }, { send_instantly: true });
}

/** Keep the SDK's real provider mounted through SSR, hydration and navigation. */
export function PostHogProvider({ children }: { children: ReactNode }): ReactNode {
  const pathname = usePathname();
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || new URLSearchParams(window.location.search).get("embed") === "realwork") return;
    const timer = window.setTimeout(() => {
      try { capturePage(); }
      catch { /* Analytics failure must not prevent reading or submitting the site. */ }
    }, INITIALIZATION_DELAY);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
