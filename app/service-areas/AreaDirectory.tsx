import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import { CITY_ROUTES, type CityRoute } from "@/lib/routes";
import { CityLinks } from "./CityLinks";
import { ConstructionDrawing } from "./ConstructionDrawing";
import styles from "./service-areas.module.css";

// Rich's confirmed service cities, November 6, 2026. Newcastle is no longer a
// served city, and Fairwood has a local page but stays off this directory.
// Seattle, Redmond, and Puyallup are confirmed cities with no local page yet,
// so they appear as plain text until a verified destination exists.
const CONFIRMED_PAGE_SLUGS = new Set([
  "kent",
  "auburn",
  "renton",
  "sumner",
  "tacoma",
  "buckley",
  "bellevue",
  "issaquah",
  "covington",
  "sammamish",
  "snoqualmie",
  "black-diamond",
  "enumclaw",
  "north-bend",
  "ravensdale",
  "bonney-lake",
  "maple-valley",
]);
const PLAIN_TEXT_CITIES: CityRoute[] = [
  { city: "Redmond", citySlug: "redmond", path: "", slug: "redmond", title: "" },
  { city: "Seattle", citySlug: "seattle", path: "", slug: "seattle", title: "" },
  { city: "Puyallup", citySlug: "puyallup", path: "", slug: "puyallup", title: "" },
];

const PIERCE_CITIES = new Set(["tacoma", "sumner", "bonney-lake", "buckley", "puyallup"]);
const confirmedRoutes = CITY_ROUTES.filter(({ citySlug }) => CONFIRMED_PAGE_SLUGS.has(citySlug));
const directoryCities = [...confirmedRoutes, ...PLAIN_TEXT_CITIES];
const kingCities = directoryCities.filter(({ citySlug }) => !PIERCE_CITIES.has(citySlug));
const pierceCities = directoryCities.filter(({ citySlug }) => PIERCE_CITIES.has(citySlug));

export function AreaDirectory(): ReactElement {
  return (
    <section data-mega-section="city-directory" id="city-directory" className={`${styles.section} ${styles.directory}`} aria-labelledby="directory-heading">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>Our communities</p><h2 id="directory-heading">Good work starts<br />in your neighborhood.</h2></div>
        <p>Each linked city has its own remodeling page, with kitchen, bathroom, addition, painting, and general contracting work. Pick your community to see local services and request a free estimate.</p>
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
