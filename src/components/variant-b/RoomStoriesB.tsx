import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import { ROOMS } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import styles from "./UpperB.module.css";

const ROOM_PHOTOS = [{ image: IMAGES.roomsKitchen, copy: ROOMS.kitchen }, { image: IMAGES.roomsBathroom, copy: ROOMS.bathroom }];
const RULER_TICKS = Array.from({ length: 14 }, (_, index) => 20 + index * 30);

export function RoomStoriesB(): ReactElement {
  return (
    <section id="rooms" aria-labelledby="rooms-b-heading" className={styles.rooms}>
      <div data-motion="copy" className={styles.roomCopy}>
        <h2 id="rooms-b-heading" className={styles.roomHeading}><span>Start with</span>{" "}<span>the spaces</span>{" "}<span>that shape</span>{" "}<span>every day.</span></h2>
        <p className={styles.roomIntro}>{ROOMS.intro}</p>
        <a href="#services" className={styles.cta}>{ROOMS.cta}<ArrowRight size={20} aria-hidden="true" /></a>
      </div>
      <div className={styles.roomPhotos}>
        {ROOM_PHOTOS.map(({ image, copy }) => <figure key={copy.title} className={styles.roomFigure}><div data-motion="photo" className={styles.roomImage}><Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 54vw, 100vw" className={styles.image} /></div><figcaption><span>{copy.title}</span><p>{copy.body}</p></figcaption></figure>)}
      </div>
      <div aria-hidden="true" className={styles.ruler}><span className={styles.rulerEnd}>02</span><span className={styles.roomNumber}>03</span><svg viewBox="0 0 40 430" preserveAspectRatio="none" fill="none"><path d="M20 20V410" stroke="currentColor" />{RULER_TICKS.map((y, index) => <path key={y} d={`M${index % 4 === 0 ? 12 : 16} ${y}H${index % 4 === 0 ? 28 : 24}`} stroke="currentColor" />)}</svg><span className={styles.rulerEnd}>04</span></div>
    </section>
  );
}
