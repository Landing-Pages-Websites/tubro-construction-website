"use client";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactElement } from "react";
import AnimatedProjectPhoto from "./AnimatedProjectPhoto";
import type { Project } from "./projects";
import s from "./portfolio.module.css";
import m from "./photo-motion.module.css";

function trapTab(event: KeyboardEvent<HTMLDialogElement>): void {
  if (event.key !== "Tab") return;
  const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}

export default function ProjectLightbox({ project, index, total, onClose, onStep }: { project: Project; index: number; total: number; onClose: () => void; onStep: (delta: number) => void }): ReactElement {
  const dialog = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const closingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  function requestClose(): void {
    if (closingTimer.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { closeCallback.current(); return; }
    setClosing(true);
    closingTimer.current = setTimeout(() => closeCallback.current(), 150);
  }
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finishClose = (): void => { if (preference.matches && closingTimer.current !== null) { clearTimeout(closingTimer.current); closeCallback.current(); } };
    preference.addEventListener("change", finishClose);
    return () => { if (closingTimer.current !== null) clearTimeout(closingTimer.current); preference.removeEventListener("change", finishClose); element?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className={`${s.lightbox} ${m.dialog} ${closing ? m.closing : ""}`} aria-labelledby="project-title" onCancel={(event) => { event.preventDefault(); requestClose(); }} onClick={(event) => { if (event.target === event.currentTarget) requestClose(); }} onKeyDown={(event) => { trapTab(event); if (!closing && (event.key === "ArrowRight" || event.key === "ArrowLeft")) { event.preventDefault(); onStep(event.key === "ArrowRight" ? 1 : -1); } }}>
    <div className={s.lightboxInner}>
      <div className={s.lightboxTop}><span aria-live="polite">Project gallery / {index + 1} of {total}</span><button type="button" autoFocus aria-label="Close project gallery" onClick={requestClose}><X size={24} /></button></div>
      <div className={s.lightboxPhoto}><AnimatedProjectPhoto project={project} mode="lightbox" sizes="95vw" /></div>
      <div className={s.lightboxCaption}>
        <div aria-live="polite"><span>{project.category}</span><h2 id="project-title">{project.title}</h2><p>{project.detail}</p></div>
        <div className={s.carouselControls}><button type="button" aria-label="Previous photograph" onClick={() => { if (!closing) onStep(-1); }}><ArrowLeft size={22} /></button><button type="button" aria-label="Next photograph" onClick={() => { if (!closing) onStep(1); }}><ArrowRight size={22} /></button></div>
      </div>
    </div>
  </dialog>;
}
