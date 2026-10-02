"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";

export function DeferredPortfolio({ className, title }: { className: string; title: string }): ReactElement {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setLoaded(true); observer.disconnect(); } }, { rootMargin: "200px" });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const exit = (): void => { setInteractive(false); control.current?.focus(); };
  const activate = (): void => { setLoaded(true); setInteractive(true); frame.current?.focus(); };
  return <div ref={root} className="deferred-portfolio">
    <div className="portfolio-controls"><button ref={control} type="button" onClick={activate}>{interactive ? "Portfolio keyboard controls enabled" : "Explore the interactive portfolio"}</button><a href="#after-live-portfolio">Skip interactive portfolio</a></div>
    <p className="portfolio-help">Use the control to enter the map and project photos. Press Escape to return to this page.</p>
    {loaded ? <iframe ref={frame} className={className} src="/recent-projects?embed=realwork" title={title} tabIndex={interactive ? 0 : -1} onLoad={() => {
      frame.current?.contentWindow?.addEventListener("keydown", (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); exit(); } });
      if (interactive) frame.current?.focus();
    }} /> : <div className={`${className} portfolio-placeholder`}><button type="button" onClick={activate}>Load live project portfolio</button></div>}
    <div id="after-live-portfolio" tabIndex={-1} />
  </div>;
}
