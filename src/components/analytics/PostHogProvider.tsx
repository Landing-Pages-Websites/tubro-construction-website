"use client";

import { useEffect } from "react";
import { analyticsAllowedNow } from "@/lib/consent";
import { readStoredVisitorId } from "@/lib/megaLeadContext";
import { setPostHogClient } from "@/lib/posthog-client";
import { startAnswerTextMarking } from "@/lib/tracking/answer-text";
import { pageTypeFor, superProperties } from "@/lib/tracking/contract";
import { POSTHOG_KEY } from "@/lib/tracking/destination";
import { TRACKING_ENABLED } from "@/lib/tracking/enabled";
import { interactionStartsInit } from "@/lib/tracking/init-gate";
import { flushQueue } from "@/lib/tracking/queue";
import {
  buildPostHogOptions,
  expireStaleCookies,
  probePersistence,
} from "@/lib/tracking/posthog-options";
import { useConsent } from "@/components/consent/useConsent";

const IDLE_INIT_DELAY_MS = 3000;
const INTERACTION_EVENTS = ["pointerdown", "keydown", "scroll"] as const;
// Module-level guard: init must run at most once per page load, even if the
// provider remounts.
let initStarted = false;

async function initPostHog(): Promise<void> {
  if (initStarted || !TRACKING_ENABLED) {
    return;
  }
  initStarted = true;
  // Dynamic import keeps posthog-js out of the initial JS payload.
  const { default: posthog } = await import("posthog-js");
  // The first pointerdown on "Decline" starts this import, so consent can
  // flip while it is in flight, here or in another tab. Re-check before
  // anything is initialised.
  if (!analyticsAllowedNow()) {
    initStarted = false;
    return;
  }
  // Returning visitors from the cookie-based setup still hold the old cookie.
  expireStaleCookies((cookie) => {
    document.cookie = cookie;
  }, POSTHOG_KEY, window.location.hostname);
  // Before init, so the recorder's first snapshot already blocks choice labels.
  startAnswerTextMarking(document);
  posthog.init(
    POSTHOG_KEY,
    buildPostHogOptions(probePersistence(() => window.localStorage)),
  );
  posthog.register(
    superProperties({
      siteId: process.env.NEXT_PUBLIC_MEGA_SITE_ID,
      release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
      vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV,
      pageType: pageTypeFor(window.location.pathname),
    }),
  );
  const visitorId = readStoredVisitorId();
  if (visitorId) posthog.register({ mega_visitor_id: visitorId });
  setPostHogClient(posthog);
  // Queued items carry their own time as an option; live ones pass nothing.
  flushQueue((event, properties, options) =>
    posthog.capture(event, properties, options),
  );
}

/**
 * Lazy PostHog loader for the shared MEGA Websites project. Requires tracking
 * enabled for this deploy (src/lib/tracking/enabled.ts) AND allowed consent
 * (per siteConfig.consentMode); then initializes on first interaction or after
 * 3s idle, whichever comes first, and flushes events queued before init.
 */
export function PostHogProvider(): null {
  const { analyticsAllowed } = useConsent();

  useEffect(() => {
    if (!analyticsAllowed || !TRACKING_ENABLED || initStarted) {
      return;
    }

    const timeoutId = window.setTimeout(trigger, IDLE_INIT_DELAY_MS);

    function cleanup(): void {
      window.clearTimeout(timeoutId);
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, onGesture);
      }
    }

    function onGesture(event: Event): void {
      if (interactionStartsInit(event.target)) trigger();
    }

    function trigger(): void {
      cleanup();
      void initPostHog();
    }

    for (const eventName of INTERACTION_EVENTS) {
      window.addEventListener(eventName, onGesture, { passive: true });
    }

    return cleanup;
  }, [analyticsAllowed]);

  return null;
}
