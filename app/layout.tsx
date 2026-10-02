import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { Fjalla_One, Poppins } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { MobileEstimateCta } from "@/components/shared/MobileEstimateCta";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { siteMetadata, businessSchema } from "@/lib/seo";
import { RecaptchaBootstrap } from "@/components/analytics/RecaptchaBootstrap";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <html lang="en" className={`${poppins.variable} ${fjallaOne.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `window.MEGA_TAG_CONFIG={siteKey:"9408e00b76f9qp21"};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";` }} />
        <script src="https://cdn.gomega.ai/scripts/optimizer.min.js" async />
        <script
          src="https://app.gomega.ai/review-bridge/v7/review-bridge.js"
          integrity="sha384-VTUzMpjogRuXFNsE1df8N2HoJyWhNcCkGaUa7aulmDjCmXVoQ4UpQB1xMTrOp3MJ"
          crossOrigin="anonymous"
          defer
        />
      </head>
      <body>
        <nav aria-label="Skip navigation"><a className="skip-link" href="#main-content">Skip to main content</a></nav>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
        <GoogleAnalytics /><RecaptchaBootstrap />
        <PostHogProvider>{children}<Suspense fallback={null}><MobileEstimateCta /></Suspense></PostHogProvider>
      </body>
    </html>
  );
}
