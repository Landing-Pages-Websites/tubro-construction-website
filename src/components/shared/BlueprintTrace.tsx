import type { ReactElement } from "react";

/** A temporary survey overlay, removed visually when the photograph settles. */
export function BlueprintTrace(): ReactElement {
  return (
    <svg className="motion-survey" viewBox="0 0 1000 800" preserveAspectRatio="none" aria-hidden="true">
      <path data-motion="survey" d="M80 180V720H920V180H80M80 450H920M500 180V720" />
      <path data-motion="survey" d="M60 160H130M80 140V210M870 160H940M920 140V210M60 740H130M80 690V760M870 740H940M920 690V760" />
      <path data-motion="survey" d="M130 760H870M130 750V770M315 754V766M500 750V770M685 754V766M870 750V770" />
    </svg>
  );
}
