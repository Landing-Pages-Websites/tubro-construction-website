import Image from "next/image";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import { IMAGES } from "@/lib/images";

export function SiteFooter(): ReactElement {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Image src={IMAGES.logo.src} alt={IMAGES.logo.alt} className="h-6 w-auto" />
          <p className="font-poppins text-xs text-ink/60">
            Veteran-owned · Founded in 2010 · {BRAND.region}
          </p>
        </div>
        <p className="font-poppins text-xs text-ink/60">
          <a href={BRAND.phoneHref} className="font-semibold text-ink hover:text-action-deep">
            {BRAND.phoneDisplay}
          </a>{" "}
          · {BRAND.hours} · © 2026 {BRAND.name}
        </p>
      </div>
    </footer>
  );
}
