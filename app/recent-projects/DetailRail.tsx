"use client";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { projects, type Project } from "./projects";
import s from "./portfolio.module.css";

const details = [projects[6], projects[3], projects[8], projects[2]];
export default function DetailRail({ onOpen }: { onOpen: (project: Project) => void }): ReactElement {
  const rail = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ start: true, end: false });
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = (): void => setBounds({ start: element.scrollLeft < 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, []);
  function scroll(direction: number): void {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.current?.scrollBy({ left: direction * rail.current.clientWidth * 0.8, behavior: reduced ? "instant" : "smooth" });
  }
  return <section id="closer-look" className={s.details}>
    <div className={s.sectionHeading}>
      <div><h2 data-text-enter="heading">It’s all in the details.</h2><p data-text-enter="body" data-text-delay="100">The materials, the finish, the way it all comes together.</p></div>
      <div className={s.carouselControls}>
        <button type="button" disabled={bounds.start} aria-label="Scroll details left" onClick={() => scroll(-1)}><ArrowLeft size={21} /></button>
        <button type="button" disabled={bounds.end} aria-label="Scroll details right" onClick={() => scroll(1)}><ArrowRight size={21} /></button>
      </div>
    </div>
    <div ref={rail} className={s.detailRail} tabIndex={0} aria-label="Project detail photographs, scroll for more">
      {details.map((project) => <button type="button" key={project.id} className={s.detailCard} onClick={() => onOpen(project)}>
        <span className={s.detailPhoto}><Image src={project.src} alt={project.alt} fill sizes="(max-width: 640px) 80vw, 40vw" /></span>
        <span>{project.category}<ArrowUpRight size={18} /></span>
        <span className={s.detailDescription}>{project.detail}</span>
      </button>)}
    </div>
  </section>;
}
