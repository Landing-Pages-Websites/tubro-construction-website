import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import styles from "./custom-home.module.css";

export function CustomHomeCabinetryPricing(): ReactElement {
  return (
    <section
      data-mega-section="cabinetry-pricing"
      id="custom-cabinetry-pricing"
      className={styles.cabinetryPricing}
      aria-labelledby="cabinetry-pricing-heading"
    >
      <div className={styles.cabinetryPricingIntro}>
        <p className={styles.eyebrow}>Pricing the details</p>
        <h2 id="cabinetry-pricing-heading">Custom cabinetry pricing starts with the plan.</h2>
        <p className={styles.body}>
          There is no single custom-cabinetry price that fits every home. The estimate depends on the room, the layout, the way you want to use the space, and the selections that bring the design together.
        </p>
      </div>
      <div className={styles.cabinetryPricingDetails}>
        <p className={styles.cabinetryPricingLead}>For a useful estimate, Tubro looks at:</p>
        <ul>
          <li>
            <strong>Design and layout:</strong> Room dimensions, cabinet count, storage needs, appliance locations, and any changes to the floor plan.
          </li>
          <li>
            <strong>Materials and finish:</strong> Cabinet construction, wood or panel choices, door style, finish, hardware, and other selected details.
          </li>
          <li>
            <strong>Scope and site conditions:</strong> Removal, preparation, trim, and coordination with other work when those items are included in the project scope, along with conditions found in the existing space.
          </li>
          <li>
            <strong>Project coordination:</strong> How the cabinetry connects with the rest of a kitchen or whole-home build, including sequencing and the responsibilities covered by the estimate.
          </li>
        </ul>
        <p className={styles.body}>
          A clear conversation about priorities helps separate must-haves from flexible choices. Tubro&apos;s team can then clarify the scope, coordinate the build path, and prepare an estimate for your project rather than applying a generic price to it.
        </p>
        <a className={styles.textLink} href="https://www.tubroconstruction.com/contact">
          Request a free estimate <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
