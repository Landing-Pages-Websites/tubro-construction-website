import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

class Target {
  constructor(kind, top = 1200) {
    Object.assign(this, { kind, top, animations: [], reads: 0, paths: 0, dataset: { gcRuler: "vertical" } });
  }
  matches(selector) { return selector === "li" && this.kind === "text"; }
  get parentElement() { return { children: [this] }; }
  contains(node) { return this === node || node.parent === this; }
  getBoundingClientRect() { this.reads++; return { width: 100, height: 100, top: this.top, bottom: this.top + 100 }; }
  getTotalLength() { this.paths++; return 180; }
  animate(frames, options) {
    const animation = { frames, options, cancelled: false, paused: false,
      cancel() { this.cancelled = true; }, pause() { this.paused = true; }, play() { this.paused = false; } };
    this.animations.push(animation); return animation;
  }
}

function harness(nodes, reduced = false, supported = true) {
  let effect, focus, change; const observers = [];
  class Observer {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
    observe(node) { this.targets.add(node); }
    unobserve(node) { this.targets.delete(node); }
    disconnect() { this.targets.clear(); }
  }
  const root = { querySelectorAll(selector) {
    const kind = selector.includes("h2") ? "text" : selector.includes("img") ? "image" : selector.includes("ruler") ? "ruler" : "path";
    return nodes.filter(node => node.kind === kind);
  }, addEventListener: (_type, callback) => { focus = callback; }, removeEventListener: () => { focus = undefined; } };
  const preference = { matches: reduced, addEventListener: (_type, callback) => { change = callback; }, removeEventListener: () => { change = undefined; } };
  const api = loadModule("app/general-contractor/GeneralContractorMotion.tsx", { Element: Target, Node: Target,
    IntersectionObserver: Observer, window: { innerHeight: 900, ...(supported ? { IntersectionObserver: Observer } : {}), matchMedia: () => preference },
    moduleMocks: { react: { useRef: () => ({ current: root }), useEffect: callback => { effect = callback; } } } });
  const render = api.GeneralContractorMotion({ children: "Full server content" }); const cleanup = effect();
  return { render, observers, cleanup: () => cleanup?.(), focus: node => focus?.({ target: node }),
    preference(value) { preference.matches = value; change?.(); },
    emit(node, visible = true) { observers.forEach(io => io.callback([{ target: node, isIntersecting: visible,
      boundingClientRect: { top: node.top, bottom: node.top + 100, width: node.width ?? 100, height: node.height ?? 100 } }])); },
    listeners: () => ({ focus, change }) };
}

test("startup preserves SSR content without offscreen animation, geometry or path preparation", () => {
  const nodes = [new Target("text"), new Target("image"), new Target("ruler"), new Target("path")];
  const h = harness(nodes); assert.equal(h.render.props.children, "Full server content");
  for (const node of nodes) {
    assert.equal(node.animations.length, 0); assert.equal(node.reads, 0); assert.equal(node.paths, 0);
    h.emit(node, false); assert.equal(node.animations.length, 0);
  }
  h.cleanup();
});

test("first approach retains each authored motion and creates it only once", () => {
  for (const [kind, duration, delay] of [["text", 650, 0], ["image", 900, 0], ["ruler", 1100, 80], ["path", 1000, 0]]) {
    const node = new Target(kind); const h = harness([node]); h.emit(node, false);
    node.top = 600; h.emit(node); h.emit(node); assert.equal(node.animations.length, 1);
    const animation = node.animations[0];
    assert.equal(animation.options.duration, duration); assert.equal(animation.options.delay, delay);
    assert.equal(animation.options.easing, "cubic-bezier(0.16, 1, 0.3, 1)");
    assert.equal(animation.options.fill, "both"); assert.equal(animation.paused, false);
    if (kind === "path") { assert.equal(node.paths, 1); assert.equal(animation.frames[0].strokeDashoffset, "180"); }
    if (kind === "ruler") assert.equal(animation.frames[0].clipPath, "inset(0 0 100% 0)");
    if (kind === "text") assert.equal(animation.frames[0].transform, "translateY(24px)");
    if (kind === "image") assert.equal(animation.frames[0].transform, "scale(1.065)");
    animation.onfinish(); assert.equal(animation.cancelled, true); h.cleanup();
  }
});

test("already visible reading content stays still while hero decoration animates", () => {
  const text = new Target("text", 100); const image = new Target("image", 200); const h = harness([text, image]);
  h.emit(text); h.emit(image); assert.equal(text.animations.length, 0); assert.equal(image.animations.length, 1);
  h.preference(true); h.preference(false); h.emit(text); h.emit(image);
  assert.equal(text.animations.length, 0); assert.equal(image.animations.length, 1); h.cleanup();
});

test("reduced motion avoids path work, cancels active motion and never replays seen content", () => {
  const seen = new Target("path"); const unseen = new Target("image"); const h = harness([seen, unseen], true);
  h.emit(seen); h.emit(unseen, false); assert.equal(seen.paths, 0); h.preference(false);
  h.emit(seen); h.emit(unseen); assert.equal(seen.animations.length, 0); assert.equal(unseen.animations.length, 1);
  h.preference(true); assert.equal(unseen.animations[0].cancelled, true);
  h.preference(false); h.emit(unseen); assert.equal(unseen.animations.length, 1); h.cleanup();
});

test("focus reveals pending and running targets; disposal ignores stale observer callbacks", () => {
  const pending = new Target("text"); const running = new Target("image"); const late = new Target("path");
  const h = harness([pending, running, late]); h.emit(running); h.focus(running); h.focus(pending);
  h.emit(pending); assert.equal(pending.animations.length, 0); assert.equal(running.animations[0].cancelled, true);
  h.cleanup(); h.emit(late); assert.equal(late.paths, 0); assert.equal(late.animations.length, 0);
  assert.deepEqual(h.listeners(), { focus: undefined, change: undefined });
  assert.ok(h.observers.every(observer => observer.targets.size === 0));
});


test("without IntersectionObserver the full server content remains usable without motion", () => {
  const node = new Target("text"); const h = harness([node], false, false);
  assert.equal(h.render.props.children, "Full server content"); assert.equal(node.animations.length, 0);
  assert.equal(h.observers.length, 0); h.cleanup();
});


test("zero-size and already-passed targets retain the original motion eligibility", () => {
  const hidden = new Target("path"); hidden.width = 0;
  const flat = new Target("path"); flat.height = 0;
  const passed = new Target("image", -200); const h = harness([hidden, flat, passed]);
  for (const node of [hidden, flat, passed]) {
    h.emit(node); assert.equal(node.animations.length, 0); assert.equal(node.paths, 0);
  }
  h.cleanup();
});
