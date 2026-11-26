import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { Fjalla_One, Poppins } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { MobileEstimateCta } from "@/components/shared/MobileEstimateCta";
import { SiteTracking } from "@/components/analytics/SiteTracking";
import { siteMetadata, businessSchema } from "@/lib/seo";
import { RecaptchaBootstrap } from "@/components/analytics/RecaptchaBootstrap";
import { AttributionCapture } from "@/components/analytics/AttributionCapture";
import { megaPreviewNavScript } from "@/mega-preview/preview_nav.mjs";

const GTM_CONTAINER_ID = "GTM-WZRPX472";
const CTM_SCRIPT_SRC = "https://572388.tctm.co/t.js";
const OPTIMIZER_SCRIPT_SRC = "https://cdn.gomega.ai/scripts/optimizer.min.js";
const REVIEW_BRIDGE_SCRIPT_SRC = "https://app.gomega.ai/review-bridge/latest/review-bridge.js";
// Loads the same four tags the head used to inject immediately. Waiting until
// the first paint (or the first tap) keeps GTM, CallTrackingMetrics, the MEGA
// optimizer, and the review bridge off the mobile main thread during LCP.
const DEFERRED_TRACKING = `(function(){var started=false;var tags={optimizer:${JSON.stringify(OPTIMIZER_SCRIPT_SRC)},reviewBridge:${JSON.stringify(REVIEW_BRIDGE_SCRIPT_SRC)},gtm:"https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}",callTracking:${JSON.stringify(CTM_SCRIPT_SRC)}};function inject(src,defer){var s=document.createElement("script");s.src=src;s.async=!defer;if(defer)s.defer=true;document.head.appendChild(s);}function start(){if(started)return;started=true;["pointerdown","keydown","touchstart"].forEach(function(e){window.removeEventListener(e,start);});window.MEGA_TAG_CONFIG={siteKey:"9408e00b76f9qp21"};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";inject(tags.optimizer,false);inject(tags.reviewBridge,true);window.dataLayer=window.dataLayer||[];window.dataLayer.push({"gtm.start":new Date().getTime(),event:"gtm.js"});inject(tags.gtm,false);inject(tags.callTracking,false);}["pointerdown","keydown","touchstart"].forEach(function(e){window.addEventListener(e,start,{passive:true});});function arm(){var run=function(){if(window.requestIdleCallback)window.requestIdleCallback(start,{timeout:1500});else window.setTimeout(start,1200);};if(window.requestAnimationFrame)window.requestAnimationFrame(function(){window.requestAnimationFrame(run);});else run();}if(document.fonts&&document.fonts.ready)document.fonts.ready.then(arm,arm);else window.addEventListener("load",arm);})();`;

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Next 15 emits the same Poppins family for both declarations; keep every real weight.
const poppinsDeferred = Poppins({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

const fjallaOne = Fjalla_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fjalla",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tubroconstruction.com"),
  ...siteMetadata("Tubro Construction | King & Pierce County Remodeling", "Plan your kitchen, bathroom, addition or whole-home remodel with Tubro Construction. Serving King and Pierce Counties with free estimates.", "/"),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  const navScript = megaPreviewNavScript();
  return (
    <html lang="en" className={`${poppins.variable} ${poppinsDeferred.variable} ${fjallaOne.variable}`}>
      <head>
        {navScript ? <script dangerouslySetInnerHTML={{ __html: navScript }} /> : null}
        <script dangerouslySetInnerHTML={{ __html: DEFERRED_TRACKING }} />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <nav aria-label="Skip navigation"><a className="skip-link" href="#main-content">Skip to main content</a></nav>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
        <RecaptchaBootstrap />
        <AttributionCapture />
        {children}
        <Suspense fallback={null}><MobileEstimateCta /></Suspense>
        <Suspense fallback={null}><SiteTracking /></Suspense>
      </body>
    </html>
  );
}
