"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Prepare offscreen text only; visible content never flashes back to a hidden state. */
export function useTextEntrances(): RefObject<HTMLElement | null> {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    const played = new WeakSet<Element>();
    const pending = new Map<HTMLElement, Animation>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        pending.get(target as HTMLElement)?.play();
        played.add(target);
        observer.unobserve(target);
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.05 });
    const configure = (): void => {
      observer.disconnect();
      pending.forEach((animation) => animation.cancel());
      pending.clear();
      if (preference.matches) return;
      root.current?.querySelectorAll<HTMLElement>("[data-text-enter]").forEach((element) => {
        if (played.has(element) || element.getBoundingClientRect().top < window.innerHeight) return;
        const heading = element.dataset.textEnter === "heading";
        const distance = window.innerWidth < 700 ? 16 : 24;
        const animation = element.animate([
          { opacity: 0, transform: `translateY(${heading ? distance : 12}px)` },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: heading ? 680 : 520, delay: Number(element.dataset.textDelay || 0), easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
        animation.pause();
        animation.onfinish = () => { animation.cancel(); pending.delete(element); };
        pending.set(element, animation);
        observer.observe(element);
      });
    };
    configure();
    void document.fonts.ready.then(() => { if (!disposed) configure(); });
    preference.addEventListener("change", configure);
    const revealFocus = (event: FocusEvent): void => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-text-enter]");
      if (target) { pending.get(target)?.cancel(); pending.delete(target); played.add(target); observer.unobserve(target); }
    };
    const element = root.current;
    element?.addEventListener("focusin", revealFocus);
    return () => { disposed = true; observer.disconnect(); pending.forEach((animation) => animation.cancel()); preference.removeEventListener("change", configure); element?.removeEventListener("focusin", revealFocus); };
  }, []);
  return root;
}
