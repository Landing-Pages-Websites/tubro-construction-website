"use client";

import { useLayoutEffect } from "react";

const EASE = "cubic-bezier(.16, 1, .3, 1)";
const ARRIVE: Keyframe[] = [
  { opacity: 0, transform: "translateY(18px)" },
  { opacity: 1, transform: "none" },
];
const UNMASK: Keyframe[] = [
  { clipPath: "inset(0 100% 0 0)" },
  { clipPath: "inset(0 0% 0 0)" },
];

/** Prepare below-fold entrances before paint; never re-hide visible content. */
export function HomepageMotion(): null {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".homepage-motion");
    if (!root || !Element.prototype.animate || !window.IntersectionObserver) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observers = new Set<IntersectionObserver>();
    const seen = new WeakSet<Element>();
    let prepared: Animation[] | null = null;

    function play(element: Element, frames: Keyframe[], duration = 600, delay = 0): void {
      const animation = element.animate(frames, { duration, delay, easing: EASE, fill: "both" });
      animations.add(animation);
      if (prepared) {
        animation.pause();
        animation.currentTime = 0;
        prepared.push(animation);
      }
      // Remove completed effects so responsive CSS and hover states own the final pose.
      animation.onfinish = () => { animation.cancel(); animations.delete(animation); };
    }

    function each(selector: string, action: (element: Element, index: number) => void): void {
      root!.querySelectorAll(selector).forEach(action);
    }

    function once(element: Element, action: () => void): void {
      if (seen.has(element)) return;
      const bounds = element.getBoundingClientRect();
      // Never hide content already visible when hydration or a preference change runs.
      if (!bounds.width || bounds.top < window.innerHeight) { seen.add(element); return; }
      prepared = [];
      action();
      const entrance = prepared;
      prepared = null;
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        seen.add(element);
        observer.disconnect();
        observers.delete(observer);
        entrance.forEach(animation => animation.play());
      }, { threshold: 0, rootMargin: "0px 0px 8% 0px" });
      observer.observe(element);
      observers.add(observer);
    }

    function draw(path: SVGPathElement, delay = 0): void {
      const length = path.getTotalLength();
      play(path, [
        { strokeDasharray: `${length} ${length}`, strokeDashoffset: length },
        { strokeDasharray: `${length} ${length}`, strokeDashoffset: 0 },
      ], 1000, delay);
    }

    function stop(): void {
      observers.forEach(observer => observer.disconnect());
      observers.clear();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    }

    function start(): void {
      stop();
      if (preference.matches) return;

      each(".a-room-route, .a-capability-route, .a-process-route", element => {
        once(element, () => {
          if (!element.getBoundingClientRect().width) return;
          element.querySelectorAll<SVGPathElement>("path").forEach(path => draw(path));
          element.querySelectorAll("circle, rect").forEach((node, index) =>
            play(node, [{ opacity: 0 }, { opacity: 1 }], 250, 250 + index * 65));
        });
      });

      each(".a-room-kitchen, .a-room-bathroom, .a-cap-paint, .a-cap-deck, .a-cap-stain, #work-gallery figure", element => {
        once(element, () => {
          play(element, UNMASK, 800);
          const label = element.querySelector("figcaption, .a-room-label");
          if (label) play(label, ARRIVE, 500, 220);
          const tape = element.querySelector(".a-cap-tape");
          if (tape) play(tape, UNMASK, 700, 200);
        });
      });

      // Text accompanies the drawings quietly; photo compositions get their own masks.
      each(".a-proof h2, .a-room-intro, .a-capabilities h2, .a-capabilities h2 + p, .a-gallery h2, .a-gallery h2 ~ p, .a-process h2, .a-estimate h2, .a-estimate h2 + p", element => {
        once(element, () => play(element, ARRIVE, 550));
      });
      each(".a-proof ul, .a-capabilities ul", element => {
        once(element, () => Array.from(element.children).forEach((item, index) =>
          play(item, ARRIVE, 450, Math.min(index * 65, 260))));
      });
      each(".a-process li", (element, index) => {
        once(element, () => {
          const delay = window.matchMedia("(min-width: 768px)").matches ? index * 90 : 0;
          const number = element.querySelector(".a-step-number");
          if (number) play(number, UNMASK, 650, delay);
          element.querySelectorAll("h3, .a-step-body").forEach((item, itemIndex) =>
            play(item, ARRIVE, 500, delay + 100 + itemIndex * 60));
        });
      });
    }

    const onFocus = (event: FocusEvent): void => {
      // Keyboard users never wait for an entrance to reach a control.
      if (event.target instanceof Element && root.contains(event.target)) {
        stop();
        root.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      }
    };
    const onVisibility = (): void => {
      if (document.hidden) stop();
      else start();
    };
    start();
    preference.addEventListener("change", start);
    root.addEventListener("focusin", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      preference.removeEventListener("change", start);
      root.removeEventListener("focusin", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return null;
}
