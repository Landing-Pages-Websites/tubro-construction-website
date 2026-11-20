import type { ReactElement } from "react";
import { takesBrandStamp } from "@/lib/blog-image-branding";
import styles from "./brand-stamp.module.css";

/** Tubro logo stamped in the lower-right corner of a positioned blog photo container, unless the photo is already branded. */
export function BrandStamp({ src }: { src: string }): ReactElement | null {
  if (!takesBrandStamp(src)) return null;
  return <span className={styles.stamp} aria-hidden="true" data-brand-stamp="" />;
}
