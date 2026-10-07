"use client";

import { useEffect, useRef, type ReactElement, type ReactNode } from "react";

const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

interface MotionTarget {
  element: Element;
  frames: Keyframe[];
  duration: number;
  delay: number;
  decorative?: boolean;
}

function collectTargets(root: HTMLElement): MotionTarget[] {
  const targets: MotionTarget[] = [];
  root.querySelectorAll("main h2, #scope-index li, #process-faq ol > li").forEach(element => {
    const index = element.matches("li") ? Array.from(element.parentElement!.children).indexOf(element) : 0;
    targets.push({ element, duration: 650, delay: Math.min(index, 4) * 75, frames: [
      { transform: "translateY(24px)" },
      { transform: "translateY(0)" },
    ] });
  });
  return [...targets, ...decorativeTargets(root)];
}

function decorativeTargets(root: HTMLElement): MotionTarget[] {
  const targets: MotionTarget[] = [];
  root.querySelectorAll("#hero img, #project-proof img").forEach((element, index) => {
    targets.push({ element, duration: 900, delay: Math.min(index, 3) * 65, decorative: true, frames: [
      { transform: "scale(1.065)" }, { transform: "scale(1)" },
    ] });
  });
  root.querySelectorAll<SVGElement>("[data-gc-ruler]").forEach(element => {
    const vertical = element.dataset.gcRuler === "vertical";
    targets.push({ element, duration: 1100, delay: 80, decorative: true, frames: [
      { clipPath: vertical ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0 0 0)" },
    ] });
  });
  root.querySelectorAll<SVGPathElement>("#process-faq svg > path").forEach(element => {
    const length = element.getTotalLength();
    targets.push({ element, duration: 1000, delay: 0, decorative: true, frames: [
      { strokeDasharray: `${length}`, strokeDashoffset: `${length}` },
      { strokeDasharray: `${length}`, strokeDashoffset: "0" },
    ] });
  });
  return targets;
}

function startTarget(target: MotionTarget, animations: Map<Element, Animation>, observer: IntersectionObserver): void {
  const rect = target.element.getBoundingClientRect();
  if (!rect.width || !rect.height || rect.bottom <= 0) return;
  const inView = rect.top < window.innerHeight;
  // Never pull already-painted reading content out of place on hydration.
  if (inView && !target.decorative) return;
  const animation = target.element.animate(target.frames, {
    duration: target.duration, delay: target.delay, easing: EASING, fill: "both",
  });
  animations.set(target.element, animation);
  animation.onfinish = () => {
    animation.cancel();
    animations.delete(target.element);
  };
  if (!inView) {
    animation.pause();
    observer.observe(target.element);
  }
}

function revealFocused(event: FocusEvent, animations: Map<Element, Animation>, observer: IntersectionObserver): void {
  if (!(event.target instanceof Node)) return;
  animations.forEach((animation, element) => {
    if (element.contains(event.target as Node)) {
      animation.cancel();
      observer.unobserve(element);
      animations.delete(element);
    }
  });
}

function observeMotion(root: HTMLElement): () => void {
  const animations = new Map<Element, Animation>();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animations.get(entry.target)?.play();
      observer.unobserve(entry.target);
    });
  }, { threshold: 0 });

  collectTargets(root).forEach(target => startTarget(target, animations, observer));

  const onFocus = (event: FocusEvent): void => revealFocused(event, animations, observer);
  root.addEventListener("focusin", onFocus);
  return () => {
    observer.disconnect();
    animations.forEach(animation => animation.cancel());
    root.removeEventListener("focusin", onFocus);
  };
}

/** Progressive enhancement scoped to this page; no motion dependency or hidden SSR content. */
export function GeneralContractorMotion({ children }: { children: ReactNode }): ReactElement {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = (): void => {};
    const sync = (): void => {
      cleanup();
      cleanup = root.current && !preference.matches ? observeMotion(root.current) : (): void => {};
    };
    sync();
    preference.addEventListener("change", sync);
    return () => { cleanup(); preference.removeEventListener("change", sync); };
  }, []);
  return <div ref={root}>{children}</div>;
}
