import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

function motionHarness(reduced = false) {
  const animations = []; let effect; let intersection; let preferenceChange;
  class Element {
    constructor(top) { this.top = top; }
    matches() { return false; }
    getBoundingClientRect() { return { top: this.top, bottom: this.top + 100, width: 300, height: 100 }; }
    animate(frames, options) {
      const animation = { frames, options, paused: false, played: false, cancelled: false,
        pause() { this.paused = true; }, play() { this.played = true; }, cancel() { this.cancelled = true; } };
      animations.push(animation); return animation;
    }
  }
  const heading = new Element(1000); const visibleHeading = new Element(100);
  const root = { querySelectorAll: (selector) => selector.startsWith("main h2") ? [heading, visibleHeading] : [], addEventListener() {}, removeEventListener() {} };
  class IntersectionObserver { constructor(callback) { intersection = callback; } observe() {} unobserve() {} disconnect() {} }
  const preference = { matches: reduced, addEventListener: (_name, callback) => { preferenceChange = callback; }, removeEventListener() {} };
  const window = { innerHeight: 800, IntersectionObserver, matchMedia: () => preference };
  const moduleMocks = { react: { useEffect: (callback) => { effect = callback; }, useRef: () => ({ current: root }) } };
  const { GeneralContractorMotion } = loadModule("app/general-contractor/GeneralContractorMotion.tsx", { window, IntersectionObserver, Element, moduleMocks });
  GeneralContractorMotion({ children: "Test" });
  const cleanup = effect();
  return { animations, cleanup, preference, enter: () => intersection([{ isIntersecting: true, target: heading }]), change: () => preferenceChange() };
}

test("general-contractor reading content remains fully opaque before, during and after scroll reveal", () => {
  const h = motionHarness();
  assert.equal(h.animations.length, 1, "already visible content stays static");
  const animation = h.animations[0];
  assert.ok(animation.paused, "below-fold element waits for intersection");
  for (const frame of animation.frames) {
    assert.equal(frame.opacity ?? 1, 1, "paused and interpolated reading states preserve contrast");
    assert.equal(frame.filter, undefined);
  }
  h.enter(); assert.ok(animation.played);
  animation.onfinish(); assert.ok(animation.cancelled);
  h.cleanup();
});

test("reduced motion skips animation and changing the preference cancels pending transforms", () => {
  const reduced = motionHarness(true);
  assert.equal(reduced.animations.length, 0); reduced.cleanup();
  const h = motionHarness(); h.preference.matches = true; h.change();
  assert.ok(h.animations.every((animation) => animation.cancelled));
  h.cleanup();
});
