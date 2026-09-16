"use client";

import { useEffect } from "react";
import styles from "./custom-home.module.css";

const EASE = "cubic-bezier(.22,1,.36,1)";
type Cleanup = () => void;

function traceDrawing(svg: Element, running: Set<Animation>, guides: Set<Element>): void {
  const paths = svg.querySelectorAll<SVGPathElement>("path:not([stroke-dasharray])");
  paths.forEach((path, index) => {
    const length = path.getTotalLength();
    if (!length) return;
    const guide = path.cloneNode(true) as SVGPathElement;
    guide.removeAttribute("class");
    guide.style.opacity = "0.18";
    guide.setAttribute("aria-hidden", "true");
    guide.setAttribute("data-motion-guide", "");
    path.before(guide);
    guides.add(guide);
    const animation = path.animate([
      { strokeDasharray: `${length} ${length}`, strokeDashoffset: length },
      { strokeDasharray: `${length} ${length}`, strokeDashoffset: 0 },
    ], { duration: 1700, delay: Math.min(index * 95, 650), easing: EASE, fill: "backwards" });
    running.add(animation);
    animation.onfinish = () => { guide.remove(); guides.delete(guide); running.delete(animation); };
  });
}

function animateTarget(target: Element, running: Set<Animation>, guides: Set<Element>): void {
  if (target instanceof SVGSVGElement) { traceDrawing(target, running, guides); return; }
  const isPhoto = target instanceof HTMLImageElement;
  const frames = isPhoto
    ? [{ transform: "scale(1)" }, { transform: "scale(1.045)", offset: .32 }, { transform: "scale(1)" }]
    : [{ boxShadow: "0 0 0 0px #0c883d00" }, { boxShadow: "0 0 0 8px #0c883d26", offset: .4 }, { boxShadow: "0 0 0 14px #0c883d00" }];
  const animation = target.animate(frames, { duration: isPhoto ? 2400 : 950, easing: EASE });
  running.add(animation);
  animation.onfinish = () => running.delete(animation);
}

function observeMotion(root: Element): Cleanup {
  const running = new Set<Animation>();
  const guides = new Set<Element>();
  const classes = [styles.houseDrawing, styles.floorPlan, styles.processDrawing, styles.heroRoute, styles.galleryRoute, styles.estimateRoute, styles.stepNumber];
  const targets = root.querySelectorAll(`${classes.map(name => `.${name}`).join(",")}, main figure img`);
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      observer.unobserve(entry.target);
      animateTarget(entry.target, running, guides);
    });
  }, { threshold: .25, rootMargin: "0px 0px -5% 0px" });
  targets.forEach(target => observer.observe(target));
  return () => { observer.disconnect(); running.forEach(animation => animation.cancel()); guides.forEach(guide => guide.remove()); };
}

/** Route-local, one-shot motion; defaults remain fully visible without JavaScript. */
export function CustomHomeMotion(): null {
  useEffect(() => {
    const root = document.querySelector(`.${styles.page}`);
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup: Cleanup = () => {};
    const sync = (): void => { cleanup(); cleanup = preference.matches ? () => {} : observeMotion(root); };
    sync();
    preference.addEventListener("change", sync);
    return () => { cleanup(); preference.removeEventListener("change", sync); };
  }, []);
  return null;
}
