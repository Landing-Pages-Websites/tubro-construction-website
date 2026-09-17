"use client";

import { useEffect } from "react";
import styles from "./city.module.css";
import motion from "./city-motion.module.css";

const EASE = "cubic-bezier(.16, 1, .3, 1)";
type Entrance = { target: HTMLElement; animations: Animation[]; rule?: HTMLElement };

function prime(element: Element, frames: Keyframe[], duration: number, delay = 0): Animation {
  const animation = element.animate(frames, { duration, delay, easing: EASE, fill: "both" });
  animation.pause();
  animation.currentTime = 0;
  animation.onfinish = () => animation.cancel();
  return animation;
}

function offscreen(target: HTMLElement): boolean {
  const rect = target.getBoundingClientRect();
  const active = document.activeElement;
  return rect.top >= window.innerHeight && rect.height > 0
    && !target.contains(active) && !(active instanceof Element && active !== document.body && active.contains(target));
}

function primeSteps(root: Element): Entrance[] {
  const entrances: Entrance[] = [];
  root.querySelectorAll<HTMLElement>(`.${styles.steps} > li`).forEach((target, index) => {
    if (!offscreen(target)) return;
    target.style.setProperty("--city-step-delay", `${index * 100}ms`);
    target.classList.add(motion.stepRule, motion.rulePending);
    const animations = Array.from(target.querySelectorAll(`.${styles.stepNumber}, h3`)).map(element =>
      prime(element, [{ opacity: .35, transform: "translateY(16px)" }, { opacity: 1, transform: "translateY(0)" }], 750, index * 100),
    );
    entrances.push({ target, animations, rule: target });
  });
  return entrances;
}

function primePhotos(root: Element): Entrance[] {
  const entrances: Entrance[] = [];
  root.querySelectorAll<HTMLElement>(`.${styles.servicePhoto}, .${styles.projectPhoto}`).forEach(target => {
    if (!offscreen(target)) return;
    const photo = target.querySelector("img");
    if (!photo) return;
    // Only clip the image: the observation box and existing hover transform stay intact.
    entrances.push({ target, animations: [prime(photo, [
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)" },
    ], 950)] });
  });
  return entrances;
}

function primeServices(root: Element): Entrance[] {
  const entrances: Entrance[] = [];
  root.querySelectorAll<HTMLElement>(`.${styles.serviceList} > a`).forEach((target, index) => {
    if (!offscreen(target)) return;
    const animations = Array.from(target.children).map(element => prime(element, [
      { opacity: .35, transform: "translateX(18px)" },
      { opacity: 1, transform: "translateX(0)" },
    ], 700, Math.min(index * 60, 240)));
    entrances.push({ target, animations });
  });
  return entrances;
}

function primePanels(root: Element): Entrance[] {
  const entrances: Entrance[] = [];
  root.querySelectorAll<HTMLElement>(`.${styles.formWrap}`).forEach(target => {
    if (!offscreen(target)) return;
    // Opacity does not change the panel's geometry; fields arrive together.
    entrances.push({ target, animations: [prime(target, [{ opacity: .45 }, { opacity: 1 }], 700)] });
  });
  return entrances;
}

function observe(byTarget: Map<HTMLElement, Entrance>): IntersectionObserver {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const entrance = byTarget.get(entry.target as HTMLElement);
      if (!entrance) return;
      entrance.rule?.classList.add(motion.ruleRunning);
      entrance.animations.forEach(animation => animation.play());
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
  byTarget.forEach(({ target }) => observer.observe(target));
  return observer;
}

function show(entrance: Entrance, observer: IntersectionObserver, byTarget: Map<HTMLElement, Entrance>): void {
  observer.unobserve(entrance.target);
  byTarget.delete(entrance.target);
  entrance.animations.forEach(animation => animation.cancel());
  entrance.rule?.classList.remove(motion.rulePending, motion.ruleRunning);
}

function watchFocus(root: Element, entrances: Entrance[], reveal: (entrance: Entrance) => void): () => void {
  const onFocus = (event: Event): void => {
    if (!(event.target instanceof Element)) return;
    const focused = event.target;
    entrances.forEach(entrance => {
      // Project links wrap the photo target rather than sitting inside it.
      if (entrance.target.contains(focused) || focused.contains(entrance.target)) reveal(entrance);
    });
  };
  root.addEventListener("focusin", onFocus);
  return () => root.removeEventListener("focusin", onFocus);
}

function connect(root: Element): () => void {
  const entrances = [...primeSteps(root), ...primePhotos(root), ...primeServices(root), ...primePanels(root)];
  const byTarget = new Map(entrances.map(entrance => [entrance.target, entrance]));
  const observer = observe(byTarget);
  const reveal = (entrance: Entrance): void => show(entrance, observer, byTarget);
  const stopFocus = watchFocus(root, entrances, reveal);
  return () => {
    observer.disconnect();
    stopFocus();
    entrances.forEach(entrance => {
      reveal(entrance);
      entrance.rule?.classList.remove(motion.stepRule);
      entrance.rule?.style.removeProperty("--city-step-delay");
    });
  };
}

/** Progressive enhancement: server content is visible, and only offscreen content is primed. */
export function CityMotion(): null {
  useEffect(() => {
    const root = document.querySelector("[data-city-page]");
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = (): void => {};
    const sync = (): void => {
      cleanup();
      cleanup = preference.matches ? (): void => {} : connect(root);
    };
    sync();
    preference.addEventListener("change", sync);
    return () => {
      cleanup();
      preference.removeEventListener("change", sync);
    };
  }, []);
  return null;
}
