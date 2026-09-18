"use client";

import { useEffect, useState, type RefObject } from "react";

type Plugin = { init: (host: string, key: string) => Promise<void>; rescan: () => unknown };
type PluginWindow = Window & { rwlPlugin?: Plugin };
type PortfolioStatus = "idle" | "loading" | "ready" | "failed";
let initialization: Promise<void> | undefined;

/** Tubro's public embed configuration, verified on its existing projects page. */
async function initializePlugin(): Promise<void> {
  const plugin = (window as PluginWindow).rwlPlugin;
  if (!plugin) return;
  initialization ??= plugin.init("https://app.realworklabs.com", "zGi5oVGOWIU7miXx");
  await initialization;
  plugin.rescan();
}

export function useRealWorkPortfolio(output: RefObject<HTMLDivElement | null>): PortfolioStatus {
  const [status, setStatus] = useState<PortfolioStatus>("idle");
  useEffect(() => {
    const target = output.current;
    if (!target) return;
    setStatus("loading");
    let active = true;
    const ready = async (): Promise<void> => {
      try { if (active && !target.childElementCount) await initializePlugin(); }
      catch { if (active) setStatus("failed"); }
    };
    const observer = new MutationObserver(() => { if (target.childElementCount) setStatus("ready"); });
    observer.observe(target, { childList: true });
    const timeout = window.setTimeout(() => { if (!target.childElementCount) setStatus("failed"); }, 20000);
    window.addEventListener("rwlPluginReady", ready);
    void ready();
    return () => { active = false; observer.disconnect(); window.clearTimeout(timeout); window.removeEventListener("rwlPluginReady", ready); };
  }, [output]);
  return status;
}
