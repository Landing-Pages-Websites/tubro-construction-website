import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { NAV_COMPANY, NAV_FOOTER_EXTRA, NAV_SERVICES } from "@/lib/routes";

const FOOTER_LINK =
  "inline-flex min-h-9 items-center font-poppins text-sm text-ink/70 transition-colors hover:text-ink";
const COLUMN_TITLE = "font-fjalla text-[11px] uppercase tracking-[0.12em] text-action-deep";

/** Shared site footer: reaches every core route and the service-area hub. */
export function SiteFooter(): ReactElement {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-10 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-16">
        <div>
          <Image src={IMAGES.logo.src} alt={IMAGES.logo.alt} className="h-8 w-auto" />
          <p className="mt-4 max-w-xs font-fjalla text-sm leading-relaxed text-ink/75">
            Veteran-owned residential remodeling and general contracting, founded in 2010 and
            serving {BRAND.region}.
          </p>
          <p className="mt-4 max-w-xs font-poppins text-xs leading-relaxed text-ink/60">
            {BRAND.discount}
          </p>
        </div>
        <nav aria-label="Footer services">
          <h2 className={COLUMN_TITLE}>Services</h2>
          <ul className="mt-3 space-y-1">
            {NAV_SERVICES.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={FOOTER_LINK}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer company">
          <h2 className={COLUMN_TITLE}>Company</h2>
          <ul className="mt-3 space-y-1">
            {NAV_COMPANY.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={FOOTER_LINK}>
                  {item.label}
                </Link>
              </li>
            ))}
            {NAV_FOOTER_EXTRA.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={FOOTER_LINK}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className={COLUMN_TITLE}>Office</h2>
          <ul className="mt-3 space-y-2.5 font-poppins text-sm text-ink/75">
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-action" aria-hidden="true" />
              <a href={BRAND.phoneHref} className="font-semibold text-ink hover:text-action-deep">
                {BRAND.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-action" aria-hidden="true" />
              <a href={`mailto:${BRAND.email}`} className="hover:text-ink">
                {BRAND.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="size-4 shrink-0 text-action" aria-hidden="true" />
              {BRAND.hours}
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-action" aria-hidden="true" />
              {BRAND.serviceArea}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <p className="mx-auto max-w-7xl px-5 py-5 font-poppins text-xs text-ink/60 sm:px-8">
          Veteran-owned · Founded in 2010 · © 2026 {BRAND.name}
        </p>
      </div>
    </footer>
  );
}
