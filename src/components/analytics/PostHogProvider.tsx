"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { PostHog } from "posthog-js";
import { afterCriticalPaint } from "@/lib/analytics-idle";

let client: PostHog | undefined;
let loading: Promise<void> | undefined;
let lastLocation = "";
const pendingPages: string[] = [];

function flushPages(): void {
  if (!client) return;
  while (pendingPages.length) {
    const location = pendingPages[0];
    client.capture("$pageview", { $current_url: location, $pathname: new URL(location).pathname }, { send_instantly: true });
    pendingPages.shift();
  }
}

async function loadClient(key: string): Promise<void> {
  try {
    const { default: posthog } = await import("posthog-js");
    if (!posthog.__loaded) posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false, capture_pageleave: true, person_profiles: "identified_only",
      opt_out_useragent_filter: true, disable_surveys: true,
    });
    client = posthog;
    flushPages();
  } catch {
    // Keep queued routes for a later navigation retry; analytics cannot block the site.
    loading = undefined;
  }
}

/** No context consumers: keep children mounted and initialize one SDK only when idle. */
export function PostHogProvider({ children }: { children: ReactNode }): ReactNode {
  const pathname = usePathname();
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || new URLSearchParams(window.location.search).get("embed") === "realwork") return;
    const location = window.location.href;
    if (lastLocation !== location) { pendingPages.push(location); lastLocation = location; }
    if (client) {
      try { flushPages(); } catch { /* Preserve queued events if the SDK is unavailable. */ }
      return;
    }
    return afterCriticalPaint(() => { loading ??= loadClient(key); });
  }, [pathname]);
  return children;
}
