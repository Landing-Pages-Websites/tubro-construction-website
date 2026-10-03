const IDLE_BUDGET_MS = 500;
const INTERACTIONS = ["pointerdown", "keydown", "touchstart"] as const;

/** Yield critical font paint before optional work; real interaction takes priority. */
export function afterCriticalPaint(task: () => void): () => void {
  let finished = false;
  let frame = 0;
  let idle: number | undefined;
  let timer: number | undefined;
  const cancel = (): void => {
    finished = true;
    window.cancelAnimationFrame(frame);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    if (timer !== undefined) window.clearTimeout(timer);
    INTERACTIONS.forEach(event => window.removeEventListener(event, run));
  };
  const run = (): void => { if (finished) return; cancel(); task(); };
  const schedule = (): void => {
    if (finished) return;
    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(run, { timeout: IDLE_BUDGET_MS });
        else timer = window.setTimeout(run, 0);
      });
    });
  };
  INTERACTIONS.forEach(event => window.addEventListener(event, run, { passive: true }));
  void document.fonts.ready.then(schedule, schedule);
  return cancel;
}
