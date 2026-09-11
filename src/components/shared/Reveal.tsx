"use client";

import { useEffect, useRef } from "react";
import type { ReactElement, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: "0px 0px -6% 0px",
  threshold: 0.05,
};

export function Reveal({ children, className, delayMs }: RevealProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        element.classList.add("is-visible");
        observer.disconnect();
      }
    }, OBSERVER_OPTIONS);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
