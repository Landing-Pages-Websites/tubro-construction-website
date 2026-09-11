import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Tubro Construction | Homepage Direction Review",
  description:
    "Two approved homepage directions for Tubro Construction — Measured Living and Craft Ledger — built from the same content and photography.",
  alternates: { canonical: "/" },
};

const DIRECTIONS = [
  {
    href: "/variant-a",
    label: "Direction A",
    name: "Measured Living",
    thesis:
      "Bright, tactile, composed editorial architecture. A measured green construction line guides the page from the first estimate to the finished space.",
    display: "font-poppins font-bold tracking-tight",
  },
  {
    href: "/variant-b",
    label: "Direction B",
    name: "Craft Ledger",
    thesis:
      "Documentary, precise, kinetic. Registration marks, datum lines, and folio numbers present the work like a construction ledger.",
    display: "font-fjalla uppercase",
  },
] as const;

export default function ChooserPage(): ReactElement {
  return (
    <main className="flex min-h-screen flex-col bg-plaster">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-5 py-16 sm:px-8">
        <Image src={IMAGES.logo.src} alt={IMAGES.logo.alt} className="h-10 w-auto self-start" priority />
        <h1 className="mt-8 font-poppins text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Homepage direction review
        </h1>
        <p className="mt-3 max-w-xl font-poppins text-sm leading-relaxed text-ink/70">
          Two approved homepage directions for {BRAND.name}, built from the same factual content
          and authentic project photography. Only the presentation differs — choose a direction to
          view it in full.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {DIRECTIONS.map((direction) => (
            <Link
              key={direction.href}
              href={direction.href}
              className="group flex flex-col rounded-lg border border-ink/10 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
            >
              <p className="font-fjalla text-[11px] tracking-[0.14em] text-action uppercase">
                {direction.label}
              </p>
              <h2 className={`mt-2.5 text-[28px] leading-tight text-ink ${direction.display}`}>
                {direction.name}
              </h2>
              <p className="mt-3 flex-1 font-poppins text-[13px] leading-relaxed text-ink/70">
                {direction.thesis}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-poppins text-sm font-semibold text-action-deep">
                View {direction.name}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-ink/10">
        <p className="mx-auto max-w-4xl px-5 py-6 font-poppins text-xs text-ink/60 sm:px-8">
          {BRAND.name} · {BRAND.region} ·{" "}
          <a href={BRAND.phoneHref} className="font-semibold text-ink hover:text-action-deep">
            {BRAND.phoneDisplay}
          </a>
        </p>
      </footer>
    </main>
  );
}
