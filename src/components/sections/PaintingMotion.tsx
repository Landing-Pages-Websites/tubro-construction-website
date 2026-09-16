"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./PaintingMotion.module.css";

/** Painting-only motion; nothing is hidden while waiting for hydration or scrolling. */
export function PaintingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = root.current;
    if (!page || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;

    const reset = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const play = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(frames, options);
      animations.add(animation);
      animation.onfinish = () => { animations.delete(animation); };
    };
    const sync = () => {
      reset();
      if (preference.matches) return;
      const targets = new Map<Element, { kind: "photo" | "process" | "swatch" | "roller" | "drawing"; delay: number }>();
      page.querySelectorAll("main section").forEach(section => {
        const items = section.querySelectorAll("figure, [data-painting-process], [data-painting-swatch], [data-painting-roller], [data-painting-drawing]");
        items.forEach((element, index) => {
          const drawing = element.hasAttribute("data-painting-drawing");
          const roller = element.hasAttribute("data-painting-roller");
          // Never re-hide photographs already in view on load or at an anchor.
          if (!drawing && !roller && element.getBoundingClientRect().top < window.innerHeight) return;
          if (element.closest(".reveal, [data-motion-stagger]")) return;
          targets.set(element, {
            kind: drawing ? "drawing" : roller ? "roller" : element.hasAttribute("data-painting-process") ? "process" : element.hasAttribute("data-painting-swatch") ? "swatch" : "photo",
            delay: (index % 3) * 90,
          });
        });
      });
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer?.unobserve(entry.target);
          const target = targets.get(entry.target);
          if (!target) return;
          if (target.kind === "drawing") {
            entry.target.querySelectorAll<SVGGeometryElement>("path, rect, circle").forEach((line, index) => {
              const length = line.getTotalLength();
              if (!length) return;
              play(line, [
                { strokeDasharray: `${length} ${length}`, strokeDashoffset: length },
                { strokeDasharray: `${length} ${length}`, strokeDashoffset: 0 },
              ], { duration: 1200, delay: Math.min(index * 55, 650), easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
            });
          } else if (target.kind === "photo") {
            // Reveal only the photograph across its fixed frame, like a finish pass.
            const photo = entry.target.querySelector("img");
            if (photo) play(photo, [
              { clipPath: "inset(0 100% 0 0)" },
              { clipPath: "inset(0 0% 0 0)" },
            ], { duration: 1100, delay: target.delay, easing: "cubic-bezier(.65,0,.35,1)", fill: "backwards" });
          } else if (target.kind === "process") {
            const line = entry.target.querySelector("[data-painting-connector]");
            if (line) play(line, [
              { clipPath: "inset(0 100% 100% 0)" },
              { clipPath: "inset(0 0% 0% 0)" },
            ], { duration: 700, delay: window.innerWidth >= 768 ? Number(entry.target.getAttribute("data-painting-process")) * 500 : 0, easing: "cubic-bezier(.65,0,.35,1)", fill: "backwards" });
          } else if (target.kind === "swatch") {
            entry.target.querySelectorAll("i").forEach((chip, index) => {
              play(chip, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], {
                duration: 550, delay: index * 380, easing: "ease-in-out", fill: "backwards",
              });
            });
          } else if (target.kind === "roller") {
            const roller = entry.target.querySelector("[data-roller-tool]");
            const paint = entry.target.querySelector("[data-roller-paint]");
            if (roller) play(roller, [{ transform: "translateY(33px)" }, { transform: "translateY(0)" }], {
              duration: 1500, easing: "cubic-bezier(.65,0,.35,1)", fill: "backwards",
            });
            if (paint) play(paint, [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)" }], {
              duration: 1500, easing: "cubic-bezier(.65,0,.35,1)", fill: "backwards",
            });
          }
        });
      }, { threshold: .08, rootMargin: "0px 0px -24px 0px" });
      targets.forEach((_, element) => observer?.observe(element));
    };
    sync();
    preference.addEventListener("change", sync);
    return () => { reset(); preference.removeEventListener("change", sync); };
  }, []);

  return <div ref={root} className={styles.page}>{children}</div>;
}
