"use client";

import Image from "next/image";
import Link from "next/link";
import type { KeyboardEvent, MouseEvent, ReactElement } from "react";
import { IMAGES } from "@/lib/images";
import { BRAND } from "@/lib/content";

function closeNavigation(event: MouseEvent<HTMLElement>): void {
  const link = (event.target as HTMLElement).closest("a");
  if (!link) return;
  const menu = event.currentTarget.closest("details");
  menu?.removeAttribute("open");
  const href = link.getAttribute("href");
  const destination = href?.startsWith("#") ? document.getElementById(href.slice(1)) : null;
  if (destination) {
    destination.setAttribute("tabindex", "-1");
    destination.focus({ preventScroll: true });
    return;
  }
  menu?.querySelector("summary")?.focus();
}

function dismissNavigation(event: KeyboardEvent<HTMLDetailsElement>): void {
  if (event.key !== "Escape") return;
  event.currentTarget.removeAttribute("open");
  event.currentTarget.querySelector("summary")?.focus();
}

export function HeaderA(): ReactElement {
  return (
    <header className="a-header">
      <Link href="/" aria-label="Tubro Construction - direction chooser" className="a-logo">
        <Image src={IMAGES.logo.src} alt={IMAGES.logo.alt} priority />
      </Link>
      <nav className="a-desktop-navigation" aria-label="Main navigation" onClick={closeNavigation}>
        <a href="#services">Services</a>
        <a href="#how-it-works">Our process</a>
        <a href="#work">Projects</a>
        <a href="#estimate" className="a-nav-estimate">Free estimate</a>
      </nav>
      <details className="a-navigation" onKeyDown={dismissNavigation}>
        <summary>Menu</summary>
        <nav aria-label="Utility" onClick={closeNavigation}>
          <Link href="/">Directions</Link>
          <Link href="/variant-b">View Craft Ledger</Link>
          <a href="#services">Services</a>
          <a href="#work">Recent projects</a>
          <a href="#estimate">Free Estimate</a>
          <a href={BRAND.phoneHref}>Call {BRAND.phoneDisplay}</a>
        </nav>
      </details>
    </header>
  );
}
