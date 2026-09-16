"use client";
import { ArrowDown, ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { useState, type CSSProperties, type ReactElement } from "react";
import AnimatedProjectPhoto from "./AnimatedProjectPhoto";
import { featured, type Project } from "./projects";
import s from "./portfolio.module.css";
import m from "./photo-motion.module.css";

export default function FeaturedProjects({ onOpen }: { onOpen: (project: Project) => void }): ReactElement {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  function step(delta: number): void { setDirection(delta); setIndex((current) => (current + delta + featured.length) % featured.length); }
  function select(next: number): void { setDirection(next < index ? -1 : 1); setIndex(next); }
  const project = featured[index];
  return <section id="hero" className={s.hero} aria-label="Featured projects">
    <div className={s.heroHeading}><h1><span data-text-hero="first">Good work.</span><br /><span data-text-hero="second">Real homes.</span></h1><div><p data-text-hero="copy">A closer look at the spaces we’ve helped homeowners reimagine. Kitchens, bathrooms, and everything that makes a house feel like yours.</p><a data-text-hero="link" href="#project-gallery">Explore our recent projects <ArrowDown size={17} /></a></div></div>
    <div className={s.feature} role="region" aria-roledescription="carousel" aria-label="Featured project photographs">
      <AnimatedProjectPhoto project={project} mode="hero" direction={direction} priority sizes="(max-width: 700px) 100vw, 92vw" />
      <div className={s.featureTop}><span>Selected work / Tubro Construction</span><button type="button" aria-label={`Enlarge ${project.title}`} onClick={() => onOpen(project)}><Expand size={19} /></button></div>
      <div className={s.featureBottom}><div aria-live="polite"><div key={project.id} className={m.caption}><span>{project.category}</span><h2>{project.title}</h2></div></div><div className={s.carouselControls}><button type="button" aria-label="Previous featured project" onClick={() => step(-1)}><ArrowLeft size={20} /></button><span>{String(index + 1).padStart(2, "0")} <i>/ {String(featured.length).padStart(2, "0")}</i></span><button type="button" aria-label="Next featured project" onClick={() => step(1)}><ArrowRight size={20} /></button></div></div>
    </div>
    <div className={`${s.featureNav} ${m.nav}`} style={{ "--selected-index": index } as CSSProperties}><span className={m.indicator} aria-hidden="true" />{featured.map((item, i) => <button type="button" key={item.id} aria-pressed={index === i} onClick={() => select(i)}><span>0{i + 1}</span>{item.category}<ArrowRight size={15} /></button>)}</div>
  </section>;
}
