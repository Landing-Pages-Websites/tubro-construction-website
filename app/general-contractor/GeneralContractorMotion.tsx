"use client";

import { useEffect, useRef, type ReactElement, type ReactNode } from "react";

const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const TEXT_DURATION = 650;
const IMAGE_DURATION = 900;
const RULER_DURATION = 1100;
const PATH_DURATION = 1000;
const TEXT_STAGGER = 75;
const IMAGE_STAGGER = 65;
const RULER_DELAY = 80;
const MAX_TEXT_STAGGER = 4;
const MAX_IMAGE_STAGGER = 3;

interface MotionTarget {
  element: Element;
  frames: () => Keyframe[];
  duration: number;
  delay: number;
  decorative?: boolean;
  observed?: boolean;
}

interface MotionState {
  targets: Map<Element, MotionTarget>;
  animations: Map<Element, Animation>;
  observer: IntersectionObserver;
  preference: MediaQueryList;
  active: boolean;
}

function textTargets(root: HTMLElement): MotionTarget[] {
  return Array.from(root.querySelectorAll("main h2, #scope-index li, #process-faq ol > li"), element => {
    const index = element.matches("li") ? Array.from(element.parentElement!.children).indexOf(element) : 0;
    return { element, duration: TEXT_DURATION, delay: Math.min(index, MAX_TEXT_STAGGER) * TEXT_STAGGER, frames: () => [
      { opacity: 0.2, transform: "translateY(24px)" },
      { opacity: 1, transform: "translateY(0)" },
    ] };
  });
}

function imageTargets(root: HTMLElement): MotionTarget[] {
  return Array.from(root.querySelectorAll("#hero img, #project-proof img"), (element, index) => ({
    element, duration: IMAGE_DURATION, delay: Math.min(index, MAX_IMAGE_STAGGER) * IMAGE_STAGGER,
    decorative: true, frames: () => [{ transform: "scale(1.065)" }, { transform: "scale(1)" }],
  }));
}

function rulerTargets(root: HTMLElement): MotionTarget[] {
  return Array.from(root.querySelectorAll<SVGElement>("[data-gc-ruler]"), element => ({
    element, duration: RULER_DURATION, delay: RULER_DELAY, decorative: true, frames: () => [
      { clipPath: element.dataset.gcRuler === "vertical" ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0 0 0)" },
    ],
  }));
}

function pathTargets(root: HTMLElement): MotionTarget[] {
  return Array.from(root.querySelectorAll<SVGPathElement>("#process-faq svg > path"), element => ({
    element, duration: PATH_DURATION, delay: 0, decorative: true, frames: () => {
      const length = `${element.getTotalLength()}`;
      return [
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDasharray: length, strokeDashoffset: "0" },
      ];
    },
  }));
}

function forgetTarget(state: MotionState, element: Element): void {
  state.targets.delete(element);
  state.observer.unobserve(element);
}

function playTarget(state: MotionState, target: MotionTarget): void {
  const animation = target.element.animate(target.frames(), {
    duration: target.duration, delay: target.delay, easing: EASING, fill: "both",
  });
  state.animations.set(target.element, animation);
  animation.onfinish = () => {
    animation.cancel();
    state.animations.delete(target.element);
  };
}

function enterTarget(state: MotionState, entry: IntersectionObserverEntry): void {
  const target = state.targets.get(entry.target);
  if (!state.active || !target) return;
  const firstObservation = !target.observed;
  target.observed = true;
  const { width, height, bottom } = entry.boundingClientRect;
  if (!width || !height || bottom <= 0) return forgetTarget(state, entry.target);
  if (!entry.isIntersecting) return;
  forgetTarget(state, entry.target);
  // Keep already-painted text still. Observer geometry avoids synchronous layout reads.
  if (state.preference.matches || (firstObservation && !target.decorative)) return;
  playTarget(state, target);
}

function cancelAnimations(state: MotionState): void {
  state.animations.forEach(animation => animation.cancel());
  state.animations.clear();
}

function revealFocused(state: MotionState, event: FocusEvent): void {
  const focused = event.target;
  if (!(focused instanceof Node)) return;
  const related = (element: Element): boolean => element.contains(focused) || focused.contains(element);
  state.targets.forEach(({ element }) => {
    if (related(element)) forgetTarget(state, element);
  });
  state.animations.forEach((animation, element) => {
    if (!related(element)) return;
    animation.cancel();
    state.animations.delete(element);
  });
}

function observeMotion(root: HTMLElement, preference: MediaQueryList): () => void {
  const targets = [...textTargets(root), ...imageTargets(root), ...rulerTargets(root), ...pathTargets(root)];
  const state: MotionState = {
    targets: new Map(targets.map(target => [target.element, target])), animations: new Map(), preference, active: true,
    observer: new IntersectionObserver(entries => entries.forEach(entry => enterTarget(state, entry)), { threshold: 0 }),
  };
  const focus = (event: FocusEvent): void => revealFocused(state, event);
  const change = (): void => { if (preference.matches) cancelAnimations(state); };
  targets.forEach(({ element }) => state.observer.observe(element));
  root.addEventListener("focusin", focus);
  preference.addEventListener("change", change);
  return () => {
    state.active = false;
    state.observer.disconnect();
    state.targets.clear();
    cancelAnimations(state);
    root.removeEventListener("focusin", focus);
    preference.removeEventListener("change", change);
  };
}

/** Progressive enhancement scoped to this page; no motion dependency or hidden SSR content. */
export function GeneralContractorMotion({ children }: { children: ReactNode }): ReactElement {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current || !window.IntersectionObserver || !Element.prototype.animate) return;
    return observeMotion(root.current, window.matchMedia("(prefers-reduced-motion: reduce)"));
  }, []);
  return <div ref={root}>{children}</div>;
}
