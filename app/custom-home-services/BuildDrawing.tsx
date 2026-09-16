import type { ReactElement } from "react";
import styles from "./custom-home.module.css";

/** Concept framing section: roof structure, wall studs, and a measured foundation. */
export function BuildDrawing(): ReactElement {
  return (
    <svg className={styles.processDrawing} viewBox="0 0 420 210" fill="none" aria-hidden="true">
      <g strokeWidth=".65" opacity=".45">
        <path d="M22 166H398M60 60V198M360 60V198M210 10V177" strokeDasharray="4 5" />
        <path d="M60 190H360M60 184V196M360 184V196M55 195L65 185M355 195L365 185M29 80V160M23 85L35 73M23 166L35 154M22 80H48M22 160H48" />
      </g>
      <g strokeWidth="1.6" strokeLinejoin="round">
        <path d="M42 86L210 20L378 86L374 96L210 32L46 96Z" />
        <path d="M60 90V160H360V90M68 93V152H352V93M60 160V168H360V160M68 99H352M68 105H352" />
        <path d="M104 105V152M140 105V152M176 105V152M244 105V152M280 105V152M316 105V152M204 105V152M216 105V152" />
        <path d="M210 32V93M116 69L156 93L210 32L264 93L304 69M87 80H333M79 93H341" />
      </g>
      <g strokeWidth="2.5">
        <path d="M42 86L210 20L378 86M60 168H360" />
        <path d="M54 160H66M60 154V166M354 160H366M360 154V166" />
      </g>
      <g strokeWidth="1" opacity=".65"><path d="M210 20H315L337 6H389M281 125H373L390 111H408" /><circle cx="210" cy="20" r="3" /><circle cx="281" cy="125" r="3" /></g>
    </svg>
  );
}
