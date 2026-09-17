import { ClipboardCheck, ShieldCheck, UserRoundCheck } from "lucide-react";
import type { ReactElement } from "react";
import styles from "./city.module.css";

export function CityTrust(): ReactElement {
  return (
    <section
      id="trust-bar"
      className={styles.trust}
      aria-label="Why homeowners choose Tubro"
    >
      <p>
        <ShieldCheck aria-hidden="true" />
        <span>
          <strong>Veteran-owned</strong>Building since 2010
        </span>
      </p>
      <p>
        <ClipboardCheck aria-hidden="true" />
        <span>
          <strong>Upfront pricing</strong>No hidden fees
        </span>
      </p>
      <p>
        <UserRoundCheck aria-hidden="true" />
        <span>
          <strong>Your point of contact</strong>Assigned project management
        </span>
      </p>
    </section>
  );
}
