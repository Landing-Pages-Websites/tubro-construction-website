import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import { CITY_PHOTOS, type CityProfile } from "./city-content";
import styles from "./city.module.css";

export function CityProjects({
  profile,
}: {
  profile: CityProfile;
}): ReactElement {
  const photos = profile.photos.slice(2).map((key) => CITY_PHOTOS[key]);
  return (
    <section
      id="projects"
      className={`${styles.section} ${styles.projects}`}
      aria-labelledby="projects-heading"
    >
      <div className={styles.projectIntro}>
        <h2 id="projects-heading">
          Real homes.
          <br />
          <em>Considered details.</em>
        </h2>
        <p>
          A closer look at Tubro’s work. These photographs come from our shared
          project portfolio across our service area.
        </p>
        <a href="/recent-projects" className={styles.textLink}>
          Explore recent projects
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
      {photos.map((photo, index) => (
        <a
          className={index === 0 ? styles.projectLarge : styles.projectSmall}
          key={photo.title}
          href="/recent-projects"
          aria-label={`View recent projects: ${photo.category}`}
        >
          <figure>
            <div className={styles.projectPhoto}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 767px) 90vw, 51vw"
                    : "(max-width: 767px) 90vw, 36vw"
                }
                style={{ objectPosition: photo.position }}
              />
            </div>
            <figcaption>
              <div>
                <strong>{photo.title}</strong>
                <span>{photo.category}</span>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </figcaption>
          </figure>
        </a>
      ))}
      <p className={styles.projectNote}>
        A place for your ideas.
        <br />
        <span>A team to help bring them together.</span>
      </p>
    </section>
  );
}
