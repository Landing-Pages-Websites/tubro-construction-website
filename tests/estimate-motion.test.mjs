import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

function element(name, top, kind = "body", parent = null) {
  return { name, top, parentElement: parent, dataset: kind === "step" ? { estimateStep: "0" } : { estimateEnter: kind },
    contains(other) { return other === this || Boolean(other.parentElement && this.contains(other.parentElement)); },
    hasAttribute(key) { return key === "data-estimate-step" && kind === "step"; },
    querySelectorAll() { return this.children || []; },
    closest() { return kind === "control" ? parent : this; },
    getBoundingClientRect() { this.log.push(`read:${name}`); return { top: this.top }; },
    animate(frames, options) {
      this.log.push(`animate:${name}`);
      const animation = { frames, options, cancelled: false, paused: false,
        pause() { this.paused = true; }, play() { this.paused = false; }, cancel() { this.cancelled = true; } };
      this.animations.push(animation); return animation;
    }, animations: [], log: [] };
}

function harness(elements, { reduced = false, observer = true, width = 1440 } = {}) {
  let effect; let fontsReady; let focus; let change; let cleanup; const observers = []; const log = [];
  const root = { querySelectorAll: () => elements, addEventListener: (_name, callback) => { focus = callback; },
    removeEventListener: () => { focus = undefined; }, contains: target => elements.some(node => node.contains(target)) };
  const preference = { matches: reduced, addEventListener: (_name, callback) => { change = callback; }, removeEventListener: () => { change = undefined; } };
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; this.targets = new Set(); observers.push(this); }
    observe(target) { log.push(`observe:${target.name}`); this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); }
  }
  elements.forEach(node => { node.log = log; });
  const window = { innerHeight: 900, innerWidth: width, matchMedia: () => preference, ...(observer ? { IntersectionObserver: Observer } : {}) };
  const api = loadModule("app/schedule-an-estimate/EstimateMotion.tsx", { window,
    document: { fonts: { ready: { then: callback => { fontsReady = callback; } } } },
    ...(observer ? { IntersectionObserver: Observer } : {}), HTMLElement: Object,
    moduleMocks: { react: { useRef: () => ({ current: root }), useEffect: callback => { effect = callback; } } } });
  const render = api.default({ children: "SSR content" }); cleanup = effect();
  const emit = (target, isIntersecting = true) => observers.forEach(io => io.callback([{ target, isIntersecting, boundingClientRect: { top: target.top } }]));
  return { render, log, observers, emit, fonts: () => fontsReady?.(), focus: target => focus?.({ target }),
    preference: value => { preference.matches = value; change?.(); }, cleanup: () => cleanup?.(), listeners: () => ({ focus, change }) };
}

test("SSR main is retained, with zero offscreen animations or duplicate font setup", () => {
  const nodes = [element("heading", 1000, "heading"), element("body", 1200)]; const h = harness(nodes);
  assert.equal(h.render.type, "main"); assert.equal(h.render.props.id, "main-content");
  assert.equal(h.render.props.tabIndex, -1); assert.equal(h.render.props.children, "SSR content");
  assert.equal(nodes.flatMap(node => node.animations).length, 0);
  const beforeFonts = [...h.log]; h.fonts(); assert.deepEqual(h.log, beforeFonts);
  assert.deepEqual(h.log.slice(0, 2), ["read:heading", "read:body"], "fixed geometry snapshot precedes writes/observing");
});

test("first approach plays once with authored timing, distance, delay, and finish cleanup", () => {
  for (const width of [390, 1440]) {
    const heading = element("heading", 1000, "heading"); heading.dataset.estimateDelay = "140";
    const body = element("body", 1200); body.dataset.estimateDelay = "220";
    const h = harness([heading, body], { width }); h.emit(heading, false); assert.equal(heading.animations.length, 0);
    h.emit(heading); h.emit(heading); h.emit(body);
    assert.equal(heading.animations.length, 1); const animation = heading.animations[0];
    assert.deepEqual(JSON.parse(JSON.stringify(animation.options)), { duration: 650, delay: 140, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
    assert.equal(animation.frames[0].transform, `translateY(${width > 700 ? 22 : 12}px)`);
    assert.equal(body.animations[0].options.duration, 500); assert.equal(body.animations[0].options.delay, 220);
    assert.equal(animation.paused, false); animation.onfinish(); assert.equal(animation.cancelled, true);
  }
});

test("initial visible and previously passed content never gains a transform", () => {
  const visible = element("visible", 700); const passed = element("passed", 1500); const h = harness([visible, passed]);
  visible.top = 1200; h.fonts(); h.emit(visible); h.preference(true); h.preference(false); h.emit(visible);
  passed.top = -100; h.emit(passed, false); passed.top = 500; h.emit(passed);
  assert.equal(visible.animations.length, 0); assert.equal(passed.animations.length, 0);
});

test("step markers wait for approach and remain visible without a paused text animation", () => {
  const step = element("step", 1500, "step"); const h = harness([step]);
  assert.equal(step.dataset.stepVisible, undefined); h.emit(step, false); assert.equal(step.dataset.stepVisible, undefined);
  h.emit(step); assert.equal(step.dataset.stepVisible, "true"); assert.equal(step.animations.length, 0);
});

test("focus cancels every animated ancestor and descendant and permanently reveals its target", () => {
  const outer = element("outer", 1500); const inner = element("inner", 1600, "heading", outer);
  const target = element("link", 1700, "control", inner); const child = element("child", 1750, "heading", target);
  target.children = [child]; const h = harness([outer, inner, child]); h.emit(outer); h.emit(inner); h.emit(child);
  h.focus(target);
  assert.ok([outer, inner, child].every(node => node.animations[0].cancelled));
  h.emit(outer); h.emit(inner); h.emit(child); assert.ok([outer, inner, child].every(node => node.animations.length === 1));
});

test("focusing a container before approach reveals all targets without preparing animations", () => {
  const container = element("container", 1500, "control"); const child = element("child", 1550, "heading", container);
  container.children = [child]; const h = harness([child]); h.focus(container); h.emit(child); assert.equal(child.animations.length, 0);
});

test("reduced motion never prepares animations and remembers content seen under that preference", () => {
  const seen = element("seen", 1500); const unseen = element("unseen", 2000);
  const h = harness([seen, unseen], { reduced: true }); h.emit(seen); h.preference(false); h.emit(seen);
  assert.equal(seen.animations.length, 0); h.emit(unseen); assert.equal(unseen.animations.length, 1);
  h.preference(true); assert.equal(unseen.animations[0].cancelled, true);
  h.preference(false); h.emit(unseen); assert.equal(unseen.animations.length, 1);
});

test("preference changes and disposal remove running animations, listeners, and stale callback work", () => {
  const node = element("heading", 1500, "heading"); const late = element("late", 2000); const h = harness([node, late]);
  h.emit(node); h.cleanup(); h.fonts(); h.emit(late);
  assert.equal(node.animations[0].cancelled, true); assert.equal(late.animations.length, 0);
  assert.ok(h.observers.every(io => io.targets.size === 0)); assert.deepEqual(h.listeners(), { focus: undefined, change: undefined });
});

test("no IntersectionObserver keeps SSR content usable without throwing or preparing motion", () => {
  const node = element("heading", 1500, "heading"); const h = harness([node], { observer: false });
  assert.equal(h.render.props.children, "SSR content"); assert.equal(node.animations.length, 0); h.cleanup();
});
