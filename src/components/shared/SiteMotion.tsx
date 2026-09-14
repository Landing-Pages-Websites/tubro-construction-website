"use client";

import { useEffect, useLayoutEffect } from "react";

const DISTANCE_PX = 8;
const DURATION_MS = 320;
const MAX_DELAY_MS = 80;
const EASING = "cubic-bezier(.16, 1, .3, 1)";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function reveal(element: HTMLElement): void {
  const delay = Math.min(Number(element.dataset.motionDelay) || 0, MAX_DELAY_MS);
  element.style.transition = `opacity ${DURATION_MS}ms ${EASING} ${delay}ms, transform ${DURATION_MS}ms ${EASING} ${delay}ms`;
  element.style.opacity = "1";
  element.style.transform = "translateY(0)";
  element.addEventListener("transitionend", () => element.removeAttribute("style"), { once: true });
}

function observe(root: Element): () => void {
  // Wrappers already in the initial viewport stay visible; only lower ones enter.
  const pending = Array.from(root.querySelectorAll<HTMLElement>(".reveal"))
    .filter(element => element.getBoundingClientRect().top > window.innerHeight);
  pending.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = `translateY(${DISTANCE_PX}px)`;
  });
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      observer.unobserve(entry.target);
      reveal(entry.target as HTMLElement);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -3% 0px" });
  pending.forEach(element => observer.observe(element));
  return (): void => {
    observer.disconnect();
    pending.forEach(element => element.removeAttribute("style"));
  };
}

/** Content stays visible without JavaScript; motion only fades lower `.reveal` wrappers in once. */
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
