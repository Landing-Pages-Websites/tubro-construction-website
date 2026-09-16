import type { ReactElement } from "react";

interface EyebrowProps {
  children: string;
  tone?: "ink" | "inverse";
}

/** Measured eyebrow: short green datum dash + Fjalla small caps, per the approved frames. */
export function Eyebrow({ children, tone = "ink" }: EyebrowProps): ReactElement {
  const color = tone === "inverse" ? "text-white/90" : "text-action-deep";
  return (
    <p className={`flex items-center gap-2.5 font-fjalla text-xs tracking-[0.12em] uppercase ${color}`}>
      <span aria-hidden="true" className="h-0.5 w-6 shrink-0 bg-action" />
      {children}
    </p>
  );
}
