import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import type { Project } from "./projects";
import s from "./portfolio.module.css";

export default function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }): ReactElement {
  return <button type="button" data-project-id={project.id} className={s.projectCard} onClick={() => onOpen(project)} aria-label={`View ${project.title}: ${project.category}`}>
    <div className={s.cardImage}><Image src={project.src} alt={project.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 60vw" /><span className={s.expand}><ArrowUpRight size={22} /></span></div>
    <div className={s.cardCaption}><h3>{project.title}</h3><span>{project.category}</span></div>
  </button>;
}
