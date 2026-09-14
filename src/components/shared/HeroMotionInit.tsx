import type { ReactElement } from "react";

// Must exceed the longest hero transition in globals.css (650ms image + 90ms cta delay).
const HERO_SETTLE_MS = 900;

/*
 * Runs before hydration so hero groups never flash: hides them only when motion is
 * allowed, reveals on the second animation frame, then drops both classes so the
 * default (fully visible, no will-change) styles own the settled state.
 */
const INIT_SCRIPT = `(function () {
  var script = document.currentScript;
  var root = script && script.parentElement;
  if (!root) return;
  try { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; } catch (error) { return; }
  root.classList.add("motion-hero");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      root.classList.add("motion-hero-run");
      setTimeout(function () { root.classList.remove("motion-hero", "motion-hero-run"); }, ${HERO_SETTLE_MS});
    });
  });
})();`;

/** Must be the first child of the `[data-motion-variant]` root so it runs before the hero parses. */
export function HeroMotionInit(): ReactElement {
  return <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />;
}
