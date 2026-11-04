import type { NextConfig } from "next";
import { POSTHOG_ASSETS_HOST, POSTHOG_HOST } from "./src/lib/tracking/destination";
import { previewClientEnv } from "./src/lib/previewClientEnv";
import { trackingBuildWarning, trackingClientEnv } from "./src/lib/tracking/client-env";
import { withMegaPreview } from "./src/mega-preview/preview_config.mjs";

// Production 308s `/page/` to `/page`. skipTrailingSlashRedirect (needed by the
// PostHog proxy) turns Next's own redirect off, so this rule keeps it for every
// path except the proxy's.
const TRAILING_SLASH_REDIRECT = { source: "/:path((?!ingest/).+)/", destination: "/:path", permanent: true };

// Same-origin reverse proxy for PostHog (PostHog's documented Next.js
// pattern) so analytics requests are not blocked by ad blockers.
const POSTHOG_REWRITES = [
  { source: "/ingest/static/:path*", destination: `${POSTHOG_ASSETS_HOST}/static/:path*` },
  { source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` },
];

// A build that ships with tracking off says so instead of silently sending nothing.
const trackingWarning = trackingBuildWarning();
if (trackingWarning) console.warn(trackingWarning);

const nextConfig: NextConfig = {
  env: {
    // Derived from MEGA_PREVIEW_MODE so the client flag is wired by this repo,
    // and a stray NEXT_PUBLIC value can never hide the live banner.
    ...previewClientEnv(),
    // The tracking gate's deployment values, derived from the VERCEL_* names
    // Vercel always sets at build (src/lib/tracking/client-env.ts).
    ...trackingClientEnv(),
  },
  images: {
    remotePatterns: [{
      // MEGA-published article hero images for this customer only.
      protocol: "https",
      hostname: "zleague-public-prod.s3.us-east-2.amazonaws.com",
      pathname: "/article_images/b002784f-9543-4362-8814-b7da19078f23/**",
      search: "",
    },
    {
      protocol: "https",
      hostname: "zleague-public-prod.s3.us-east-2.amazonaws.com",
      pathname: "/article_images/b002784f-9543-4362-8814-b7da19078f23/how-much-does-a-kitchen-remodel-cost-in-king-county-622939.webp",
      search: "",
    }],
  },
  async redirects() {
    return [
      // Approved articles link to these paths; the posts live at the destinations.
      { source: "/how-to-hire-a-remodeling-contractor-western-washington", destination: "/blog/how-to-hire-a-remodeling-contractor-western-washington", permanent: true },
      { source: "/bathroom-remodel-cost-western-washington", destination: "/bathroom-remodel-cost-in-western-washington", permanent: true },
      TRAILING_SLASH_REDIRECT,
    ];
  },
  async rewrites() {
    return POSTHOG_REWRITES;
  },
  // Required for the PostHog proxy: its API calls can use trailing slashes,
  // which Next would otherwise redirect (dropping the POST body).
  skipTrailingSlashRedirect: true,
};

export default withMegaPreview(nextConfig);
