import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

function idleBrowser(supportsIdle = true) {
  let fontsReady; let nextId = 0;
  const frames = new Map(); const idle = new Map(); const timers = new Map(); const listeners = new Map();
  const window = {
    requestAnimationFrame: callback => { frames.set(++nextId, callback); return nextId; }, cancelAnimationFrame: id => frames.delete(id),
    setTimeout: callback => { timers.set(++nextId, callback); return nextId; }, clearTimeout: id => timers.delete(id),
    addEventListener: (event, callback) => listeners.set(event, callback), removeEventListener: event => listeners.delete(event),
  };
  if (supportsIdle) Object.assign(window, { requestIdleCallback: (callback, options) => { idle.set(++nextId, { callback, options }); return nextId; }, cancelIdleCallback: id => idle.delete(id) });
  const document = { fonts: { ready: new Promise(resolve => { fontsReady = resolve; }) } };
  const api = loadModule("src/lib/analytics-idle.ts", { window, document });
  const frame = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback()); };
  return { api, frames, idle, timers, listeners, frame, fonts: async () => { fontsReady(); await Promise.resolve(); } };
}

test("analytics waits for font paint then uses bounded browser idle, once", async () => {
  const b = idleBrowser(); let calls = 0;
  b.api.afterCriticalPaint(() => calls++);
  assert.equal(b.frames.size, 0); assert.equal(b.idle.size, 0);
  await b.fonts(); b.frame(); assert.equal(b.idle.size, 0); b.frame();
  const scheduled = [...b.idle.values()][0];
  assert.equal(scheduled.options.timeout, 500); assert.equal(calls, 0);
  scheduled.callback(); scheduled.callback();
  assert.equal(calls, 1); assert.equal(b.listeners.size, 0);
});

test("real interaction loads immediately and cancels pending paint and idle work", async () => {
  const b = idleBrowser(); let calls = 0;
  b.api.afterCriticalPaint(() => calls++);
  b.listeners.get("pointerdown")(); await b.fonts(); b.frame();
  assert.equal(calls, 1); assert.equal(b.frames.size, 0); assert.equal(b.idle.size, 0);
});

test("cleanup survives Strict Mode and canceled font promises", async () => {
  const b = idleBrowser(); let calls = 0;
  b.api.afterCriticalPaint(() => calls++)(); await b.fonts(); b.frame();
  assert.equal(calls, 0); assert.equal(b.listeners.size, 0); assert.equal(b.frames.size, 0);
  const cancel = b.api.afterCriticalPaint(() => calls++);
  await b.fonts(); b.frame(); b.frame(); cancel();
  assert.equal(b.idle.size, 0); assert.equal(calls, 0);
});

test("browsers without idle callbacks still load after two paint frames", async () => {
  const b = idleBrowser(false); let calls = 0;
  b.api.afterCriticalPaint(() => calls++); await b.fonts(); b.frame(); b.frame();
  assert.equal(b.timers.size, 1); [...b.timers.values()][0]();
  assert.equal(calls, 1);
});
