import type { ReactElement } from "react";

interface LedgerListProps {
  items: string[];
  tone?: "ink" | "inverse";
  className?: string;
}

/** Measured ledger bullets: short green dash markers, per the approved frames. */
export function LedgerList({ items, tone = "ink", className }: LedgerListProps): ReactElement {
  const color = tone === "inverse" ? "text-white/90" : "text-ink/85";
  return (
    <ul className={`space-y-3 ${className ?? ""}`}>
      {items.map((item) => (
        <li key={item} className={`flex gap-3 font-fjalla text-[15px] leading-relaxed ${color}`}>
          <span aria-hidden="true" className="mt-2.5 h-0.5 w-5 shrink-0 bg-action" />
          {item}
        </li>
      ))}
    </ul>
  );
}
