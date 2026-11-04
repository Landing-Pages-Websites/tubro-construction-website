/**
 * Site values the shared tracking module (src/lib/consent.ts,
 * src/components/consent/*) reads, in the template's `siteConfig` shape.
 * Lead identity and routing stay in src/lib/lead-*.ts, untouched by tracking.
 */
export interface SiteConfig {
  /** Public-facing brand name, shown in the consent bar. */
  businessName: string;
  /**
   * Cookie-consent behavior (the template's siteConfig.consentMode).
   * - "us-default": analytics load without a click; the bar discloses
   *   analytics and advertising ("Accept cookies" / "Decline"), Decline is an
   *   opt-out, and Google ad consent waits for an explicit Accept. Fleet policy.
   * - "strict": nothing loads until the visitor clicks Accept.
   */
  consentMode: "us-default" | "strict";
}

export const siteConfig: SiteConfig = {
  businessName: "Tubro Construction",
  consentMode: "us-default",
};
