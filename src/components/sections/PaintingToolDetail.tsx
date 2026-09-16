import type { ReactElement } from "react";

/** An orthographic roller detail with the homepage's construction guide marks. */
export function PaintingToolDetail(): ReactElement {
  return (
    <svg data-painting-roller aria-hidden="true" focusable="false" viewBox="0 0 240 140" className="pointer-events-none mt-8 h-28 w-48 text-action sm:h-36 sm:w-60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M22 11V4M128 11V4M22 7H128M18 3L26 11M124 3L132 11" opacity="0.55" />
      <path data-roller-paint d="M22 31V72H128V31" fill="var(--color-sage)" stroke="none" />
      <g data-roller-tool>
      <rect x="22" y="17" width="106" height="22" rx="4" fill="var(--color-plaster)" />
      <path d="M30 18V38M120 18V38M128 28H139Q145 28 145 34V44Q145 50 139 50H81Q75 50 75 56V62" />
      <rect x="69" y="62" width="12" height="30" rx="3" fill="var(--color-plaster)" />
      <path d="M73 84H77" />
      </g>
      <path d="M8 17V72M4 17H12M4 72H12" />
      <path d="M159 72H229M159 76V68M229 76V68" opacity="0.55" />
      <g transform="rotate(24 193 40)">
        <path d="M188 12H198V55L193 65L188 55Z" fill="var(--color-plaster)" />
        <path d="M188 20H198M193 20V55M188 55H198M191 61H195" />
      </g>
    </svg>
  );
}
