import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import type { ResolvedLink } from "@/lib/section-links";

interface ContextLinksProps {
  links: ResolvedLink[];
  tone?: "ink" | "inverse";
  className?: string;
}

/** Blueprint contextual links rendered as descriptive inline links. */
export function ContextLinks({ links, tone = "ink", className }: ContextLinksProps): ReactElement | null {
  if (links.length === 0) return null;
  const color =
    tone === "inverse"
      ? "text-white/90 hover:text-white"
      : "text-action-deep hover:text-action";
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 ${className ?? ""}`}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={`group inline-flex min-h-11 items-center gap-1.5 font-poppins text-sm font-semibold underline-offset-4 hover:underline ${color}`}
          >
            {link.label}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
