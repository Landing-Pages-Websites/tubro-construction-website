"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import type { KeyboardEvent, MouseEvent, ReactElement } from "react";
import { BRAND } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { NAV_COMPANY, NAV_SERVICES } from "@/lib/routes";

function closeOnLinkClick(event: MouseEvent<HTMLElement>): void {
  if (!(event.target as HTMLElement).closest("a")) return;
  (event.target as HTMLElement).closest("details")?.removeAttribute("open");
}

function closeOnEscape(event: KeyboardEvent<HTMLDetailsElement>): void {
  if (event.key !== "Escape") return;
  event.currentTarget.removeAttribute("open");
  event.currentTarget.querySelector("summary")?.focus();
}

const DESKTOP_LINK =
  "inline-flex min-h-11 items-center px-2.5 font-poppins text-sm font-medium text-ink/80 transition-colors hover:text-ink";

/** Shared site navigation: every core route is reachable on desktop and mobile. */
export function SiteHeader(): ReactElement {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-plaster/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-x-1 px-4 py-2.5 sm:px-8">
        <Link href="/" className="inline-flex min-h-11 shrink-0 items-center pr-3" aria-label="Tubro Construction home">
          <Image src={IMAGES.logo.src} alt={IMAGES.logo.alt} className="h-7 w-auto sm:h-8" priority />
        </Link>

        <nav aria-label="Main" className="hidden items-center lg:flex" onClick={closeOnLinkClick}>
          <details
            className="group relative"
            onKeyDown={closeOnEscape}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") event.currentTarget.open = true;
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "mouse") return;
              if (!event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false;
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
            }}
          >
            <summary className={`${DESKTOP_LINK} cursor-pointer list-none gap-1 [&::-webkit-details-marker]:hidden`}>
              Services
              <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="absolute left-0 top-full z-50 mt-1 w-64 rounded-md border border-ink/10 bg-white py-2 shadow-lg shadow-ink/10 before:absolute before:inset-x-0 before:-top-1.5 before:h-1.5 before:content-['']">
              {NAV_SERVICES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2.5 font-poppins text-sm text-ink/85 hover:bg-sage hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
          {NAV_COMPANY.map((item) => (
            <Link key={item.href} href={item.href} className={DESKTOP_LINK}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-x-1 sm:gap-x-3">
          <a
            href={BRAND.phoneHref}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 font-poppins text-sm font-semibold text-ink hover:text-action-deep"
            aria-label={`Call ${BRAND.phoneDisplay}`}
          >
            <Phone className="size-4 text-action" aria-hidden="true" />
            <span className="hidden xl:inline">{BRAND.phoneDisplay}</span>
          </a>
          <Link
            href="/schedule-an-estimate"
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md bg-action px-3.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-action-deep sm:px-4"
          >
            Free Estimate
          </Link>

          <details className="lg:hidden" onKeyDown={closeOnEscape}>
            <summary
              className="group inline-flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center text-ink [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <Menu className="size-6 group-open:hidden" aria-hidden="true" />
              <X className="hidden size-6 group-open:block" aria-hidden="true" />
            </summary>
            <nav
              aria-label="Mobile"
              onClick={closeOnLinkClick}
              className="absolute inset-x-0 top-full max-h-[calc(100vh-56px)] overflow-y-auto border-b border-ink/10 bg-white px-5 pb-6 pt-3 shadow-lg shadow-ink/10"
            >
              <p className="pt-2 font-fjalla text-[11px] uppercase tracking-[0.12em] text-action-deep">Services</p>
              <ul className="mt-1 border-b border-ink/10 pb-3">
                {NAV_SERVICES.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block py-2.5 font-poppins text-[15px] font-medium text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-2">
                {NAV_COMPANY.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block py-2.5 font-poppins text-[15px] font-medium text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/careers" className="block py-2.5 font-poppins text-[15px] font-medium text-ink">
                    Careers
                  </Link>
                </li>
              </ul>
              <div className="mt-3 flex flex-col gap-3 border-t border-ink/10 pt-4">
                <Link
                  href="/schedule-an-estimate"
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-action px-5 font-poppins text-[15px] font-semibold text-white hover:bg-action-deep"
                >
                  Schedule a Free Estimate
                </Link>
                <a
                  href={BRAND.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center gap-2 font-poppins text-[15px] font-semibold text-action-deep"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  Call {BRAND.phoneDisplay}
                </a>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
