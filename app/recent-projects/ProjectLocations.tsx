import Link from "next/link";
import type { ReactElement } from "react";
import styles from "./realwork.module.css";

type ProjectExample = {
  title: string;
  location: string;
  detail: string;
  href?: string;
  linkLabel?: string;
};

// Showcase projects and locations visible in Rich's public Realworks portfolio on November 6, 2026.
const PROJECTS: ProjectExample[] = [
  {
    title: "Elegant Bathroom Renovation",
    location: "Black Diamond, WA",
    detail: "Primary bathroom remodel",
    href: "/service-area/home-remodeling-black-diamond",
    linkLabel: "Black Diamond remodeling",
  },
  {
    title: "Primary Bedroom and Bathroom Transformation",
    location: "Kirkland, WA",
    detail: "Primary bedroom and bathroom remodel",
    href: "/bathroom-remodeling",
    linkLabel: "Bathroom remodeling",
  },
  {
    title: "Siding and Soffit Work",
    location: "Tacoma, WA",
    detail: "Tongue-and-groove siding and soffit work",
    href: "/service-area/home-remodeling-tacoma",
    linkLabel: "Tacoma remodeling",
  },
  {
    title: "Multi-Room Renovation for a 1970s Rambler Home",
    location: "Renton, WA",
    detail: "Kitchen, bathroom, and flooring renovation",
    href: "/service-area/home-remodeling-renton",
    linkLabel: "Renton remodeling",
  },
  {
    title: "Outdoor Kitchen with Fireplace",
    location: "Puyallup, WA",
    detail: "Outdoor kitchen and fireplace rebuild",
  },
  {
    title: "Kitchen Renovation",
    location: "Renton, WA",
    detail: "Kitchen remodel with cabinets, countertops, and flooring",
    href: "/kitchen-remodeling",
    linkLabel: "Kitchen remodeling",
  },
  {
    title: "Complete Kitchen Makeover",
    location: "Black Diamond, WA",
    detail: "Open kitchen remodel",
    href: "/kitchen-remodeling",
    linkLabel: "Kitchen remodeling",
  },
  {
    title: "Bathroom Renovation",
    location: "Sammamish, WA",
    detail: "Primary bathroom renovation",
    href: "/service-area/home-remodeling-sammamish",
    linkLabel: "Sammamish remodeling",
  },
  {
    title: "Home Renovations, Inside and Out",
    location: "Auburn, WA",
    detail: "Kitchen, two bathrooms, and a composite deck",
    href: "/service-area/home-remodeling-auburn",
    linkLabel: "Auburn remodeling",
  },
];

export function ProjectLocations(): ReactElement {
  return <section data-mega-section="project-locations" id="project-locations" className={styles.locations} aria-labelledby="project-locations-heading">
    <div className={styles.heading}>
      <div>
        <p>From the live portfolio</p>
        <h2 id="project-locations-heading">Project Locations and Details</h2>
      </div>
      <p>These showcase projects and locations are from Tubro Construction’s public project portfolio. Photos and the full project map stay in the interactive portfolio above.</p>
    </div>
    <ul className={styles.locationList}>
      {PROJECTS.map((project) => <li key={`${project.title}-${project.location}`}>
        <h3>{project.title}</h3>
        <p>{project.location}. {project.detail}.</p>
        {project.href && project.linkLabel ? <Link href={project.href}>{project.linkLabel}</Link> : null}
      </li>)}
    </ul>
  </section>;
}
