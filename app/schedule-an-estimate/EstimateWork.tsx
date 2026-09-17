import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import s from "./estimate.module.css";

const work = [
  { src: "/images/projects/0125047_kitchen%2001.jpg", alt: "Completed gray kitchen with a broad island and open connection to the living area", label: "Spaces to come together.", category: "Kitchen remodeling" },
  { src: "/images/projects/0925012_bathroom%2001.jpg", alt: "Completed bathroom with a glass shower, freestanding tub, and double vanity", label: "Room to slow down.", category: "Bathroom remodeling" },
  { src: "/images/projects/1221004_deck%2001.jpg", alt: "Finished deck with black railings and an open neighborhood view", label: "A little more outside.", category: "Decks & outdoor living" },
];

export default function EstimateWork(): ReactElement {
  return <section id="recent-work" className={s.work}>
    <div className={s.workHeading}><div><h2 data-estimate-enter="heading">Big ideas.<br />Real homes.</h2><p data-estimate-enter="body" data-estimate-delay="100">A few possibilities, from work we’ve already brought to life.</p></div><Link data-estimate-enter="body" data-estimate-delay="160" href="/recent-projects">Explore recent projects <ArrowUpRight size={19} /></Link></div>
    <div className={s.workGrid}>{work.map((item) => <Link href="/recent-projects" key={item.src} className={s.workCard}><div className={s.workImage}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 90vw, 40vw" /><ArrowUpRight size={22} /></div><span>{item.category}</span><h3 data-estimate-enter="heading">{item.label}</h3></Link>)}</div>
  </section>;
}
