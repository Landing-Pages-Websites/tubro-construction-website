import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import { CITY_PHOTOS, type CityProfile } from "./city-content";
import styles from "./city.module.css";

const SERVICES = [
  {
    title: "Kitchen remodeling",
    body: "Layouts, cabinetry, countertops, and the details that bring a kitchen together.",
    href: "/kitchen-remodeling",
  },
  {
    title: "Bathroom remodeling",
    body: "Showers, tubs, tile, and storage planned around your daily routine.",
    href: "/bathroom-remodeling",
  },
  {
    title: "Additions & home renovations",
    body: "Explore more room, a better flow, or a broader change to your home.",
    href: "/general-contractor",
  },
  {
    title: "Interior & exterior painting",
    body: "A fresh finish for the surfaces you see and use every day.",
    href: "/interior-exterior-painting",
  },
  {
    title: "Custom homes & outdoor living",
    body: "Talk through a new home, a deck, or the next possibility for your property.",
    href: "/custom-home-services",
  },
];

export function CityServices({
  city,
  profile,
}: {
  city: string;
  profile: CityProfile;
}): ReactElement {
  const photo = CITY_PHOTOS[profile.photos[1]];
  return (
    <section
      id="services"
      className={`${styles.section} ${styles.services}`}
      aria-labelledby="services-heading"
    >
      <div className={styles.serviceIntro}>
        <h2 id="services-heading">
          Better spaces.
          <br />
          <em>Your kind of home.</em>
        </h2>
        <p>
          {profile.servicesIntroVariant === "kitchen" ? (
            <>
              Explore kitchen remodeling in Renton with Tubro Construction, including layout planning, cabinetry, countertops, and finishes. Compare our{" "}
              <a href="/kitchen-remodeling">Kitchen remodeling</a> service with{" "}
              <a href="/bathroom-remodeling">Bathroom remodeling</a>, and learn about{" "}
              <a href="/general-contractor">General contracting</a> when your project needs broader coordination. When you submit an estimate request, we’ll review your Renton property and project details to confirm fit.
            </>
          ) : profile.servicesIntroVariant === "contractor" ? (
            <>
              Explore home remodeling services for Auburn properties, including
              kitchens, bathrooms, additions, painting, and custom homes. For
              broader project coordination, learn about Tubro’s{" "}
              <a href="/general-contractor">general contracting services</a>.
              We’ll review your project details and confirm the right fit when
              you submit an estimate request.
            </>
          ) : (
            <>
              Explore what Tubro can help you plan. We’ll confirm the fit for your{" "}
              {city} property when we review your request.
            </>
          )}
        </p>
        <figure className={styles.serviceFigure}>
          <div className={styles.servicePhoto}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 767px) 90vw, 40vw"
              style={{ objectPosition: photo.position }}
            />
          </div>
          <figcaption>
            {photo.category}
            <span>Tubro project photography</span>
          </figcaption>
        </figure>
      </div>
      <div className={styles.serviceList}>
        {SERVICES.map((service) => (
          <a
            href={
              service.title === "Additions & home renovations" && profile.additionsHref
                ? profile.additionsHref
                : service.href
            }
            key={service.title}
          >
            <div>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ))}
        <p className={styles.serviceNote}>
          Have something else in mind? <a href="#form">Tell us about it.</a>
        </p>
      </div>
    </section>
  );
}
