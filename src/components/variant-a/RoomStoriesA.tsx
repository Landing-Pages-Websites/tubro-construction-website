import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import { ROOMS } from "@/lib/content";
import { IMAGES } from "@/lib/images";

export function RoomStoriesA(): ReactElement {
  return (
    <section id="rooms" aria-labelledby="rooms-a-heading" className="a-rooms">
      <svg className="a-room-route" viewBox="0 0 1536 864" preserveAspectRatio="none" aria-hidden="true"><path d="M212 34H34V274Q34 287 47 287H674V267H850Q868 267 868 285V704Q868 722 886 722H1490Q1503 722 1503 735V826"/><circle cx="34" cy="34" r="5"/><circle cx="1503" cy="826" r="5"/></svg>
      <div className="a-room-intro"><h2 id="rooms-a-heading">{ROOMS.heading}</h2><p>{ROOMS.intro}</p></div>
      <div className="a-room-kitchen"><Image src={IMAGES.roomsKitchen.src} alt={IMAGES.roomsKitchen.alt} fill sizes="(min-width: 768px) 54vw, 100vw" className="object-cover" /><div className="a-room-label"><h3>{ROOMS.kitchen.title}</h3><p>{ROOMS.kitchen.body}</p></div></div>
      <div className="a-room-bathroom"><Image src={IMAGES.roomsBathroom.src} alt={IMAGES.roomsBathroom.alt} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" /><div className="a-room-label"><h3>{ROOMS.bathroom.title}</h3><p>{ROOMS.bathroom.body}</p></div></div>
      <a href="#services" className="a-button a-room-cta">{ROOMS.cta}<ArrowRight aria-hidden="true" /></a>
    </section>
  );
}
