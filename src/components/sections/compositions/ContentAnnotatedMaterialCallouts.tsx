import type { ReactElement } from "react";
import type { SectionProps } from "@/components/sections/types";
import { SectionShell } from "@/components/sections/SectionShell";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { LedgerList } from "@/components/sections/LedgerList";
import { CtaLink } from "@/components/sections/CtaLink";
import { PhoneCta } from "@/components/sections/PhoneCta";
import { ContextLinks } from "@/components/sections/ContextLinks";
import { DesignImage } from "@/components/sections/DesignImage";
import { CropCorners } from "@/components/sections/CropCorners";
import { BathroomPlanning } from "@/components/sections/compositions/BathroomPlanning";

/**
 * Composition owner: content-annotated-material-callouts.
 * The photo is annotated: each callout label carries a green measurement dot
 * whose hairline leader reaches back across the column gap to the photo edge.
 * items are the callout labels (bullets when items are empty); bullets then
 * print as the supporting ledger. Robust to 0–1 images.
 */
export function ContentAnnotatedMaterialCallouts({
  section,
  images,
  band,
  links,
  ctaTarget,
  isFirst,
  ...page
}: SectionProps): ReactElement {
  if (page.slug === "bathroom-remodeling" && section.name === "showers-planning-finishes") {
    return <BathroomPlanning {...page} section={section} images={images} band={band} links={links} ctaTarget={ctaTarget} isFirst={isFirst} />;
  }
  const headingId = `${section.id}-heading`;
  const { items, bullets } = section.content;
  const callouts = items.length > 0 ? items : bullets;
  const supporting = items.length > 0 ? bullets : [];
  const [photo] = images;
  return (
    <SectionShell section={section} band={band} labelledBy={headingId}>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <CropCorners corners={["br"]} />
        <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[10fr_9fr]">
          {photo && (
            <div className="relative hidden lg:block">
              <CropCorners corners={["tl", "bl"]} className="-m-2" />
              <DesignImage
                image={photo}
                frameClassName="h-full min-h-[480px]"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </div>
          )}
          <div>
            <SectionIntro section={section} headingId={headingId} as={isFirst ? "h1" : "h2"} />
            {photo && (
              <div className="mt-8 lg:hidden">
                <DesignImage image={photo} frameClassName="aspect-[4/3]" sizes="100vw" />
              </div>
            )}
            <ol className="mt-9 space-y-6">
              {callouts.map((label) => (
                <li key={label} className="relative pl-7">
                  <span aria-hidden="true" className="absolute top-1.5 left-0 size-3 rounded-full bg-action" />
                  {/* Leader hairline: spans the exact grid gap back to the photo edge. */}
                  <span aria-hidden="true" className="absolute top-[11px] right-full hidden h-0.5 w-14 bg-action lg:block" />
                  <p className="font-fjalla text-base leading-relaxed text-ink/85">{label}</p>
                </li>
              ))}
            </ol>
            {supporting.length > 0 && <LedgerList items={supporting} className="mt-9" />}
            {(section.content.cta || section.content.secondary_cta) && (
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                {section.content.cta && <CtaLink label={section.content.cta} href={ctaTarget} />}
                {section.content.secondary_cta && <PhoneCta label={section.content.secondary_cta} />}
              </div>
            )}
            <ContextLinks links={links} className="mt-7" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
