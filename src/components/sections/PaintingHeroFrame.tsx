import type { ReactElement } from "react";

const RULER_TICKS = Array.from({ length: 65 }, (_, tick) => {
  const depth = tick % 8 === 0 ? 16 : tick % 4 === 0 ? 11 : 6;
  return `M${16 + tick * 10} 1v${depth}`;
}).join(" ");

/** A measured photo edge and crop corners share the homepage's line language. */
export function PaintingHeroFrame(): ReactElement {
  return (
    <div data-painting-drawing aria-hidden="true" className="pointer-events-none absolute -inset-2 text-action sm:-inset-3">
      <svg focusable="false" viewBox="0 0 672 34" className="absolute bottom-full left-0 mb-2 w-full fill-none" stroke="currentColor" strokeWidth="1" preserveAspectRatio="xMinYMax meet">
        <path d="M1 25V1H671V25" />
        <path d={RULER_TICKS} />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((unit) => <text key={unit} x={16 + unit * 80 - 4} y="30" fill="currentColor" stroke="none" fontSize="10" className="font-poppins">{unit}</text>)}
      </svg>
      <svg focusable="false" viewBox="0 0 48 48" className="absolute left-0 top-0 size-8 fill-none sm:size-12" stroke="currentColor" strokeWidth="1.5">
        <path vectorEffect="non-scaling-stroke" d="M48 1H1V48" />
      </svg>
      <svg focusable="false" viewBox="0 0 48 48" className="absolute bottom-0 right-0 size-8 fill-none sm:size-12" stroke="currentColor" strokeWidth="1.5">
        <path vectorEffect="non-scaling-stroke" d="M0 47H47V0" />
      </svg>
    </div>
  );
}
