import { Clock3, Phone, ShieldCheck } from "lucide-react";
import type { ReactElement } from "react";
import { LeadForm } from "@/components/sections/LeadForm";
import { BRAND, PROJECT_TYPES } from "@/lib/content";
import { formKeyForSlug } from "@/lib/form-keys";
import type { CityRoute } from "@/lib/routes";
import styles from "./city.module.css";

export function CityEstimate({ route }: { route: CityRoute }): ReactElement {
  return (
    <section
      id="form"
      className={`${styles.section} ${styles.estimate}`}
      aria-labelledby="estimate-heading"
    >
      <div className={styles.estimateIntro}>
        <h2 id="estimate-heading">
          Let’s make your
          <br />
          <em>{route.city} home</em>
          <br />
          work better for you.
        </h2>
        <p>
          Tell us what you’re planning. We’ll review your request and help you
          take the next step.
        </p>
        <div className={styles.contactDetails}>
          <p>Prefer to talk it through?</p>
          <a href={BRAND.phoneHref}>
            <Phone aria-hidden="true" />
            {BRAND.phoneDisplay}
          </a>
          <span>
            <Clock3 aria-hidden="true" />
            {BRAND.hours}
          </span>
        </div>
        <p className={styles.discount}>
          <ShieldCheck aria-hidden="true" />
          {BRAND.discount}
        </p>
      </div>
      <div className={styles.formWrap}>
        <h3>Request your free estimate</h3>
        <p>Start with a few details about your project.</p>
        <LeadForm
          key={route.citySlug}
          formKey={formKeyForSlug(route.slug)}
          pagePath={route.path}
          options={[...PROJECT_TYPES]}
          submitLabel="Schedule a Free Estimate"
          idPrefix={`city-${route.citySlug}`}
          defaultCity={route.city}
        />
      </div>
    </section>
  );
}
