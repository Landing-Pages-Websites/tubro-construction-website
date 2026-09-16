import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import { projects, type Project } from "./projects";
import s from "./portfolio.module.css";
import MeasuredRule from "./MeasuredRule";

export default function ProjectSpotlight({ onOpen }: { onOpen: (project: Project) => void }): ReactElement {
  return <section id="inside-the-work" className={s.spotlight}>
    <div className={s.spotlightImage}>
      <Image src={projects[1].src} alt={projects[1].alt} fill sizes="(max-width: 800px) 100vw, 60vw" />
      <button type="button" onClick={() => onOpen(projects[1])}>Explore this space <ArrowUpRight size={19} /></button>
    </div>
    <div className={s.spotlightCopy}>
      <h2 data-text-enter="heading">A room that changes<br />the everyday.</h2>
      <p data-text-enter="body" data-text-delay="100">More light. A place to slow down. Finishes that feel right together. A thoughtful remodel starts with how you want to live.</p>
      <div className={s.detailFacts}>
        <MeasuredRule />
      <dl>
        <div><dt>The space</dt><dd>Bathroom remodel</dd></div>
        <div><dt>The details</dt><dd>Glass shower · freestanding tub · double vanity</dd></div>
      </dl>
      </div>
      <Link data-text-enter="body" data-text-delay="160" href="/bathroom-remodeling">Explore bathroom remodeling <ArrowRight size={18} /></Link>
    </div>
  </section>;
}
