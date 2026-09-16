import type { ComponentType } from "react";
import type { SectionProps } from "@/components/sections/types";
import { HeroArchitecturalSteppedSplit } from "@/components/sections/compositions/HeroArchitecturalSteppedSplit";
import { HeroTypographicManifestoProofRail } from "@/components/sections/compositions/HeroTypographicManifestoProofRail";
import { HeroHeadlineOverPhotoQuietZone } from "@/components/sections/compositions/HeroHeadlineOverPhotoQuietZone";
import { HeroDiagonalCroppedServiceArea } from "@/components/sections/compositions/HeroDiagonalCroppedServiceArea";
import { HeroImageLedCollageMarginalCopy } from "@/components/sections/compositions/HeroImageLedCollageMarginalCopy";
import { HeroContactLedger } from "@/components/sections/compositions/HeroContactLedger";
import { HeroPublicationIndex } from "@/components/sections/compositions/HeroPublicationIndex";
import { HeroCinematicImageFieldInsetSlab } from "@/components/sections/compositions/HeroCinematicImageFieldInsetSlab";
import { HeroCenteredEstimateBrief } from "@/components/sections/compositions/HeroCenteredEstimateBrief";
import { GalleryRoomScaleSingleFocalDetailStrip } from "@/components/sections/compositions/GalleryRoomScaleSingleFocalDetailStrip";
import { GalleryHorizontalFilmstripEvidenceBand } from "@/components/sections/compositions/GalleryHorizontalFilmstripEvidenceBand";
import { GalleryAsymmetricMasonryProjectLedger } from "@/components/sections/compositions/GalleryAsymmetricMasonryProjectLedger";
import { ContentEditorialIndexToc } from "@/components/sections/compositions/ContentEditorialIndexToc";
import { ContentImageAsCanvasEditorialQuietArea } from "@/components/sections/compositions/ContentImageAsCanvasEditorialQuietArea";
import { ContentAnnotatedMaterialCallouts } from "@/components/sections/compositions/ContentAnnotatedMaterialCallouts";
import { ContentSurfaceColorFieldPhotoProof } from "@/components/sections/compositions/ContentSurfaceColorFieldPhotoProof";
import { DirectoryMapList } from "@/components/sections/compositions/DirectoryMapList";
import { ProcessVerticalMilestoneSpine } from "@/components/sections/compositions/ProcessVerticalMilestoneSpine";
import { ProcessCompactNumberedStrip } from "@/components/sections/compositions/ProcessCompactNumberedStrip";
import { ProcessStaggeredPath } from "@/components/sections/compositions/ProcessStaggeredPath";
import { FaqOversizedQuestionIndexLedger } from "@/components/sections/compositions/FaqOversizedQuestionIndexLedger";
import { CtaCenteredEstimateBriefPeripheralProof } from "@/components/sections/compositions/CtaCenteredEstimateBriefPeripheralProof";
import { FormSplitWithNarrowContactLedger } from "@/components/sections/compositions/FormSplitWithNarrowContactLedger";
import { FormOverlayOnPhotoMaterialField } from "@/components/sections/compositions/FormOverlayOnPhotoMaterialField";
import { TeamRosterEditorialNoPortraits } from "@/components/sections/compositions/TeamRosterEditorialNoPortraits";
import { PolicyEditorialDocument } from "@/components/sections/compositions/PolicyEditorialDocument";

/**
 * Every approved composition has exactly one section-specific owner here.
 * There is intentionally no generic fallback: an unregistered composition is
 * a build error, never a stand-in hero/card/FAQ.
 */
export const COMPOSITION_REGISTRY: Record<string, ComponentType<SectionProps>> = {
  "hero-architectural-stepped-split": HeroArchitecturalSteppedSplit,
  "hero-typographic-manifesto-proof-rail": HeroTypographicManifestoProofRail,
  "hero-headline-over-photo-quiet-zone": HeroHeadlineOverPhotoQuietZone,
  "hero-diagonal-cropped-service-area": HeroDiagonalCroppedServiceArea,
  "hero-image-led-collage-marginal-copy": HeroImageLedCollageMarginalCopy,
  "hero-contact-ledger": HeroContactLedger,
  "hero-publication-index": HeroPublicationIndex,
  "hero-cinematic-image-field-inset-slab": HeroCinematicImageFieldInsetSlab,
  "hero-centered-estimate-brief": HeroCenteredEstimateBrief,
  "gallery-room-scale-single-focal-detail-strip": GalleryRoomScaleSingleFocalDetailStrip,
  "gallery-horizontal-filmstrip-evidence-band": GalleryHorizontalFilmstripEvidenceBand,
  "gallery-asymmetric-masonry-project-ledger": GalleryAsymmetricMasonryProjectLedger,
  "content-editorial-index-toc": ContentEditorialIndexToc,
  "content-image-as-canvas-editorial-quiet-area": ContentImageAsCanvasEditorialQuietArea,
  "content-annotated-material-callouts": ContentAnnotatedMaterialCallouts,
  "content-surface-color-field-photo-proof": ContentSurfaceColorFieldPhotoProof,
  "directory-map-list-composition": DirectoryMapList,
  "process-vertical-milestone-spine": ProcessVerticalMilestoneSpine,
  "process-compact-numbered-strip": ProcessCompactNumberedStrip,
  "process-staggered-path": ProcessStaggeredPath,
  "faq-oversized-question-index-ledger": FaqOversizedQuestionIndexLedger,
  "cta-centered-estimate-brief-peripheral-proof": CtaCenteredEstimateBriefPeripheralProof,
  "form-split-with-narrow-contact-ledger": FormSplitWithNarrowContactLedger,
  "form-overlay-on-photo-material-field": FormOverlayOnPhotoMaterialField,
  "team-roster-editorial-no-portraits": TeamRosterEditorialNoPortraits,
  "policy-editorial-document": PolicyEditorialDocument,
};
