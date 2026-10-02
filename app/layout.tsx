import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { Fjalla_One, Poppins } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { MobileEstimateCta } from "@/components/shared/MobileEstimateCta";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
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
  title: "Tubro Construction | Residential Remodeling in King & Pierce Counties",
  description:
    "Tubro Construction brings kitchens, bathrooms, additions, and whole-home renovations to life with clear pricing, careful craftsmanship, and an assigned project manager.",
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
      <body><GoogleAnalytics /><RecaptchaBootstrap /><PostHogProvider><Suspense fallback={null}><MobileEstimateCta />{children}</Suspense></PostHogProvider></body>
    </html>
  );
}
