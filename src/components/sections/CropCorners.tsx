import type { ReactElement } from "react";

interface CropCornersProps {
  /** Which corners carry the measured crop-mark brackets. */
  corners?: Array<"tl" | "tr" | "bl" | "br">;
  className?: string;
}

const CORNER_CLASSES: Record<"tl" | "tr" | "bl" | "br", string> = {
  tl: "top-0 left-0 border-t-2 border-l-2",
  tr: "top-0 right-0 border-t-2 border-r-2",
  bl: "bottom-0 left-0 border-b-2 border-l-2",
  br: "bottom-0 right-0 border-b-2 border-r-2",
};

/** Measured crop-mark motif: green L-brackets only where the motif truly terminates. */
export function CropCorners({ corners = ["tl", "br"], className }: CropCornersProps): ReactElement {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      {corners.map((corner) => (
        <span key={corner} className={`absolute size-6 border-action ${CORNER_CLASSES[corner]}`} />
      ))}
    </div>
  );
}
