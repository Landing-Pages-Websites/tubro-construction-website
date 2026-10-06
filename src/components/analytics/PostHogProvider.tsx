"use client";

import { useEffect, type ReactNode } from "react";
import { scheduleWhenIdle } from "./scheduleWhenIdle";

async function initializePostHog(key: string, isActive: () => boolean): Promise<void> {
  try {
    const { default: posthog } = await import("posthog-js");
    if (!isActive() || posthog.__loaded) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  } catch (error) {
    console.error("Unable to initialize PostHog analytics.", error);
  }
}

export function PostHogProvider({ children }: { children: ReactNode }): ReactNode {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    let active = true;
    const cancel = scheduleWhenIdle(() => {
      void initializePostHog(key, () => active);
    });
    return () => {
      active = false;
      cancel();
    };
  }, []);
  return children;
}
