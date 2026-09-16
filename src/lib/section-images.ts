import { readdirSync } from "fs";
import path from "path";
import type { ManifestSection } from "@/lib/manifest";

export interface SectionImage {
  /** Public URL under /images/design/<slug>/ — exact approved page-owned asset. */
  src: string;
  alt: string;
  /** Approved caption-tab role label from the manifest. */
  label: string;
  /** Original client source basename, e.g. "0125047_kitchen 01.jpg". */
  source: string;
}

/**
 * Honest descriptions of the 15 authentic client photographs.
 * Keyed by source basename; never describe unverified locations or results.
 */
const SOURCE_ALTS: Record<string, string> = {
  "0125047_kitchen 01.jpg":
    "Remodeled open kitchen with a large dark-countertop island, gray shaker cabinets, and wide-plank flooring",
  "0125065_kitchen 01.jpg":
    "Bright remodeled kitchen with white cabinetry, quartz peninsula, farmhouse sink, and a skylight",
  "0126001_kitchen 01.jpg":
    "Repainted kitchen with slate-blue cabinets, white countertops, stainless appliances, and a small dining table",
  "0325011_kitchen 02.jpg":
    "Kitchen remodel with white shaker cabinets, stainless range hood, and marble-look island",
  "1124003_kitchen 02.jpeg":
    "Kitchen remodel with two-tone navy and white cabinetry, quartz island, and bamboo flooring",
  "0925012_bathroom 01.jpg":
    "Remodeled bathroom with a glass walk-in shower, freestanding tub, double vanity, and skylight",
  "0126030_bathroom 01.jpg":
    "Bathroom remodel with freestanding tub, glass shower with mosaic tile pan, and subway-tile walls",
  "0128008_bathroom 01.jpg":
    "Bathroom remodel in dark marble-look tile with a round mirror, black fixtures, and a skylight",
  "0128008_bathroom 02.jpg":
    "Dark modern bathroom with a black freestanding tub, slatted accent wall, and chevron tile",
  "0525025_bathroom 02.jpg":
    "Remodeled bathroom with a cream vanity, quartz counter, framed mirror, and glass walk-in shower",
  "1221004_deck 01.jpg":
    "Wide deck with black metal railing overlooking a residential valley",
  "0524016_deck 02.jpg":
    "New backyard deck with black aluminum railing beside a gray house",
  "0426023_exterior paint 01.jpg":
    "Two-story home with freshly painted blue siding, white garage doors, and landscaped yard",
  "0825017_ext stain 01.jpeg":
    "Home entry with stained timber beams, stone columns, and wood front door",
  "0425021_exterior stain 01.jpg":
    "Single-story home with freshly stained cedar siding and green-trimmed windows among evergreens",
};

/**
 * A few approved manifests pair a service-category label with a photo of a
 * different subject (e.g. "Deck & Outdoor Living" on a bathroom). Caption
 * tabs identify source roles only, so a contradicting label is corrected to
 * the photo's actual subject — an honest-labeling repair, documented as an
 * upstream manifest defect. Role labels without a category ("Project
 * Evidence", "Material Detail") always pass through unchanged.
 */
const LABEL_CATEGORIES: Array<[RegExp, string]> = [
  [/kitchen/i, "Kitchen"],
  [/bath/i, "Bath"],
  [/deck|outdoor/i, "Deck"],
  [/paint/i, "Paint"],
  [/exterior|stain/i, "Exterior"],
];

const SUBJECT_LABELS: Record<string, string> = {
  Kitchen: "Kitchen Remodeling",
  Bath: "Bathroom Remodeling",
  Deck: "Deck & Outdoor Living",
  Paint: "Exterior Paint",
  Exterior: "Exterior Finish",
};

function labelCategory(label: string): string | null {
  for (const [pattern, category] of LABEL_CATEGORIES) {
    if (pattern.test(label)) return category;
  }
  return null;
}

function honestLabel(label: string, source: string): string {
  const labeled = labelCategory(label);
  const actual = sourceCategory(source);
  if (!labeled || labeled === actual) return label;
  return SUBJECT_LABELS[actual] ?? label;
}

function slugifySource(source: string): string {
  const base = source.split("/").pop() ?? source;
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const dirCache = new Map<string, string[]>();

function listDesignImages(slug: string): string[] {
  const cached = dirCache.get(slug);
  if (cached) return cached;
  const dir = path.join(process.cwd(), "public/images/design", slug);
  let files: string[] = [];
  try {
    files = readdirSync(dir);
  } catch {
    files = [];
  }
  dirCache.set(slug, files);
  return files;
}

/**
 * Resolves a manifest section's imagery sources to the exact approved
 * page-owned assets in public/images/design/<slug>/, in manifest order.
 * Throws when an approved source has no extracted asset — substitution is
 * never allowed.
 */
export function resolveSectionImages(slug: string, section: ManifestSection): SectionImage[] {
  const files = listDesignImages(slug);
  return section.imagery.sources.map((source, index) => {
    const base = source.split("/").pop() ?? source;
    const wanted = `${section.id}-${slugifySource(source)}`;
    const file = files.find((name) => name.startsWith(wanted));
    if (!file) {
      throw new Error(`Missing approved asset for ${slug}/${section.id}: ${source}`);
    }
    const label = honestLabel(section.imagery.labels[index] ?? "", base);
    const description = SOURCE_ALTS[base] ?? "Authentic Tubro Construction project photograph";
    return {
      src: `/images/design/${slug}/${file}`,
      alt: label ? `${label} — ${description}` : description,
      label,
      source: base,
    };
  });
}

/** Service category of an authentic source photo, derived from its client filename. */
export function sourceCategory(source: string): string {
  const base = source.toLowerCase();
  if (base.includes("kitchen")) return "Kitchen";
  if (base.includes("bathroom")) return "Bath";
  if (base.includes("deck")) return "Deck";
  if (base.includes("paint")) return "Paint";
  if (base.includes("stain")) return "Exterior";
  return "Project";
}
