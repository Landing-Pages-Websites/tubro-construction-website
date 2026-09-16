import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import { CITY_ROUTES } from "@/lib/routes";
import { CityLinks } from "./CityLinks";
import { ConstructionDrawing } from "./ConstructionDrawing";
import styles from "./service-areas.module.css";

const PIERCE_CITIES = new Set(["tacoma", "sumner", "bonney-lake", "buckley"]);
const kingCities = CITY_ROUTES.filter(({ citySlug }) => !PIERCE_CITIES.has(citySlug));
const pierceCities = CITY_ROUTES.filter(({ citySlug }) => PIERCE_CITIES.has(citySlug));

export function AreaDirectory(): ReactElement {
  return (
    <section id="city-directory" className={`${styles.section} ${styles.directory}`} aria-labelledby="directory-heading">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>Our communities</p><h2 id="directory-heading">Good work starts<br />in your neighborhood.</h2></div>
        <p>Find your community below to explore local remodeling services and take the next step with Tubro.</p>
      </div>
      <div className={styles.counties}>
        <div id="king-county" className={styles.county}>
          <div className={styles.countyHeading}><h3>King County</h3><span>From the Eastside to the foothills</span></div>
          <CityLinks cities={kingCities} columns />
        </div>
        <div id="pierce-county" className={styles.county}>
          <div className={styles.countyHeading}><h3>Pierce County</h3><span>Tacoma &amp; nearby communities</span></div>
          <CityLinks cities={pierceCities} />
          <p className={styles.countyNote}>Auburn spans both counties. You’ll find its local page in the King County list.</p>
          <a className={styles.directoryHelp} href="#service-fit"><span>Don’t see your city?<small>Let’s check your project location.</small></span><ArrowRight aria-hidden="true" /></a>
          <ConstructionDrawing kind="elevation" className={styles.directoryDrawing} />
        </div>
      </div>
    </section>
  );
}
