"use client";

import { useEffect } from "react";
import styles from "./service-areas.module.css";

const EASE = "cubic-bezier(.16, 1, .3, 1)";
type MotionGroup = { target: Element; animations: Animation[] };

function pausedMotion(element: Element, frames: Keyframe[], duration: number, delay = 0): Animation {
  const animation = element.animate(frames, { duration, delay, easing: EASE, fill: "both" });
  animation.pause();
  animation.onfinish = (): void => animation.cancel();
  return animation;
}

function drawLines(target: Element): Animation[] {
  return Array.from(target.querySelectorAll("path")).map((path, index) => pausedMotion(path, [
    { strokeDasharray: "1", strokeDashoffset: "1" },
    { strokeDasharray: "1", strokeDashoffset: "0" },
  ], 1500, Math.min(index * 110, 770)));
}

function reveal(target: Element): Animation[] {
  if (target.matches("[data-construction-drawing]")) return drawLines(target);
  if (target.classList.contains(styles.cityLinks)) {
    return Array.from(target.children).map((row, index) => pausedMotion(row, [
      { transform: "translateX(18px)" }, { transform: "translateX(0)" },
    ], 650, Math.min(index * 65, 390)));
  }
  if (target.classList.contains(styles.projectPhoto)) return [pausedMotion(target, [
    { clipPath: "inset(0 100% 0 0)", transform: "translateY(26px)" },
    { clipPath: "inset(0 0% 0 0)", transform: "translateY(0)" },
  ], 1250)];
  if (target.classList.contains(styles.fitPanel)) return [pausedMotion(target, [
    { opacity: .35, transform: "perspective(1000px) translateY(42px) rotateX(5deg)" },
    { opacity: 1, transform: "perspective(1000px) translateY(0) rotateX(0)" },
  ], 1050)];
  return [pausedMotion(target, [
    { opacity: .2, transform: "translateY(24px)" },
    { opacity: 1, transform: "translateY(0)" },
  ], 850)];
}

function observeEntrances(root: Element): () => void {
  const selectors = ["[data-construction-drawing]", `.${styles.cityLinks}`, `.${styles.projectPhoto}`,
    `.${styles.fitPanel}`, `.${styles.sectionHeading}`, `.${styles.projectIntro}`,
    `.${styles.fitIntro}`, `.${styles.estimateActions}`, `.${styles.estimate} h2`];
  const groups: MotionGroup[] = Array.from(root.querySelectorAll(selectors.join(",")))
    .filter(target => target.getBoundingClientRect().top >= window.innerHeight && target.getBoundingClientRect().height > 0)
    .map(target => ({
      target: target.classList.contains(styles.projectPhoto) ? target.parentElement ?? target : target,
      animations: reveal(target),
    }));
  const byTarget = new Map(groups.map(group => [group.target, group.animations]));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    byTarget.get(entry.target)?.forEach(animation => animation.play());
    observer.unobserve(entry.target);
  }), { threshold: .06, rootMargin: "0px 0px -24px 0px" });
  groups.forEach(group => observer.observe(group.target));
  const showFocused = (event: Event): void => {
    groups.filter(group => event.target instanceof Node && group.target.contains(event.target))
      .forEach(group => { observer.unobserve(group.target); group.animations.forEach(animation => animation.cancel()); });
  };
  root.addEventListener("focusin", showFocused);
  return (): void => {
    observer.disconnect();
    root.removeEventListener("focusin", showFocused);
    groups.forEach(group => group.animations.forEach(animation => animation.cancel()));
  };
}

function photoParallax(root: Element): () => void {
  const photos = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.projectPhoto}`));
  let frame = 0;
  const update = (): void => {
    frame = 0;
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    photos.forEach(photo => {
      const rect = photo.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const limit = Math.min(16, rect.height * .035);
      photo.style.setProperty("--area-photo-y", `${desktop ? Math.max(-limit, Math.min(limit, progress * 32)) : 0}px`);
    });
  };
  const schedule = (): void => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
  return (): void => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    photos.forEach(photo => photo.style.removeProperty("--area-photo-y"));
  };
}

/** Visible by default; motion is scoped, cancellable, and never blocks navigation. */
export function AreaMotion(): null {
  useEffect(() => {
    const root = document.querySelector("[data-service-area-page]");
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = (): void => {};
    const sync = (): void => {
      cleanup();
      if (preference.matches) return;
      const stopEntrances = observeEntrances(root);
      const stopParallax = photoParallax(root);
      cleanup = (): void => { stopEntrances(); stopParallax(); };
    };
    sync();
    preference.addEventListener("change", sync);
    return (): void => { cleanup(); preference.removeEventListener("change", sync); };
  }, []);
  return null;
}
