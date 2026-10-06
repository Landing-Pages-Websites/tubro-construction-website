import type { ReactElement } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import type { CityRoute } from "@/lib/routes";
import { CityHero } from "./CityHero";
import { CityTrust } from "./CityTrust";
import { CityProcess } from "./CityProcess";
import { CityServices } from "./CityServices";
import { CityProjects } from "./CityProjects";
import { CityQuestions } from "./CityQuestions";
import { CityEstimate } from "./CityEstimate";
import { CityMoreAreas } from "./CityMoreAreas";
import { CityMotion } from "./CityMotion";
import { CITY_PROFILES } from "./city-content";
import styles from "./city.module.css";

export function CityPageLayout({ route }: { route: CityRoute }): ReactElement {
  const profile = CITY_PROFILES[route.citySlug];
  return (
    <div className={styles.frame} data-motion-variant="a">

      <SiteHeader />
      <main className={styles.page} data-city-page id="main-content" tabIndex={-1}>
        <CityMotion key={route.citySlug} />
        <CityHero route={route} profile={profile} />
        <CityTrust />
        <CityProcess />
        <CityServices city={route.city} profile={profile} />
        <CityProjects profile={profile} />
        <CityQuestions city={route.city} profile={profile} />
        <CityEstimate route={route} />
        <CityMoreAreas citySlug={route.citySlug} />
      </main>
      <SiteFooter />
    </div>
  );
}
