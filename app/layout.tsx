import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { Fjalla_One, Poppins } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://tubro-construction-website.vercel.app"),
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
        <script
          src="https://app.gomega.ai/review-bridge/v7/review-bridge.js"
          integrity="sha384-VTUzMpjogRuXFNsE1df8N2HoJyWhNcCkGaUa7aulmDjCmXVoQ4UpQB1xMTrOp3MJ"
          crossOrigin="anonymous"
          defer
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
