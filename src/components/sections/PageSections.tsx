import type { ReactElement } from "react";
import { bandForSection, loadManifest } from "@/lib/manifest";
import { resolveSectionImages } from "@/lib/section-images";
import { contextualLinks, ctaHref } from "@/lib/section-links";
import { COMPOSITION_REGISTRY } from "@/components/sections/registry";
import { GeneralContractorHero } from "@/components/sections/GeneralContractorHero";
import { KitchenRemodelingHero } from "@/components/sections/KitchenRemodelingHero";

interface PageSectionsProps {
  slug: string;
  path: string;
}

/**
 * Renders a page's approved manifest sections in order, each through its
 * registered composition owner with its exact content, imagery, and band.
 */
export function PageSections({ slug, path }: PageSectionsProps): ReactElement {
  const manifest = loadManifest(slug);
  const formAnchor = manifest.ordered_sections.find((section) =>
    section.composition.startsWith("form-"),
  )?.name;

  return (
    <>
      {manifest.ordered_sections.map((section, index) => {
        const Composition = slug === "general-contractor" && index === 0
          ? GeneralContractorHero
          : slug === "kitchen-remodeling" && index === 0
            ? KitchenRemodelingHero
          : COMPOSITION_REGISTRY[section.composition];
        if (!Composition) {
          throw new Error(`No composition owner registered for "${section.composition}" (${slug})`);
        }
        const destination = section.content.cta ? ctaHref(section.content.cta) : "";
        // Self-referencing and form-submitting CTAs anchor to the page's own form.
        const ctaTarget =
          (destination === path || destination === "#") && formAnchor
            ? `#${formAnchor}`
            : destination;
        return (
          <Composition
            key={section.id}
            section={section}
            images={resolveSectionImages(slug, section)}
            band={bandForSection(manifest, section.id)}
            links={contextualLinks(slug, section, path)}
            slug={slug}
            path={path}
            ctaTarget={ctaTarget}
            isFirst={index === 0}
          />
        );
      })}
    </>
  );
}
