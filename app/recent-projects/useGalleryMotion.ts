"use client";

import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import type { Category } from "./projects";

const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
type Position = { left: number; top: number };

/** Measure the visible positions before React rearranges the filtered cards. */
export function useGalleryMotion(category: Category): { grid: RefObject<HTMLDivElement | null>; capture: () => void } {
  const grid = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, Position>());
  const animations = useRef<Animation[]>([]);
  const capture = useCallback((): void => {
    positions.current.clear();
    grid.current?.querySelectorAll<HTMLElement>("[data-project-id]").forEach((card) => {
      const rect = card.getBoundingClientRect();
      positions.current.set(card.dataset.projectId!, { left: rect.left, top: rect.top + window.scrollY });
    });
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
  }, []);

  useLayoutEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!positions.current.size || preference.matches) return;
    grid.current?.querySelectorAll<HTMLElement>("[data-project-id]").forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const previous = positions.current.get(card.dataset.projectId!);
      const from = previous
        ? { transform: `translate(${previous.left - rect.left}px, ${previous.top - rect.top - window.scrollY}px)` }
        : { opacity: 0, transform: "translateY(12px)" };
      animations.current.push(card.animate([from, { opacity: 1, transform: "translate(0, 0)" }], { duration: 360, easing: EASING }));
    });
    positions.current.clear();
    const stop = (): void => { if (preference.matches) animations.current.forEach((animation) => animation.cancel()); };
    preference.addEventListener("change", stop);
    return () => { preference.removeEventListener("change", stop); animations.current.forEach((animation) => animation.cancel()); };
  }, [category]);

  return { grid, capture };
}
