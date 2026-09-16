import type { ReactElement } from "react";

interface CaptionTabProps {
  label: string;
  /** Placement against the photo edge, per the approved frames. */
  position?: "bottom-left" | "bottom-right" | "top-left";
  className?: string;
}

const POSITIONS: Record<NonNullable<CaptionTabProps["position"]>, string> = {
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
  "top-left": "top-3 left-3",
};

/** Approved photo caption tab: white field, green border, identifies source role only. */
export function CaptionTab({ label, position = "bottom-left", className }: CaptionTabProps): ReactElement {
  return (
    <span
      className={`absolute ${POSITIONS[position]} border border-action bg-white px-2.5 py-1 font-poppins text-xs font-semibold text-action-deep shadow-sm ${className ?? ""}`}
    >
      {label}
    </span>
  );
}
