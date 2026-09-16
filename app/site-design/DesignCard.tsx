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
      className="group flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-[box-shadow,border-color] duration-200 hover:border-ink/25 hover:shadow-lg"
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
      <span className="flex flex-1 items-start justify-between gap-3 px-4 py-4">
        <span className="min-w-0">
          <span className="block font-fjalla text-[15px] leading-snug tracking-[0.02em] break-words text-ink">
            {route.path}
          </span>
          <span className="mt-1.5 block text-[13px] leading-relaxed text-ink/60">
            {route.title}
          </span>
          <span className="sr-only">(opens the full stitched design in a new tab)</span>
        </span>
        <ArrowUpRight
          className="mt-0.5 size-4 shrink-0 text-ink/35 transition-colors duration-200 group-hover:text-action"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}
