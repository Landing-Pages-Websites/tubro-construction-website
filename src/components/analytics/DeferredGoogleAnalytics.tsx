"use client";

import { useEffect, useState, type ReactElement } from "react";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { afterCriticalPaint } from "@/lib/analytics-idle";

/**
 * Mounts the template GA4 loader only after the critical font paint (or the
 * first real interaction), so gtag.js stays out of the first paint as the
 * site's own loader kept it. Consent ordering is unchanged: the template
 * component queues the consent default in the render that inserts gtag.js,
 * and pushDataLayer queues it for any event before that.
 */
export function DeferredGoogleAnalytics(): ReactElement | null {
  const [ready, setReady] = useState(false);
  useEffect(() => afterCriticalPaint(() => setReady(true)), []);
  return ready ? <GoogleAnalytics /> : null;
}
