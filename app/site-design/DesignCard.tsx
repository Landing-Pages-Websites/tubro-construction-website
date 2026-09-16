import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import type { DesignRoute } from "./routes";

type DesignCardProps = {
  route: DesignRoute;
  sizes: string;
};

export function DesignCard({ route, sizes }: DesignCardProps): ReactElement {
  return (
    <a
      href={route.image}
      target="_blank"
      rel="noopener"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-[box-shadow,border-color] duration-200 hover:border-ink/25 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
    >
      <span className="relative block aspect-[4/5] overflow-hidden border-b border-ink/10 bg-mineral">
        <Image
          src={route.image}
          alt={`Full-page design preview of ${route.title} (${route.path})`}
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      </span>
      <span className="flex flex-1 flex-col px-4 py-4">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block font-fjalla text-[15px] leading-snug tracking-[0.02em] break-words text-ink">
              {route.path}
            </span>
            <span className="mt-1 block text-[13px] leading-relaxed text-ink/60">
              {route.title}
            </span>
          </span>
          <ArrowUpRight
            className="mt-0.5 size-4 shrink-0 text-ink/35 transition-colors duration-200 group-hover:text-action"
            aria-hidden="true"
          />
        </span>
        <span className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-mineral px-2.5 py-1 font-fjalla text-[11px] tracking-[0.06em] text-ink/75 uppercase">
            {route.rhythm}
          </span>
          <span className="rounded-full bg-mineral px-2.5 py-1 font-fjalla text-[11px] tracking-[0.06em] text-ink/75 uppercase">
            {route.sectionCount} {route.sectionCount === 1 ? "section" : "sections"}
          </span>
        </span>
        <span className="mt-2.5 block text-[13px] leading-relaxed text-ink/60">
          {route.summary}
        </span>
        <span className="sr-only">(opens the full stitched design in a new tab)</span>
      </span>
    </a>
  );
}
