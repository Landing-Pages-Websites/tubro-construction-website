import type { ReactElement, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

export function Reveal({ children, className, delayMs = 0 }: RevealProps): ReactElement {
  return <div className={`reveal ${className ?? ""}`} data-motion-delay={delayMs}>{children}</div>;
}
