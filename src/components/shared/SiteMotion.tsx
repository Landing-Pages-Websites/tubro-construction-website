"use client";

import { useEffect } from "react";

type MotionKind = "copy" | "photo" | "step" | "line" | "headline" | "survey" | "register" | "folio" | "tick";
type Target = { element: Element; kind: MotionKind; delay: number };
const EASING = "cubic-bezier(.16, 1, .3, 1)";

function collect(root: Element): Target[] {
  const groups: [string, MotionKind][] = [
    [".a-hero-photo > img, .a-room-kitchen, .a-room-bathroom, [data-motion='photo']:not(#hero [data-motion]), #hero [data-motion='photo'] > img", "photo"],
    [".a-hero-copy > p, .a-room-intro, [data-motion='copy']", "copy"],
    [".a-process li, [data-motion='step']", "step"],
    [".a-room-route path, .a-capability-route path, .a-process-route path", "line"],
  ];
  groups.push(
    ["#hero h1 > span", "headline"],
    ["[data-motion='survey']", "survey"],
    ["[data-motion='register']", "register"],
    ["[data-motion='folio']", "folio"],
    [".a-ruler i", "tick"],
  );
  const explicit = groups
    .flatMap(([selector, kind]) =>
      Array.from(root.querySelectorAll(selector), (element, index) => ({
        element, kind, delay: kind === "line" ? 0 : Math.min(index % 4, 3) * (kind === "headline" ? 110 : 85),
      })),
    )
    .filter(target => {
      const wrapper = target.element.closest(".reveal");
      return !wrapper || wrapper === target.element;
    });
  const quiet = Array.from(root.querySelectorAll(".reveal"))
    .filter(element => !explicit.some(target => element === target.element || element.contains(target.element)))
    .map(element => ({ element, kind: "copy" as const, delay: Number(element.getAttribute("data-motion-delay")) || 0 }));
  const unique = new Map([...explicit, ...quiet].map(target => [target.element, target]));
  return [...unique.values()];
}

function drawnFrames(target: Target): Keyframe[] {
  const length = (target.element as SVGPathElement).getTotalLength();
  const strokeDasharray = `${length} ${length}`;
  if (target.kind === "survey") return [
    { strokeDasharray, strokeDashoffset: length, opacity: 0 },
    { strokeDasharray, strokeDashoffset: length * .75, opacity: .9, offset: .15 },
    { strokeDasharray, strokeDashoffset: 0, opacity: .9, offset: .65 },
    { strokeDasharray, strokeDashoffset: 0, opacity: 0 },
  ];
  return [{ strokeDasharray, strokeDashoffset: length }, { strokeDasharray, strokeDashoffset: 0 }];
}

function frames(target: Target, variant: "a" | "b", mobile: boolean): Keyframe[] {
  if (target.kind === "line" || target.kind === "survey") return drawnFrames(target);
  if (target.kind === "photo") return [
    { clipPath: variant === "a" ? "polygon(0 0, 100% 0, 100% 5%, 0 22%)" : "inset(0 100% 0 0)", scale: "1.06" },
    { clipPath: variant === "a" ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "inset(0 0 0 0)", scale: "1" },
  ];
  if (target.kind === "headline") return [
    { clipPath: "inset(0 0 100% 0)", translate: "0 24px" },
    { clipPath: "inset(0 0 -8% 0)", translate: "0 0" },
  ];
  if (target.kind === "register") return [{ rotate: "-90deg", scale: ".4", opacity: 0 }, { rotate: "0deg", scale: "1", opacity: 1 }];
  if (target.kind === "folio") return [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }];
  if (target.kind === "tick") return [{ scale: "0 1" }, { scale: "1 1" }];
  if (target.kind === "step") return [
    { opacity: 0, translate: variant === "b" ? "36px -20px" : "0 26px", rotate: variant === "b" ? "2deg" : "0deg" },
    { opacity: 1, translate: "0 0", rotate: "0deg" },
  ];
  return [{ opacity: 0, translate: `0 ${mobile ? 8 : 14}px` }, { opacity: 1, translate: "0 0" }];
}

function duration(kind: MotionKind, mobile: boolean): number {
  if (kind === "survey") return mobile ? 900 : 1100;
  if (kind === "line") return 900;
  if (kind === "photo") return mobile ? 650 : 800;
  return mobile ? 400 : 550;
}

function observe(root: Element, variant: "a" | "b"): () => void {
  const active = new Set<Animation>();
  const targets = new Map(collect(root).map(target => [target.element, target]));
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const settle = (): void => {
    active.forEach(animation => { try { animation.finish(); } catch { animation.cancel(); } });
    active.clear();
  };
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      const target = targets.get(entry.target);
      if (!target || document.hidden) return;
      observer.unobserve(entry.target);
      const animation = target.element.animate(frames(target, variant, mobile), {
        duration: duration(target.kind, mobile),
        delay: target.delay, easing: EASING, fill: "backwards",
      });
      active.add(animation);
      animation.onfinish = (): void => { active.delete(animation); };
    });
  }, { threshold: .08, rootMargin: "0px 0px -3% 0px" });
  targets.forEach(target => observer.observe(target.element));
  return (): void => { observer.disconnect(); settle(); };
}

/** Content stays visible without JavaScript; motion never owns the final layout. */
export function SiteMotion({ variant }: { variant: "a" | "b" }): null {
  useEffect(() => {
    const root = document.querySelector(`[data-motion-variant='${variant}']`);
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = (): void => {};
    const sync = (): void => { cleanup(); cleanup = preference.matches ? (): void => {} : observe(root, variant); };
    sync();
    preference.addEventListener("change", sync);
    return (): void => { cleanup(); preference.removeEventListener("change", sync); };
  }, [variant]);
  return null;
}
