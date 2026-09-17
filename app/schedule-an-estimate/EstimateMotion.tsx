"use client";

import { useEffect, useRef, type ReactElement, type ReactNode } from "react";

const EASING = "cubic-bezier(.16,1,.3,1)";

export default function EstimateMotion({ children }: { children: ReactNode }): ReactElement {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const played = new WeakSet<Element>();
    const pending = new Map<HTMLElement, Animation>();
    let disposed = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        const element = target as HTMLElement;
        pending.get(element)?.play();
        if (element.hasAttribute("data-estimate-step")) element.dataset.stepVisible = "true";
        played.add(element);
        observer.unobserve(element);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    const configure = (): void => {
      observer.disconnect();
      pending.forEach((animation) => animation.cancel());
      pending.clear();
      if (preference.matches) return;
      root.current?.querySelectorAll<HTMLElement>("[data-estimate-enter], [data-estimate-step]").forEach((element) => {
        if (played.has(element)) return;
        if (element.hasAttribute("data-estimate-step")) { observer.observe(element); return; }
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        const heading = element.dataset.estimateEnter === "heading";
        const distance = heading && window.innerWidth > 700 ? 22 : 12;
        const animation = element.animate([
          { opacity: 0, transform: `translateY(${distance}px)` },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: heading ? 650 : 500, delay: Number(element.dataset.estimateDelay || 0), easing: EASING, fill: "both" });
        animation.pause();
        animation.onfinish = () => { animation.cancel(); pending.delete(element); };
        pending.set(element, animation);
        observer.observe(element);
      });
    };
    const revealFocus = (event: FocusEvent): void => {
      const target = event.target as HTMLElement;
      const elements = [target.closest<HTMLElement>("[data-estimate-enter]"), ...target.querySelectorAll<HTMLElement>("[data-estimate-enter]")];
      elements.forEach((element) => {
        if (!element) return;
        pending.get(element)?.cancel(); pending.delete(element); played.add(element); observer.unobserve(element);
      });
    };
    configure();
    void document.fonts.ready.then(() => { if (!disposed) configure(); });
    preference.addEventListener("change", configure);
    const element = root.current;
    element?.addEventListener("focusin", revealFocus);
    return () => { disposed = true; observer.disconnect(); pending.forEach((animation) => animation.cancel()); preference.removeEventListener("change", configure); element?.removeEventListener("focusin", revealFocus); };
  }, []);
  return <main ref={root}>{children}</main>;
}
