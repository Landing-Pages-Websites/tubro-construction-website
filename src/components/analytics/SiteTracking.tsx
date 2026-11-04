"use client";

import type { ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import { DeferredGoogleAnalytics } from "@/components/analytics/DeferredGoogleAnalytics";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { TrackingListeners } from "@/components/analytics/TrackingListeners";
import { ConsentBanner } from "@/components/consent/ConsentBanner";

/** The live portfolio iframe (/recent-projects?embed=realwork) inside the site's own pages. */
const PORTFOLIO_EMBED = "realwork";

/**
 * The consent bar and every analytics loader, mounted once per page. The
 * same-origin portfolio iframe gets none of them, as before: the parent page
 * already asks and reports, and the shared consent store reaches the frame.
 */
export function SiteTracking(): ReactElement | null {
  const search = useSearchParams();
  if (search.get("embed") === PORTFOLIO_EMBED) return null;
  return (
    <>
      <ConsentBanner />
      <DeferredGoogleAnalytics />
      <PostHogProvider />
      <TrackingListeners />
    </>
  );
}
