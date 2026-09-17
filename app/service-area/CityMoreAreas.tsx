import { ArrowUpRight, MapPin } from "lucide-react";
import type { ReactElement } from "react";
import { CITY_ROUTES } from "@/lib/routes";
import styles from "./city.module.css";

export function CityMoreAreas({
  citySlug,
}: {
  citySlug: string;
}): ReactElement {
  return (
    <section
      className={`${styles.section} ${styles.moreAreas}`}
      aria-labelledby="more-areas-heading"
    >
      <div>
        <MapPin aria-hidden="true" />
        <h2 id="more-areas-heading">Good work. Across our communities.</h2>
        <a href="/service-areas" className={styles.textLink}>
          View all service areas
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
      <nav aria-label="Other service areas">
        {CITY_ROUTES.filter((route) => route.citySlug !== citySlug).map(
          (route) => (
            <a href={route.path} key={route.citySlug}>
              {route.city}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ),
        )}
      </nav>
    </section>
  );
}
