import type { ReactElement } from "react";
import styles from "./brand-stamp.module.css";

/** Tubro logo stamped in the lower-right corner of a positioned blog photo container. */
export function BrandStamp(): ReactElement {
  return <span className={styles.stamp} aria-hidden="true" data-brand-stamp="" />;
}
