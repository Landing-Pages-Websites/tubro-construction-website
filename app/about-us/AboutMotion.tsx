"use client";

import { useEffect } from "react";
import styles from "./about.module.css";

const TARGETS = [styles.storyPhoto, styles.sectionHeading, styles.person, styles.steps, styles.projectPhoto, styles.estimateCopy];

function observeEntrances(root: HTMLElement, seen: WeakSet<Element>): () => void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      if (!seen.has(target)) {
        seen.add(target);
        target.setAttribute("data-about-entered", "true");
      }
      observer.unobserve(target);
    });
  }, { threshold: 0.12 });
  root.querySelectorAll(TARGETS.map((name) => `.${name}`).join(",")).forEach((target) => {
    if (seen.has(target)) return;
    const bounds = target.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) seen.add(target);
    else observer.observe(target);
  });
  return () => observer.disconnect();
}

/** Adds one-time entrances; server-rendered content stays visible without JavaScript. */
export function AboutMotion(): null {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`.${styles.page}`);
    if (!root || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<Element>();
    let disconnect = (): void => {};
    const sync = (): void => {
      disconnect();
      if (!preference.matches) disconnect = observeEntrances(root, seen);
    };
    sync();
    preference.addEventListener("change", sync);
    return () => { disconnect(); preference.removeEventListener("change", sync); };
  }, []);
  return null;
}
