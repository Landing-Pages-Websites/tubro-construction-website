import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import type { SectionImage } from "@/lib/section-images";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";
import { LeadForm } from "@/components/sections/LeadForm";
import { formKeyForSlug } from "@/lib/form-keys";
import { BathroomEstimate } from "@/components/sections/BathroomEstimate";

/** Desktop material field: the approved photo(s) fill the section as canvas. */
function PhotoCanvas({ images, muted }: { images: SectionImage[]; muted: boolean }): ReactElement | null {
  const [primary, detail] = images;
  if (!primary) return null;
  const tone = muted ? "[&_img]:grayscale [&_img]:opacity-90" : "";
  return (
    <div className={`absolute inset-0 hidden lg:grid ${tone} ${detail ? "lg:grid-cols-[3fr_2fr]" : ""}`}>
      {/* Primary label prints in the intro panel instead of on the photo. */}
      <DesignImage image={primary} frameClassName="h-full" sizes="100vw" withTab={false} />
      {detail && (
        <DesignImage image={detail} frameClassName="h-full" sizes="40vw" tabPosition="bottom-right" />
      )}
    </div>
  );
}

/** Below lg the photo(s) recompose into a top band; the form stacks after. */
function MobilePhotoBand({ images }: { images: SectionImage[] }): ReactElement | null {
  if (images.length === 0) return null;
  const paired = images.length > 1;
  return (
    <div className={`grid lg:hidden ${paired ? "grid-cols-2" : ""}`}>
      {images.map((image, index) => (
        <DesignImage
          key={image.src}
          image={image}
          frameClassName={paired ? "aspect-[4/5] sm:aspect-[4/3]" : "aspect-[16/10]"}
          sizes={paired ? "50vw" : "100vw"}
          tabPosition={index === 0 ? "bottom-left" : "bottom-right"}
        />
      ))}
    </div>
  );
}

/**
 * Composition owner: form-overlay-on-photo-material-field.
 * A generous photo material field carries the section; a plaster intro panel
 * and the white form card overlay it off-center, tied by the offset
 * dimension-bracket motif, per the approved frames.
 */
export function FormOverlayOnPhotoMaterialField({
  section,
  images,
  band,
  links,
  slug,
  path,
  isFirst,
}: SectionProps): ReactElement {
  const headingId = `${section.id}-heading`;
  const submitLabel = section.content.cta || "Schedule a Free Estimate";
  const primaryLabel = images[0]?.label;
  if (slug === "bathroom-remodeling") {
    return <BathroomEstimate section={section} images={images} band={band} links={links} slug={slug} path={path} isFirst={isFirst} ctaTarget="" />;
  }
  return (
    <SectionShell section={section} band={band} bleed labelledBy={headingId}>
      <div className="relative">
        {/* The approved bathroom frame runs this dark canvas desaturated. */}
        <PhotoCanvas images={images} muted={slug === "bathroom-remodeling"} />
        <MobilePhotoBand images={images} />
        {/* Dimension bracket: bottom rule rising only at its right terminus. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 left-[4%] right-[14%] hidden h-14 border-b-2 border-r-2 border-action lg:block"
        />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="relative lg:col-span-4 lg:bg-plaster lg:p-9 lg:shadow-xl lg:shadow-ink/20">
              <span
                aria-hidden="true"
                className="absolute -left-3 -top-3 bottom-1/3 hidden w-6 border-l-2 border-t-2 border-action lg:block"
              />
              <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} size="quiet" />
              {primaryLabel && (
                <span className="mt-7 hidden border border-action bg-white px-2.5 py-1 font-poppins text-xs font-semibold text-action-deep lg:inline-flex">
                  {primaryLabel}
                </span>
              )}
              <ContextLinks links={links} className="mt-6" />
            </div>
            <div className="border border-t-2 border-ink/10 border-t-action bg-white px-6 py-7 shadow-xl shadow-ink/15 sm:px-8 sm:py-8 lg:col-span-5 lg:col-start-8">
              <LeadForm
                formKey={formKeyForSlug(slug)}
                pagePath={path}
                options={section.content.options}
                submitLabel={submitLabel}
                withResume={false}
                idPrefix={section.id}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
