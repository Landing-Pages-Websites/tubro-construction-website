import type { ReactElement, ReactNode } from "react";
import type { BackgroundBand, ManifestSection } from "@/lib/manifest";

const BAND_CLASSES: Record<BackgroundBand, string> = {
  surface: "bg-plaster",
  white: "bg-white",
  sage: "bg-sage",
};

interface SectionShellProps {
  section: ManifestSection;
  band: BackgroundBand;
  children: ReactNode;
  /** Full-bleed frames (photo-canvas heroes) own their vertical rhythm. */
  bleed?: boolean;
  className?: string;
  labelledBy?: string;
}

/**
 * Composition wrapper: anchors, band background, and the section edge
 * clearance contract (≥32px laptop / ≥24px mobile unless full-bleed).
 * Merged blueprint sections get their own in-flow anchor targets.
 */
export function SectionShell({
  section,
  band,
  children,
  bleed = false,
  className,
  labelledBy,
}: SectionShellProps): ReactElement {
  const extraAnchors = section.source_blueprint_sections.filter(
    (name) => name !== section.name,
  );
  const rhythm = bleed ? "" : "py-14 sm:py-20 lg:py-24";
  return (
    <section
      id={section.name}
      data-section-id={section.id}
      aria-labelledby={labelledBy}
      className={`relative ${BAND_CLASSES[band]} ${rhythm} ${className ?? ""}`}
    >
      {extraAnchors.map((name) => (
        <span key={name} id={name} className="absolute top-0" aria-hidden="true" />
      ))}
      {children}
    </section>
  );
}
