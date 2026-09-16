import { Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";

interface PhoneCtaProps {
  label?: string;
  tone?: "ink" | "inverse";
  className?: string;
}

/** Secondary call action used beside the primary CTA in the approved frames. */
export function PhoneCta({ label, tone = "ink", className }: PhoneCtaProps): ReactElement {
  const color =
    tone === "inverse" ? "text-white hover:text-white/80" : "text-action-deep hover:text-action";
  return (
    <a
      href={BRAND.phoneHref}
      className={`inline-flex min-h-11 items-center gap-2 font-poppins text-base font-semibold ${color} ${className ?? ""}`}
    >
      <Phone className="size-4.5" aria-hidden="true" />
      {label ?? `Call ${BRAND.phoneDisplay}`}
    </a>
  );
}
