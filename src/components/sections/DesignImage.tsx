import Image from "next/image";
import type { ReactElement } from "react";
import type { SectionImage } from "@/lib/section-images";
import { CaptionTab } from "@/components/sections/CaptionTab";

interface DesignImageProps {
  image: SectionImage;
  /** Aspect/height classes for the slot; intrinsic geometry never sets section height. */
  frameClassName: string;
  sizes: string;
  priority?: boolean;
  withTab?: boolean;
  tabPosition?: "bottom-left" | "bottom-right" | "top-left";
  /** object-position override to honor a frame's focal crop. */
  objectPosition?: string;
}

/** Approved page-owned photograph in a responsive slot with its caption tab. */
export function DesignImage({
  image,
  frameClassName,
  sizes,
  priority = false,
  withTab = true,
  tabPosition = "bottom-left",
  objectPosition,
}: DesignImageProps): ReactElement {
  return (
    <div className={`relative overflow-hidden ${frameClassName}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />
      {withTab && image.label && <CaptionTab label={image.label} position={tabPosition} />}
    </div>
  );
}
