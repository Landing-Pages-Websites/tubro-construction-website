import type { ReactElement } from "react";
import ProjectCard from "./ProjectCard";
import { categories, projects, type Category, type Project } from "./projects";
import s from "./portfolio.module.css";
import { useGalleryMotion } from "./useGalleryMotion";

interface Props { category: Category; onCategory: (category: Category) => void; onOpen: (project: Project) => void }

export default function ProjectGallery({ category, onCategory, onOpen }: Props): ReactElement {
  const { grid, capture } = useGalleryMotion(category);
  function select(next: Category): void {
    if (next === category) return;
    capture();
    onCategory(next);
  }
  const visible = projects.filter((project) => category === "All work" || project.category === category);
  return <section id="project-gallery" className={s.gallery}>
    <div className={s.sectionHeading}>
      <div><h2 data-text-enter="heading">Spaces with a story.</h2><p data-text-enter="body" data-text-delay="100">Find your inspiration in our recent work. Select a photograph to take a closer look.</p></div>
      <span className={s.galleryCount} aria-live="polite">{visible.length} photographs</span>
    </div>
    <div className={s.filters} role="group" aria-label="Filter project photographs">
      {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => select(item)}>
        {item}<span>{item === "All work" ? projects.length : projects.filter((project) => project.category === item).length}</span>
      </button>)}
    </div>
    <div ref={grid} className={s.projectGrid}>
      {visible.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}
    </div>
  </section>;
}
