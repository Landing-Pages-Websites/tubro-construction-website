"use client";

import { useEffect, useRef, type ReactElement, type ReactNode } from "react";

const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const PHOTO_SELECTOR = "#project-gallery img, #showers-planning-finishes img, #estimate-cta img";
const DETAIL_SELECTOR = "#showers-planning-finishes li, #process-faq ol > li";

interface MotionTarget {
  element: HTMLElement;
  frames: Keyframe[];
  duration: number;
  delay: number;
}

function collectTargets(root: HTMLElement): MotionTarget[] {
  const targets: MotionTarget[] = [];
  root.querySelectorAll<HTMLElement>(PHOTO_SELECTOR).forEach((element, index) => {
    targets.push({ element, duration: 850, delay: Math.min(index % 5, 3) * 75, frames: [
      { clipPath: "inset(0 0 14% 0)", scale: "1.045", opacity: 0.65 },
      { clipPath: "inset(0 0 0 0)", scale: "1", opacity: 1 },
    ] });
  });
  root.querySelectorAll<HTMLElement>(`main h2, ${DETAIL_SELECTOR}`).forEach(element => {
    const index = element.matches("li") ? Array.from(element.parentElement!.children).indexOf(element) : 0;
    targets.push({ element, duration: 600, delay: Math.min(index, 3) * 70, frames: [
      { opacity: 0.3, translate: "0 20px" },
      { opacity: 1, translate: "0 0" },
    ] });
  });
  return targets;
}

function playTarget(target: MotionTarget, active: Map<Element, Animation>): void {
  const animation = target.element.animate(target.frames, {
    duration: target.duration, delay: target.delay, easing: EASING, fill: "both",
  });
  active.set(target.element, animation);
  animation.onfinish = (): void => {
    animation.cancel();
    active.delete(target.element);
  };
}

function observeMotion(root: HTMLElement): () => void {
  const active = new Map<Element, Animation>();
  const targets = new Map(collectTargets(root).map(target => [target.element, target]));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = targets.get(entry.target as HTMLElement);
      if (target && !entry.target.contains(document.activeElement)) playTarget(target, active);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
  targets.forEach(target => {
    // Hydration never moves content already visible, including an anchor landing.
    if (target.element.getBoundingClientRect().top >= window.innerHeight) observer.observe(target.element);
  });
  const revealFocused = (event: FocusEvent): void => {
    targets.forEach(({ element }) => {
      if (!(event.target instanceof Node) || !element.contains(event.target)) return;
      observer.unobserve(element);
      active.get(element)?.cancel();
      active.delete(element);
    });
  };
  root.addEventListener("focusin", revealFocused);
  return (): void => {
    observer.disconnect();
    active.forEach(animation => animation.cancel());
    root.removeEventListener("focusin", revealFocused);
  };
}

/** One-shot, route-local motion; content remains visible without JavaScript. */
export function BathroomMotion({ children }: { children: ReactNode }): ReactElement {
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
    return (): void => { cleanup(); preference.removeEventListener("change", sync); };
  }, []);
  return <div ref={root} data-bathroom-motion>{children}</div>;
}
