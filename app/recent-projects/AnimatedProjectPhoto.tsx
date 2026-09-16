"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactElement } from "react";
import type { Project } from "./projects";
import m from "./photo-motion.module.css";

interface Props { project: Project; mode: "hero" | "lightbox"; direction?: number; sizes: string; priority?: boolean }

export default function AnimatedProjectPhoto({ project, mode, direction = 1, sizes, priority = false }: Props): ReactElement {
  const [settled, setSettled] = useState(project);
  const [ready, setReady] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(project);
  const reduced = useRef(false);
  const loaded = useRef(new Set<string>());
  latest.current = project;
  useEffect(() => { setFailed(null); }, [project.id]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (): void => {
      reduced.current = preference.matches;
      if (preference.matches && loaded.current.has(latest.current.id)) setSettled(latest.current);
    };
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  function reveal(item: Project): void {
    loaded.current.add(item.id);
    if (latest.current.id !== item.id) return;
    setFailed(null);
    if (reduced.current) setSettled(item);
    else setReady(item.id);
  }
  const incoming = project.id !== settled.id;
  const hasError = failed === project.id;
  const incomingVisible = incoming && ready === project.id && !hasError;
  return <div className={`${m.photoStage} ${mode === "hero" ? m.heroStage : m.lightboxStage}`} data-direction={direction < 0 ? "back" : "forward"}>
    <Image key={`base-${settled.id}-${attempt}`} src={settled.src} alt={settled.alt} aria-hidden={incomingVisible || hasError} fill sizes={sizes} priority={priority} onLoad={() => loaded.current.add(settled.id)} onError={() => { if (latest.current.id === settled.id) setFailed(settled.id); }} />
    {incoming && <Image key={`${project.id}-${attempt}`} src={project.src} alt={project.alt} aria-hidden={!incomingVisible} fill sizes={sizes} loading="eager" onLoad={() => reveal(project)} onError={() => { if (latest.current.id === project.id) { setReady(null); setFailed(project.id); } }} className={`${m.incoming} ${incomingVisible ? m.ready : ""}`} onAnimationEnd={() => { if (latest.current.id === project.id) setSettled(project); }} />}
    {hasError && <div className={m.photoError}><p role="status">Photo could not load.</p><button type="button" onClick={() => { setFailed(null); setReady(null); setAttempt((value) => value + 1); }}>Retry photo</button></div>}
  </div>;
}
