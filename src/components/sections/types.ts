import type { BackgroundBand, ManifestSection } from "@/lib/manifest";
import type { SectionImage } from "@/lib/section-images";
import type { ResolvedLink } from "@/lib/section-links";

/** Contract every composition-owner section component receives. */
export interface SectionProps {
  section: ManifestSection;
  /** Approved page-owned assets resolved in manifest imagery order. */
  images: SectionImage[];
  band: BackgroundBand;
  /** Blueprint contextual links for this section (CTA destination excluded). */
  links: ResolvedLink[];
  /** Design slug, e.g. "service-area--home-remodeling-tacoma". */
  slug: string;
  /** Public route path, e.g. "/service-area/home-remodeling-tacoma". */
  path: string;
  /**
   * Resolved destination for content.cta — self-referencing CTAs are
   * redirected to the page's own form anchor. Empty when there is no CTA.
   */
  ctaTarget: string;
  /** First section renders the page H1. */
  isFirst: boolean;
}
