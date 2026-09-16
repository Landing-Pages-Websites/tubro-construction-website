import type { ReactElement } from "react";
import type { ManifestSection } from "@/lib/manifest";
import { Eyebrow } from "@/components/sections/Eyebrow";

interface SectionIntroProps {
  section: ManifestSection;
  headingId: string;
  as?: "h1" | "h2";
  tone?: "ink" | "inverse";
  /** loud = display scale; quiet = editorial scale (from page_flow weights). */
  size?: "loud" | "quiet";
  className?: string;
}

/** Eyebrow + headline + supporting copy cluster shared by the approved frames. */
export function SectionIntro({
  section,
  headingId,
  as: Heading = "h2",
  tone = "ink",
  size,
  className,
}: SectionIntroProps): ReactElement {
  const weight = size ?? section.weight;
  const headlineColor = tone === "inverse" ? "text-white" : "text-ink";
  const bodyColor = tone === "inverse" ? "text-white/85" : "text-ink/80";
  const scale =
    weight === "loud"
      ? "text-4xl sm:text-5xl lg:text-[54px] leading-[1.04]"
      : "text-3xl sm:text-4xl leading-[1.08]";
  return (
    <div className={className}>
      <Eyebrow tone={tone}>{section.content.eyebrow}</Eyebrow>
      <Heading
        id={headingId}
        className={`mt-4 max-w-2xl font-poppins font-bold tracking-tight ${scale} ${headlineColor}`}
      >
        {section.content.headline}
      </Heading>
      {section.content.body && (
        <p className={`mt-5 max-w-xl font-fjalla text-base leading-relaxed sm:text-lg ${bodyColor}`}>
          {section.content.body}
        </p>
      )}
    </div>
  );
}
