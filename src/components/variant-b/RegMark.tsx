import type { ReactElement } from "react";

interface RegMarkProps {
  className?: string;
  tone?: "action" | "ink" | "white";
}

const TONE_CLASSES = {
  action: "text-action",
  ink: "text-ink",
  white: "text-white",
} as const;

export function RegMark({ className, tone = "action" }: RegMarkProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      data-motion="register"
      className={`${TONE_CLASSES[tone]} ${className ?? ""}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1" />
      <circle cx="8" cy="8" r="4.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
