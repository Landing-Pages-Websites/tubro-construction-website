import type { ReactElement } from "react";
import styles from "./custom-home.module.css";

export function FloorPlan(): ReactElement {
  return (
    <svg className={styles.floorPlan} viewBox="0 0 500 380" fill="none" aria-hidden="true">
      <g className={styles.constructionLines}><path d="M22 40H472M22 326H472M57 16V358M435 16V358M57 347H435M57 341V353M435 341V353M31 40V326M25 40H37M25 326H37" /><path strokeDasharray="5 5" d="M246 15V357M22 188H472" /></g>
      <g className={styles.planWalls}><path d="M57 40H435V326H289M238 326H57V40M246 40V151M246 199V326M57 188H143M191 188H246M246 151H344M387 151H435" /><path d="M57 47H428V319H289M238 319H64V47M239 47V151M239 199V319M64 181H143M191 181H239M253 144H344M387 144H428" /></g>
      <g className={styles.planFurniture}><path d="M238 326V275A51 51 0 0 1 289 326M246 199H198A48 48 0 0 1 246 151M143 188V140A48 48 0 0 1 191 188M344 151V108A43 43 0 0 1 387 151" /><rect x="84" y="67" width="120" height="82" rx="2" /><path d="M84 91H204M96 76H133V87H96ZM153 76H190V87H153ZM84 213H202V276H84ZM84 213V260H202V213M95 276V284M191 276V284" /><rect x="287" y="64" width="120" height="55" rx="2" /><path d="M300 64V119M393 64V119M305 78H320V103H305ZM373 78H388V103H373ZM276 172H408V208H384V185H276Z" /><rect x="286" y="239" width="86" height="47" rx="2" /><path d="M300 230V237M327 230V237M355 230V237M300 289V297M327 289V297M355 289V297" /><circle cx="163" cy="299" r="10" /><path d="M159 299H167M163 295V303" /></g>
      <g className={styles.drawingAccent}><path d="M88 40H191M291 40H390M435 218V285M57 221V282M93 326H180" strokeWidth="5" /><path d="M446 60V24L438 38M446 24L454 38" /></g>
    </svg>
  );
}
