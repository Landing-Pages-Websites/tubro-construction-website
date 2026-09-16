import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import { projects } from "./projects";
import s from "./portfolio.module.css";

export default function ProjectEstimate(): ReactElement {
  return <section id="your-next-project" className={s.nextProject}>
    <div>
      <h2 data-text-enter="heading">Your home.<br /><span>The next great project.</span></h2>
      <p data-text-enter="body" data-text-delay="100">Tell us what you have in mind. We’ll help you take the next step with a free estimate and a clear plan.</p>
      <Link data-text-enter="body" data-text-delay="180" className={s.primary} href="/schedule-an-estimate">Schedule a free estimate <ArrowUpRight size={20} /></Link>
      <span className={s.ctaNote}>Kitchens, bathrooms, additions &amp; whole-home renovations.</span>
    </div>
    <div className={s.nextImage}><Image src={projects[0].src} alt={projects[0].alt} fill sizes="(max-width: 800px) 100vw, 40vw" /></div>
  </section>;
}
