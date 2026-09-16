import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import { ctaHref } from "@/lib/section-links";

interface CtaLinkProps {
  label: string;
  href?: string;
  className?: string;
}

/** Primary green action per the approved frames — the single confident accent. */
export function CtaLink({ label, href, className }: CtaLinkProps): ReactElement {
  const destination = href ?? ctaHref(label);
  return (
    <Link
      href={destination}
      className={`group inline-flex min-h-12 items-center gap-2.5 rounded-md bg-action px-6 py-3 font-poppins text-[15px] font-semibold text-white shadow-md shadow-action/25 transition-colors hover:bg-action-deep ${className ?? ""}`}
    >
      {label}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}
