import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import type { DesignRoute } from "./routes";

type HomepageCardProps = {
  route: DesignRoute;
};

export function HomepageCard({ route }: HomepageCardProps): ReactElement {
  return (
    <a
      href={route.image}
      target="_blank"
      rel="noopener"
      className="group grid overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-[box-shadow,border-color] duration-200 hover:border-ink/25 hover:shadow-lg sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
    >
      <span className="relative block aspect-[16/10] bg-mineral sm:aspect-auto sm:min-h-[340px] sm:border-r sm:border-ink/10">
        {/* Source PNG is 9.4 MB — above the image optimizer's source-size cap, so serve it as-is. */}
        <Image
          src={route.image}
          alt={`Full-page design preview of the selected homepage, ${route.title} (${route.path})`}
          fill
          unoptimized
          sizes="(min-width: 640px) 60vw, 100vw"
          className="border-b border-ink/10 object-cover object-top sm:border-b-0"
        />
      </span>
      <span className="flex flex-col p-6 sm:p-8">
        <span className="font-fjalla text-xs tracking-[0.14em] text-action-deep uppercase">
          Selected homepage · Direction A
        </span>
        <span className="mt-4 block font-fjalla text-3xl leading-none text-ink">/</span>
        <span className="mt-3 block text-sm leading-relaxed text-ink/60">{route.title}</span>
        <span className="mt-2 block text-[13px] leading-relaxed text-ink/60">
          The approved “Measured Living” direction that every interior page follows.
        </span>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold text-action transition-colors duration-200 group-hover:text-action-deep">
          Open full design
          <ArrowUpRight className="size-4" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </span>
      </span>
    </a>
  );
}
