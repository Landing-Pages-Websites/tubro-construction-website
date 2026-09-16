import { readFileSync } from "fs";
import path from "path";

export interface ManifestStep {
  number: string;
  title: string;
  copy: string;
}

export interface SectionContent {
  eyebrow: string;
  headline: string;
  body: string;
  bullets: string[];
  steps: ManifestStep[];
  cta: string;
  secondary_cta: string;
  items: string[];
  options: string[];
}

export interface SectionImagery {
  sources: string[];
  labels: string[];
  rule: string;
}

export interface ManifestSection {
  id: string;
  name: string;
  source_blueprint_sections: string[];
  functional_goal: string;
  narrative_job: string;
  composition: string;
  composition_grammar: string;
  motif_role: string;
  focal_point: string;
  eye_path: string;
  weight: "loud" | "quiet";
  background: string;
  frame: string;
  content: SectionContent;
  imagery: SectionImagery;
  source_constraints: string[];
  edge_contracts: { top: string; bottom: string };
}

export type BackgroundBand = "surface" | "white" | "sage";

export interface PageFlow {
  section_weights: Record<string, string>;
  background_progression: Array<{ section: string; band: BackgroundBand }>;
}

export interface PageManifest {
  page: { slug: string; route: string; title: string; intent: string };
  selected_direction: string;
  page_rhythm_family: string;
  service_area_archetype: string | null;
  brand: Record<string, unknown>;
  hard_rules: string[];
  ordered_sections: ManifestSection[];
  page_flow: PageFlow;
}

const manifestCache = new Map<string, PageManifest>();

/**
 * 12 city-hero manifests carry a malformed template interpolation
 * ("…request estimates for Residential remodeling is in scope through…").
 * Repair only that exact defect at render time — the committed manifest
 * artifacts stay byte-identical to the approved customer contracts, and no
 * facts are added or removed. Documented as an upstream content defect.
 */
const SCOPE_DEFECT = /\bfor ([A-Z])(.+?) (?:is|are) (?:in scope|documented) through\b/;
/** Same template also emits "a Auburn/Enumclaw/Issaquah" before vowel-initial cities. */
const ARTICLE_DEFECT = /\ba (Auburn|Enumclaw|Issaquah)\b/g;

function repairScopeDefect(text: string): string {
  return text
    .replace(
      SCOPE_DEFECT,
      (_match, first: string, rest: string) => `for ${first.toLowerCase()}${rest} through`,
    )
    .replace(ARTICLE_DEFECT, "an $1");
}

function repairKnownDefects(manifest: PageManifest): PageManifest {
  for (const section of manifest.ordered_sections) {
    section.content.body = repairScopeDefect(section.content.body);
    section.content.headline = repairScopeDefect(section.content.headline);
  }
  return manifest;
}

/**
 * Loads the approved customer manifest committed at public/design/pages/<slug>/.
 * Manifest text is the authoritative customer-facing content source.
 */
export function loadManifest(slug: string): PageManifest {
  const cached = manifestCache.get(slug);
  if (cached) return cached;
  const file = path.join(process.cwd(), "public/design/pages", slug, "section_manifest.json");
  let manifest: PageManifest;
  try {
    manifest = repairKnownDefects(JSON.parse(readFileSync(file, "utf8")) as PageManifest);
  } catch (error) {
    throw new Error(`Failed to load section manifest for "${slug}": ${String(error)}`);
  }
  manifestCache.set(slug, manifest);
  return manifest;
}

export function bandForSection(manifest: PageManifest, sectionId: string): BackgroundBand {
  const entry = manifest.page_flow.background_progression.find((row) => row.section === sectionId);
  return entry?.band ?? "surface";
}

/** Splits FAQ bullets written as "Question? Answer." into Q/A pairs. */
export function splitQuestion(bullet: string): { question: string; answer: string } {
  const mark = bullet.indexOf("?");
  if (mark === -1) return { question: bullet, answer: "" };
  const answer = bullet.slice(mark + 1).trim();
  return {
    question: bullet.slice(0, mark + 1).trim(),
    answer: answer.charAt(0).toUpperCase() + answer.slice(1),
  };
}
