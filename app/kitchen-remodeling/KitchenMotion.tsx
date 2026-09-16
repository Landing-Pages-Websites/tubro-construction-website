"use client";

import { useEffect, useRef, type ReactElement, type ReactNode } from "react";

const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const STEP_DELAY = 65;

interface MotionTarget {
  element: HTMLElement;
  frames: Keyframe[];
  duration: number;
  delay: number;
}

function targetsFor(root: HTMLElement): MotionTarget[] {
  const photos = Array.from(root.querySelectorAll<HTMLImageElement>("main section img"));
  const details = Array.from(root.querySelectorAll<HTMLElement>("main h2, main ol > li"));
  return [
    ...photos.map((element) => ({ element, duration: 850, delay: 0,
      frames: [{ transform: "scale(1.055)" }, { transform: "scale(1)" }] })),
    ...details.map((element) => ({ element, duration: 600,
      delay: element.matches("li") ? Math.min(Array.from(element.parentElement!.children).indexOf(element), 3) * STEP_DELAY : 0,
      frames: [{ opacity: 0.25, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }] })),
  ];
}

function processLine(root: HTMLElement): MotionTarget[] {
  const element = root.querySelector<HTMLElement>("#process-faq ol")?.previousElementSibling;
  if (!(element instanceof HTMLElement)) return [];
  const horizontal = window.matchMedia("(min-width: 1024px)").matches;
  return [{ element, duration: 900, delay: 0, frames: [
    { transform: horizontal ? "scaleX(0)" : "scaleY(0)", transformOrigin: "top left" },
    { transform: horizontal ? "scaleX(1)" : "scaleY(1)", transformOrigin: "top left" },
  ] }];
}

function observeMotion(root: HTMLElement): () => void {
  const animations = new Set<Animation>();
  const targets = new Map(targetsFor(root).concat(processLine(root)).map(target => [target.element, target]));
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      const target = targets.get(entry.target as HTMLElement);
      if (!target || !target.element.getClientRects().length) return;
      observer.unobserve(entry.target);
      const animation = target.element.animate(target.frames, {
        duration: target.duration, delay: target.delay, easing: EASING, fill: "backwards",
      });
      animations.add(animation);
      animation.onfinish = () => { animations.delete(animation); };
    });
  }, { threshold: 0.12 });
  targets.forEach(target => {
    const rect = target.element.getBoundingClientRect();
    // Already-visible copy stays put during hydration and restored scroll positions.
    if (rect.top < window.innerHeight && rect.bottom > 0 && target.element.tagName !== "IMG") return;
    observer.observe(target.element);
  });
  return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
}

/** Route-only enhancement: all content remains visible without scripts or motion. */
export function KitchenMotion({ children }: { children: ReactNode }): ReactElement {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = (): void => {};
    const sync = (): void => {
      cleanup();
      cleanup = !preference.matches && root.current ? observeMotion(root.current) : (): void => {};
    };
    sync();
    preference.addEventListener("change", sync);
    return () => { cleanup(); preference.removeEventListener("change", sync); };
  }, []);
  return <div ref={root}>{children}</div>;
}
