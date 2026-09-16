"use client";

import { useEffect, useRef, type ReactElement } from "react";
import s from "./portfolio.module.css";

export default function MeasuredRule(): ReactElement {
  const rule = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = rule.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!preference.matches) animation = element.animate(
        [{ transform: "scaleX(0)", opacity: 0.4 }, { transform: "scaleX(1)", opacity: 1 }],
        { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      );
    }, { rootMargin: "0px 0px -12% 0px" });
    const stop = (): void => { if (preference.matches) animation?.cancel(); };
    observer.observe(element);
    preference.addEventListener("change", stop);
    return () => { observer.disconnect(); animation?.cancel(); preference.removeEventListener("change", stop); };
  }, []);
  return <span ref={rule} className={s.measuredRule} aria-hidden="true" />;
}
