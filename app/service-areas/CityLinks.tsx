import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import type { CityRoute } from "@/lib/routes";
import styles from "./service-areas.module.css";

export function CityLinks({ cities, columns = false }: { cities: CityRoute[]; columns?: boolean }): ReactElement {
  return (
    <ul className={`${styles.cityLinks} ${columns ? styles.cityColumns : ""}`}>
      {cities.map(({ city, citySlug, path }) => (
        <li key={citySlug}><a href={path}><span>{city}{citySlug === "auburn" && <small>King &amp; Pierce</small>}</span><ArrowUpRight aria-hidden="true" /></a></li>
      ))}
    </ul>
  );
}
