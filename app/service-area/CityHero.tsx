import Image from "next/image";
import { ArrowDown, ArrowUpRight, ChevronRight, MapPin } from "lucide-react";
import type { ReactElement } from "react";
import type { CityRoute } from "@/lib/routes";
import { CITY_PHOTOS, type CityProfile } from "./city-content";
import styles from "./city.module.css";
import motion from "./city-hero-motion.module.css";

export function CityHero({
  route,
  profile,
}: {
  route: CityRoute;
  profile: CityProfile;
}): ReactElement {
  const photo = CITY_PHOTOS[profile.photos[0]];
  return (
    <section id="hero" className={styles.hero} aria-labelledby="city-heading">
      <div className={`${styles.heroCopy} ${motion.copy}`}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <a href="/service-areas">Service areas</a>
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">{route.city}</span>
        </nav>
        <h1 id="city-heading">
          Home remodeling
          <br />
          <span>in {route.city}.</span>
        </h1>
        <p className={styles.heroBody}>{profile.intro}</p>
        <a href="#form" className={styles.button}>
          Schedule a Free Estimate
          <ArrowUpRight aria-hidden="true" />
        </a>
        <a href="#services" className={styles.textLink}>
          Explore remodeling services
          <ArrowDown aria-hidden="true" />
        </a>
        <p className={styles.location}>
          <MapPin aria-hidden="true" />
          {route.city}, Washington
        </p>
      </div>
      <figure className={`${styles.heroFigure} ${motion.figure}`}>
        <div className={`${styles.heroPhoto} ${motion.photo}`}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="(max-width: 767px) 90vw, 52vw"
            style={{ objectPosition: photo.position }}
          />
        </div>
        <figcaption className={`${styles.heroCaption} ${motion.caption}`}>
          <span>From the Tubro portfolio</span>
          <strong>{photo.category}</strong>
          <a href="#projects" aria-label="Explore Tubro project photography">
            <ArrowDown aria-hidden="true" />
          </a>
        </figcaption>
      </figure>
    </section>
  );
}
