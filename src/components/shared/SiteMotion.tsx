"use client";

import { useEffect, useLayoutEffect } from "react";

const MAX_DELAY_MS = 80;
const STAGGER_STEP_MS = 60;

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Maps each observed trigger to the elements it owns (a wrapper owns itself; a stagger parent owns its items). */
function collectTargets(root: Element): Map<Element, HTMLElement[]> {
  const targets = new Map<Element, HTMLElement[]>();
  root.querySelectorAll<HTMLElement>(".reveal").forEach(wrapper => targets.set(wrapper, [wrapper]));
  root.querySelectorAll<HTMLElement>("[data-motion-stagger]").forEach(parent => {
    targets.set(parent, Array.from(parent.children) as HTMLElement[]);
  });
  // Triggers at or above the fold stay static; only content below the initial viewport reveals.
  Array.from(targets.keys())
    .filter(trigger => trigger.getBoundingClientRect().top <= window.innerHeight)
    .forEach(trigger => targets.delete(trigger));
  return targets;
}

function setPending(trigger: Element, owned: HTMLElement[]): void {
  const base = Math.min(Number((trigger as HTMLElement).dataset.motionDelay) || 0, MAX_DELAY_MS);
  const step = trigger.hasAttribute("data-motion-stagger") ? STAGGER_STEP_MS : 0;
  owned.forEach((element, index) => {
    const delay = base + index * step;
    if (delay > 0) element.style.transitionDelay = `${delay}ms`;
    element.classList.add("motion-pending");
  });
}

/** Settling always lands on the default (fully visible) styles, never back to hidden. */
function settle(element: HTMLElement): void {
  element.classList.remove("motion-pending", "motion-visible");
  element.style.removeProperty("transition-delay");
}

function show(element: HTMLElement): void {
  element.classList.add("motion-visible");
  const onTransitionEnd = (event: TransitionEvent): void => {
    // transitionend bubbles; only the element's own transition may settle it.
    if (event.target !== element) return;
    element.removeEventListener("transitionend", onTransitionEnd);
    settle(element);
  };
  element.addEventListener("transitionend", onTransitionEnd);
}

function observe(root: Element): () => void {
  const targets = collectTargets(root);
  targets.forEach((owned, trigger) => setPending(trigger, owned));
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      observer.unobserve(entry.target);
      targets.get(entry.target)?.forEach(show);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -3% 0px" });
  targets.forEach((_owned, trigger) => observer.observe(trigger));
  return (): void => {
    observer.disconnect();
    targets.forEach(owned => owned.forEach(settle));
  };
}

/** Content stays visible without JavaScript; motion only fades lower wrappers/items in once. */
export function SiteMotion({ variant }: { variant: "a" | "b" }): null {
  useIsomorphicLayoutEffect(() => {
    const root = document.querySelector(`[data-motion-variant='${variant}']`);
    if (!root || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = (): void => {};
    const sync = (): void => {
      cleanup();
      cleanup = preference.matches ? (): void => {} : observe(root);
      root.toggleAttribute("data-motion-ready", true);
    };
    sync();
    preference.addEventListener("change", sync);
    return (): void => {
      cleanup();
      root.removeAttribute("data-motion-ready");
      preference.removeEventListener("change", sync);
    };
  }, [variant]);
  return null;
}
