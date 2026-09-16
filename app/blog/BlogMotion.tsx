"use client";

import { useEffect } from "react";
import styles from "./blog.module.css";

const EASING = "cubic-bezier(.22, 1, .36, 1)";

/** Animate accents once on entry; the default page never depends on motion to be visible. */
function observeMotion(root: HTMLElement): () => void {
  const animations = new Set<Animation>();
  const targets = new Map<Element, { frames: Keyframe[]; duration: number; delay: number; pseudoElement?: string }>();
  const add = (selector: string, frames: Keyframe[], duration: number, stagger = false, pseudoElement?: string): void => {
    root.querySelectorAll<HTMLElement>(selector).forEach((target, index) => {
      if (target.getBoundingClientRect().top < window.innerHeight) return;
      targets.set(target, { frames, duration, delay: stagger ? (index % 3) * 100 : 0, pseudoElement });
    });
  };
  add(`.${styles.bathPhoto}`, [{ clipPath: "inset(0 22% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], 1200);
  add(`.${styles.bathPhoto} img`, [{ transform: "scale(1.18) translateX(-2%)" }, { transform: "scale(1) translateX(0)" }], 1500);
  add(`.${styles.measure}, .${styles.closingRule}`, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], 1200);
  add(`.${styles.noteNumber}, .${styles.prepList} li > span`, [{ opacity: .15, transform: "translate(-22px, 28px)" }, { opacity: 1, transform: "translate(0, 0)" }], 950, true);
  add(`.${styles.sectionHeading} h2, .${styles.prepare} h2, .${styles.closing} h2, .${styles.kitchenNote} h3, .${styles.bathCopy} h3`, [{ opacity: .3, transform: "translateY(36px)" }, { opacity: 1, transform: "translateY(0)" }], 1000);
  add(`.${styles.questionList} li, .${styles.prepList} h3`, [{ opacity: .35, transform: "translateX(24px)" }, { opacity: 1, transform: "translateX(0)" }], 850, true);
  add(`.${styles.decision}, .${styles.prepList} li`, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], 1200, false, "::before");
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    const motion = targets.get(entry.target);
    if (!motion) return;
    const animation = entry.target.animate(motion.frames, { duration: motion.duration, delay: motion.delay, pseudoElement: motion.pseudoElement, easing: EASING });
    animations.add(animation);
    animation.onfinish = (): void => { animations.delete(animation); };
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  targets.forEach((_motion, target) => observer.observe(target));
  return (): void => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
}

export default function BlogMotion(): null {
  useEffect(() => {
    const root = document.getElementById("blog-content");
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = (): void => {};
    const sync = (): void => { cleanup(); cleanup = preference.matches ? (): void => {} : observeMotion(root); };
    sync();
    preference.addEventListener("change", sync);
    return (): void => { cleanup(); preference.removeEventListener("change", sync); };
  }, []);
  return null;
}
