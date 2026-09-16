import type { ReactElement } from "react";
import styles from "./custom-home.module.css";

/** Decorative concept elevation, deliberately separate from project photography. */
export function HouseDrawing(): ReactElement {
  return (
    <svg viewBox="0 0 480 280" fill="none" aria-hidden="true" className={styles.houseDrawing}>
      <g className={styles.constructionLines}>
        <path d="M28 236H456M64 28V256M416 28V256M30 91H455M30 218H455M240 18V250" />
        <path d="M64 252H416M64 245V259M416 245V259M57 259L71 245M409 259L423 245M35 91V218M29 98L41 84M29 225L41 211" />
      </g>
      <g className={styles.drawingStructure}>
        <path d="M64 218V114L152 43L240 114V218M47 116L152 31L257 116M64 101V91L152 20L240 91V101M240 91H379L433 130H257M240 102H375L411 130M416 130V218H64" />
        <path d="M89 218V137H132V218M98 150H123V186H98ZM102 199H107M154 138H212V193H154ZM183 138V193M154 165H212M270 151H390V218M310 151V218M350 151V218M270 166H390M270 182H390M270 199H390M131 93L152 76L173 93V114H131ZM152 77V114M131 99H173" />
        <path d="M75 225H425M78 231H428M261 218V144H398V218M64 122H240M64 130H240M64 203H88M133 203H240M241 139H416M325 90V62H347V90M321 62H351" />
      </g>
      <g className={styles.drawingAccent}>
        <path d="M47 116L152 31L257 116H433L379 77H241" />
        <path d="M25 237H50M38 224V250M433 236H458M446 223V249" />
        <circle cx="240" cy="218" r="4" />
      </g>
    </svg>
  );
}
