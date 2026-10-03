"use client";

import { useEffect, useRef, type ReactElement, type ReactNode } from "react";

const EASING = "cubic-bezier(.16,1,.3,1)";
const TARGETS = "[data-estimate-enter], [data-estimate-step]";
const DESKTOP_WIDTH = 700;
const HEADING_DURATION = 650;
const BODY_DURATION = 500;
const HEADING_DISTANCE = 22;
const BODY_DISTANCE = 12;

type MotionState = {
  elements: HTMLElement[];
  played: WeakSet<HTMLElement>;
  pending: Map<HTMLElement, Animation>;
  preference: MediaQueryList;
  observer: IntersectionObserver | null;
  disposed: boolean;
};

function rememberVisible(state: MotionState): void {
  // Take every geometry read before observing or writing animation styles.
  const snapshot = state.elements.filter(element => !state.played.has(element))
    .map(element => ({ element, top: element.getBoundingClientRect().top }));
  snapshot.forEach(({ element, top }) => {
    if (top >= window.innerHeight) return;
    state.played.add(element);
    state.observer?.unobserve(element);
  });
}

function cancelMotion(state: MotionState): void {
  state.pending.forEach(animation => animation.cancel());
  state.pending.clear();
  // The unanimated pseudo-element already renders the complete step line.
  state.elements.forEach(element => { delete element.dataset.stepVisible; });
}

function animateEntry(element: HTMLElement, state: MotionState): void {
  const heading = element.dataset.estimateEnter === "heading";
  const distance = heading && window.innerWidth > DESKTOP_WIDTH ? HEADING_DISTANCE : BODY_DISTANCE;
  const animation = element.animate([
    { transform: `translateY(${distance}px)` },
    { transform: "translateY(0)" },
  ], { duration: heading ? HEADING_DURATION : BODY_DURATION,
    delay: Number(element.dataset.estimateDelay || 0), easing: EASING, fill: "both" });
  animation.onfinish = () => { animation.cancel(); state.pending.delete(element); };
  state.pending.set(element, animation);
}

function revealEntries(entries: IntersectionObserverEntry[], state: MotionState): void {
  if (state.disposed) return;
  entries.forEach(({ target, isIntersecting, boundingClientRect }) => {
    const element = target as HTMLElement;
    if (state.played.has(element)) return;
    if (!isIntersecting && boundingClientRect.top >= 0) return;
    state.played.add(element);
    state.observer?.unobserve(element);
    if (!isIntersecting || state.preference.matches) return;
    if (element.hasAttribute("data-estimate-step")) {
      element.dataset.stepVisible = "true";
      return;
    }
    animateEntry(element, state);
  });
}

function revealFocus(event: FocusEvent, state: MotionState): void {
  if (!(event.target instanceof HTMLElement)) return;
  const target = event.target;
  state.elements.forEach(element => {
    if (!element.contains(target) && !target.contains(element)) return;
    state.pending.get(element)?.cancel();
    state.pending.delete(element);
    delete element.dataset.stepVisible;
    state.played.add(element);
    state.observer?.unobserve(element);
  });
}

function observeUnseen(state: MotionState): void {
  state.elements.forEach(element => {
    if (!state.played.has(element)) state.observer?.observe(element);
  });
}

function setupMotion(root: HTMLElement | null): (() => void) | undefined {
  if (!root || !("IntersectionObserver" in window)) return;
  const state: MotionState = {
    elements: Array.from(root.querySelectorAll<HTMLElement>(TARGETS)),
    played: new WeakSet(), pending: new Map(), disposed: false, observer: null,
    preference: window.matchMedia("(prefers-reduced-motion: reduce)"),
  };
  state.observer = new IntersectionObserver(entries => revealEntries(entries, state),
    { rootMargin: "0px 0px -6% 0px", threshold: 0 });
  const changePreference = (): void => { rememberVisible(state); cancelMotion(state); };
  const focus = (event: FocusEvent): void => revealFocus(event, state);
  rememberVisible(state);
  observeUnseen(state);
  state.preference.addEventListener("change", changePreference);
  root.addEventListener("focusin", focus);
  return () => {
    state.disposed = true;
    state.observer?.disconnect();
    cancelMotion(state);
    state.preference.removeEventListener("change", changePreference);
    root.removeEventListener("focusin", focus);
  };
}

export default function EstimateMotion({ children }: { children: ReactNode }): ReactElement {
  const root = useRef<HTMLElement>(null);
  useEffect(() => setupMotion(root.current), []);
  return <main ref={root} id="main-content" tabIndex={-1}>{children}</main>;
}
