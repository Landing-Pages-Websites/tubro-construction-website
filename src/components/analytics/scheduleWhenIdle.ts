const ANALYTICS_IDLE_TIMEOUT_MS = 2000;

export function scheduleWhenIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const idleId = window.requestIdleCallback(callback, { timeout: ANALYTICS_IDLE_TIMEOUT_MS });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(callback, ANALYTICS_IDLE_TIMEOUT_MS);
  return () => window.clearTimeout(timeoutId);
}
