// Diagnostic only: no instrumentation is included in the application bundle.
/** @returns {void} */
export function installMotionProbe() {
  window.estimateProbe = { calls: [], animations: [] };
  const selector = "[data-estimate-enter], [data-estimate-step]";
  const originalRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (...args) {
    if (!this.matches(selector)) return originalRect.apply(this, args);
    const start = performance.now(); const rect = originalRect.apply(this, args);
    performance.measure("estimate:geometry", { start, end: performance.now() });
    window.estimateProbe.calls.push({ kind: "rect", at: start, top: rect.top, text: this.textContent.trim() });
    return rect;
  };
  const originalAnimate = Element.prototype.animate;
  Element.prototype.animate = function (frames, options) {
    if (!this.matches(selector)) return originalAnimate.call(this, frames, options);
    const start = performance.now(); const animation = originalAnimate.call(this, frames, options);
    performance.measure("estimate:animate", { start, end: performance.now() });
    const record = { at: start, text: this.textContent.trim(), kind: this.dataset.estimateEnter,
      frames, options, events: [], expectedDelay: Number(this.dataset.estimateDelay || 0) };
    window.estimateProbe.animations.push(record);
    for (const method of ["pause", "play", "cancel"]) {
      const original = animation[method].bind(animation);
      animation[method] = () => { record.events.push({ method, at: performance.now(), time: animation.currentTime }); return original(); };
    }
    animation.addEventListener("finish", () => record.events.push({ method: "finish", at: performance.now() }));
    return animation;
  };
}

/** @returns {{ width: number, scrollWidth: number, h1: string, main: object, elements: object[] }} */
export function readLayout() {
  const selectors = "h1, h2, h3, main p, main a, main input, main button, main label, main select, main textarea, main img";
  return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, h1: document.querySelector("h1").textContent,
    main: { id: document.querySelector("main").id, tabIndex: document.querySelector("main").tabIndex },
    elements: [...document.querySelectorAll(selectors)].map(element => {
      const rect = element.getBoundingClientRect(); const style = getComputedStyle(element);
      return { tag: element.tagName, text: element.textContent.trim(), x: rect.x, width: rect.width, height: rect.height,
        font: style.fontFamily, size: style.fontSize, lineHeight: style.lineHeight, color: style.color,
        background: style.backgroundColor, outline: style.outline, minHeight: style.minHeight };
    }) };
}

/** @returns {{ animations: object[], calls: object[], measures: object[], active: number, steps: object[] }} */
export function readMotionState() {
  return { animations: window.estimateProbe.animations, calls: window.estimateProbe.calls,
    measures: performance.getEntriesByType("measure").filter(entry => entry.name.startsWith("estimate:")).map(entry => entry.toJSON()),
    active: document.querySelector("main").getAnimations({ subtree: true }).length,
    steps: [...document.querySelectorAll("[data-estimate-step]")].map(element => {
      const style = getComputedStyle(element, "::after");
      return { visible: element.dataset.stepVisible, name: style.animationName, duration: style.animationDuration, delay: style.animationDelay, easing: style.animationTimingFunction };
    }) };
}
