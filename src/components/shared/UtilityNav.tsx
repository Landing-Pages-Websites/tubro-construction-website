import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import { IMAGES } from "@/lib/images";

interface UtilityNavProps {
  variant: "a" | "b";
}

const SWITCH_TARGET = {
  a: { href: "/variant-b", label: "View Craft Ledger" },
  b: { href: "/variant-a", label: "View Measured Living" },
} as const;

export function UtilityNav({ variant }: UtilityNavProps): ReactElement {
  const switcher = SWITCH_TARGET[variant];
  const tone = variant === "a" ? "bg-plaster" : "bg-white";
  const label = variant === "a" ? "font-poppins text-[13px]" : "font-fjalla text-xs uppercase tracking-wider";

  return (
    <header className={`${tone} relative z-30 border-b border-ink/10`}>
      <nav
        aria-label="Utility"
        className="mx-auto flex max-w-7xl items-center gap-x-2 px-4 py-2.5 sm:gap-x-4 sm:px-8"
      >
        <Link href="/" className="inline-flex min-h-11 shrink-0 items-center" aria-label="Tubro Construction — direction chooser">
          <Image src={IMAGES.logo.src} alt={IMAGES.logo.alt} className="h-6 w-auto sm:h-7" priority />
        </Link>
        <div className={`flex items-center gap-x-4 ${label} text-ink/70`}>
          <Link href="/" className="inline-flex min-h-11 items-center px-1 hover:text-ink">
            Directions
          </Link>
          <Link href={switcher.href} className="hidden min-h-11 items-center hover:text-ink md:inline-flex">
            {switcher.label}
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-x-2 sm:gap-x-5">
          <a
            href={BRAND.phoneHref}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 ${label} font-medium text-ink hover:text-action-deep`}
            aria-label={`Call ${BRAND.phoneDisplay}`}
          >
            <Phone className="size-4 text-action" aria-hidden="true" />
            <span className="hidden lg:inline">{BRAND.phoneDisplay}</span>
          </a>
          <a
            href="#estimate"
            className={`inline-flex min-h-11 items-center rounded-md bg-action px-3 ${label} font-semibold whitespace-nowrap text-white transition-colors hover:bg-action-deep sm:px-4`}
          >
            Free Estimate
          </a>
        </div>
      </nav>
    </header>
  );
}
