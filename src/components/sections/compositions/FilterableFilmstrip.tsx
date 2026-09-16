"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import type { SectionImage } from "@/lib/section-images";
import { DesignImage } from "@/components/sections/DesignImage";

interface FilterableFilmstripProps {
  images: SectionImage[];
  /** Service category per image, precomputed server-side from the source filename. */
  categories: string[];
}

const ALL_FILTER = "All";

/**
 * Client half of gallery-horizontal-filmstrip-evidence-band (recent-projects
 * only): a real working project-type filter over the evidence filmstrip.
 * Frame numbers stay tied to the original manifest order while filtering.
 */
export function FilterableFilmstrip({ images, categories }: FilterableFilmstripProps): ReactElement {
  const [active, setActive] = useState(ALL_FILTER);
  const options = [ALL_FILTER, ...Array.from(new Set(categories))];
  const visible = images
    .map((image, index) => ({ image, index }))
    .filter(({ index }) => active === ALL_FILTER || categories[index] === active);
  return (
    <div>
      <div
        role="group"
        aria-label="Filter project photos by service type"
        className="flex flex-wrap items-center gap-3"
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={active === option}
            onClick={() => setActive(option)}
            className={`min-h-11 border border-action px-4 font-poppins text-sm font-semibold transition-colors ${
              active === option ? "bg-action text-white" : "bg-white text-action-deep hover:bg-sage"
            }`}
          >
            {option}
          </button>
        ))}
        <p role="status" className="ml-auto font-poppins text-sm font-semibold text-ink/70">
          Showing {visible.length} of {images.length}
        </p>
      </div>
      {visible.length === 0 ? (
        <p className="mt-5 border border-ink/10 bg-white p-6 font-fjalla text-[15px] leading-relaxed text-ink/75">
          No photos match this filter — choose All to see every project photo.
        </p>
      ) : (
        <ol className="mt-5 grid grid-cols-2 gap-4 bg-ink p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-5">
          {visible.map(({ image, index }) => (
            <li key={image.src}>
              <div className="bg-white p-1.5">
                <DesignImage
                  image={image}
                  frameClassName="aspect-[4/5]"
                  sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                />
              </div>
              <p
                aria-hidden="true"
                className="mt-2 font-fjalla text-xs tracking-[0.12em] uppercase text-white/80"
              >
                Frame {String(index + 1).padStart(2, "0")}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
