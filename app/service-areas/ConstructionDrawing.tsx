import type { ReactElement } from "react";
import styles from "./service-areas.module.css";

type DrawingKind = "measure" | "elevation" | "detail" | "plan";

const DRAWINGS: Record<DrawingKind, { viewBox: string; lines: string[]; guides: string[] }> = {
  measure: {
    viewBox: "0 0 600 28",
    lines: ["M8 14H592 M8 5V23 M592 5V23 M3 19L13 9 M587 19L597 9"],
    guides: ["M68 10V18 M128 10V18 M188 10V18 M248 10V18 M308 5V23 M368 10V18 M428 10V18 M488 10V18 M548 10V18"],
  },
  elevation: {
    viewBox: "0 0 360 158",
    lines: [
      "M12 122H348 M30 122V69L76 33 122 69V122 M22 69L76 27 130 69",
      "M122 122V56L188 12 254 56V122 M112 56L188 6 264 56",
      "M254 122V79L300 46 336 72V122 M246 79L300 40 344 72",
      "M48 122V88H77V122 M89 83H109V104H89Z M56 62H78V77H56Z",
      "M145 72H175V97H145Z M145 84H175 M160 72V97 M193 122V76H224V122 M199 97H201",
      "M176 42H198V58H176Z M187 42V58 M273 89H295V107H273Z M307 122V86H326V122",
      "M21 143H338 M21 136V150 M338 136V150 M16 148L26 138 M333 148L343 138",
    ],
    guides: ["M6 127H353 M21 130V154 M338 130V154 M76 18V23 M188 0V3 M7 18H17 M12 13V23 M341 25H351 M346 20V30"],
  },
  detail: {
    viewBox: "0 0 200 116",
    lines: [
      "M29 68L109 22 168 56 88 102Z M29 68V78L88 112 168 66V56 M88 102V112",
      "M42 61L101 95 M59 51L118 85 M76 41L135 75 M93 31L152 65",
      "M49 90V101L59 107V96 M137 84V99L147 93V78",
    ],
    guides: ["M14 56L94 10 M10 50L18 62 M90 4L98 16 M117 10L183 48 M113 16L121 4 M179 54L187 42"],
  },
  plan: {
    viewBox: "0 0 200 260",
    lines: [
      "M30 28H169V208H111 M85 208H30V28 M36 34H163V202H111 M85 202H36V34",
      "M30 112H87 M112 112H169 M36 118H87 M112 118H163",
      "M104 34V75 M104 98V112 M110 34V75 M110 98V112",
      "M111 208V182A26 26 0 0 0 85 208 M87 112V87A25 25 0 0 1 112 112",
      "M104 75H127A23 23 0 0 1 104 98 M42 41H94V57H42Z M48 45H65V53H48Z M71 45H88V53H71Z",
      "M118 42H154V78H118Z M122 46H150V54H122Z M48 141H80V183H48Z M52 145H76V179H52Z",
      "M125 144H152V184H125Z M125 154H152 M125 174H152 M20 225H180 M20 219V231 M180 219V231",
      "M13 20V214 M7 20H19 M7 214H19",
    ],
    guides: ["M20 12V238 M180 12V238 M5 20H189 M5 214H189 M14 246H48 M31 240V252"],
  },
};

/** Decorative construction sketches, never maps or project specifications. */
export function ConstructionDrawing({ kind, className }: { kind: DrawingKind; className: string }): ReactElement {
  const drawing = DRAWINGS[kind];
  return (
    <svg viewBox={drawing.viewBox} className={`${styles.drawing} ${className}`} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="square" strokeLinejoin="miter">
      <g opacity=".38">{drawing.guides.map(path => <path key={path} d={path} />)}</g>
      <g>{drawing.lines.map(path => <path key={path} d={path} />)}</g>
    </svg>
  );
}
