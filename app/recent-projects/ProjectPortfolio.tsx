"use client";
import { Check } from "lucide-react";
import { useState, type ReactElement } from "react";
import FeaturedProjects from "./FeaturedProjects";
import ProjectGallery from "./ProjectGallery";
import ProjectSpotlight from "./ProjectSpotlight";
import ProjectEstimate from "./ProjectEstimate";
import ProjectLightbox from "./ProjectLightbox";
import DetailRail from "./DetailRail";
import { projects, type Category, type Project } from "./projects";
import s from "./portfolio.module.css";
import { useTextEntrances } from "./useTextEntrances";
import { RealWorkPortfolio } from "./RealWorkPortfolio";

export default function ProjectPortfolio(): ReactElement {
  const entranceRoot = useTextEntrances();
  const [category, setCategory] = useState<Category>("All work");
  const [selected, setSelected] = useState<number | null>(null);
  function open(project: Project): void { setSelected(projects.findIndex((item) => item.id === project.id)); }
  function step(delta: number): void { setSelected((current) => current === null ? null : (current + delta + projects.length) % projects.length); }
  return <main ref={entranceRoot} className={s.portfolio}>
    <FeaturedProjects onOpen={open} />
    <section id="our-foundation" className={s.foundation} aria-label="Our foundation">
      <p data-text-enter="heading">Built here.<br /><strong>Made for living.</strong></p>
      <span data-text-enter="body" data-text-delay="80"><Check size={17} /> Veteran-owned</span>
      <span data-text-enter="body" data-text-delay="140"><Check size={17} /> Serving King &amp; Pierce Counties</span>
      <span data-text-enter="body" data-text-delay="200"><Check size={17} /> Remodeling since 2010</span>
    </section>
    <ProjectGallery category={category} onCategory={setCategory} onOpen={open} />
    <RealWorkPortfolio />
    <ProjectSpotlight onOpen={open} />
    <DetailRail onOpen={open} />
    <ProjectEstimate />
    {selected !== null && <ProjectLightbox project={projects[selected]} index={selected} total={projects.length} onClose={() => setSelected(null)} onStep={step} />}
  </main>;
}
