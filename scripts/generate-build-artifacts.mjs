import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { DESIGNED_ROUTES } from "./site-routes.mjs";

/**
 * Generates the per-page section_implementation.json documents and the
 * site_build registries from the committed approved contracts plus the
 * composition registry. Deterministic: safe to re-run.
 *
 * Usage: node scripts/generate-build-artifacts.mjs [--flags=key1,key2,...]
 *   --flags sets the named page_set booleans to true (default: all false).
 */
const ROOT = process.cwd();
const CUSTOMER_ROOT =
  process.env.CUSTOMER_ROOT ??
  "/var/lib/megaclaw/workspace/website-lp-build-research-data/b002784f-9543-4362-8814-b7da19078f23";

const FLAG_KEYS = [
  "design_refs_approved",
  "decomposition_complete",
  "review_sheet_published",
  "build_complete",
  "viewport_normalized",
  "primary_laptop_capture",
  "section_edge_clearance_audited",
  "desktop_section_captures",
  "mobile_section_captures",
];

const flagsArg = process.argv.find((arg) => arg.startsWith("--flags="));
const enabledFlags = new Set(flagsArg ? flagsArg.slice("--flags=".length).split(",") : []);

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

/** composition id -> component file, parsed from the registry source. */
function loadRegistryMap() {
  const source = readFileSync(path.join(ROOT, "src/components/sections/registry.ts"), "utf8");
  const imports = new Map();
  for (const match of source.matchAll(/import \{ (\w+) \} from "@\/(components\/sections\/compositions\/\w+)";/g)) {
    imports.set(match[1], `src/${match[2]}.tsx`);
  }
  const map = new Map();
  for (const match of source.matchAll(/"([a-z0-9-]+)": (\w+),/g)) {
    map.set(match[1], { component: match[2], file: imports.get(match[2]) ?? null });
  }
  return map;
}

function slugifySource(source) {
  const base = source.split("/").pop() ?? source;
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function resolveAsset(slug, section, source) {
  const dir = path.join(ROOT, "public/images/design", slug);
  if (!existsSync(dir)) return null;
  const wanted = `${section.id}-${slugifySource(source)}`;
  const file = readdirSync(dir).find((name) => name.startsWith(wanted));
  return file ? `/images/design/${slug}/${file}` : null;
}

function compositionMapEntry(compMap, sectionId) {
  return compMap.frames.find((frame) => frame.frame === sectionId || frame.frame === `${sectionId}.png`);
}

function extractionRegions(extraction, sectionId) {
  const frame = (extraction?.frames ?? []).find(
    (entry) => entry.section_owner === sectionId || entry.frame === `${sectionId}.png`,
  );
  return (frame?.regions ?? []).filter((region) => region.verdict === "extract");
}

function buildSectionImplementation(route, manifest, compMap, extraction, registry) {
  return manifest.ordered_sections.map((section) => {
    const owner = registry.get(section.composition);
    if (!owner?.file) {
      throw new Error(`No registered composition owner for ${section.composition} (${route.slug})`);
    }
    const frameContract = compositionMapEntry(compMap, section.id);
    const regions = extractionRegions(extraction, section.id);
    const assets = section.imagery.sources.map((source, index) => ({
      source,
      label: section.imagery.labels[index] ?? "",
      public_path: resolveAsset(route.slug, section, source),
    }));
    for (const asset of assets) {
      if (!asset.public_path) {
        throw new Error(`Unresolved approved asset ${asset.source} for ${route.slug}/${section.id}`);
      }
    }
    return {
      section_id: section.id,
      section_name: section.name,
      composition: section.composition,
      owner_component: owner.file,
      owner_export: owner.component,
      client_islands:
        section.composition.startsWith("form-")
          ? ["src/components/sections/LeadForm.tsx"]
          : section.source_blueprint_sections.includes("project-filters")
            ? ["src/components/sections/compositions/FilterableFilmstrip.tsx"]
            : [],
      evidence: {
        content:
          "Rendered verbatim from public/design/pages/" +
          `${route.slug}/section_manifest.json ordered_sections[${section.id}].content via loadManifest(); no transcription from image refs.`,
        imagery: {
          rule: section.imagery.rule,
          assets,
          reuse_intent_source: `design_assets/pages/${route.slug}/extraction_plan.json`,
          extract_regions: regions.map((region) => ({
            id: region.id,
            asset_file: region.asset_file,
            narrative_job: region.narrative_job,
            reuse_intent: region.reuse_intent,
          })),
        },
        composition: {
          grammar: section.composition_grammar,
          motif_role: section.motif_role,
          focal_point: section.focal_point,
          owner_statement: `Section-specific composition owner ${owner.component} implements "${section.composition_grammar}"; shared primitives supply mechanics only.`,
        },
        visual_treatment: {
          band: manifest.page_flow.background_progression.find((row) => row.section === section.id)?.band ?? "surface",
          weight: section.weight,
          slot_contract: frameContract?.slot_contract ?? null,
        },
        responsive: frameContract?.assembly?.responsive_contract ??
          "Recompose into an intentional mobile stack retaining the approved focal hierarchy.",
      },
    };
  });
}

function main() {
  const registry = loadRegistryMap();
  const pageSet = [];
  const contracts = [];

  for (const route of DESIGNED_ROUTES) {
    const pageDir = path.join(ROOT, "public/design/pages", route.slug);
    const manifest = readJson(path.join(pageDir, "section_manifest.json"));
    const compMap = readJson(path.join(pageDir, "composition_map.json"));
    const extractionFile = path.join(CUSTOMER_ROOT, "design_assets/pages", route.slug, "extraction_plan.json");
    const extraction = existsSync(extractionFile) ? readJson(extractionFile) : null;

    const sections = buildSectionImplementation(route, manifest, compMap, extraction, registry);
    writeFileSync(
      path.join(pageDir, "section_implementation.json"),
      JSON.stringify({ route: route.path, slug: route.slug, generated_by: "scripts/generate-build-artifacts.mjs", sections }, null, 2),
    );

    pageSet.push({
      route: route.path,
      slug: route.slug,
      title: manifest.page.title,
      intent: manifest.page.intent,
      service_area_archetype: manifest.service_area_archetype,
      sections: manifest.ordered_sections.map((section) => section.id),
      ...Object.fromEntries(FLAG_KEYS.map((key) => [key, enabledFlags.has(key)])),
      qa_verdict: "PENDING",
    });

    for (const section of sections) {
      for (const asset of section.evidence.imagery.assets) {
        const region = section.evidence.imagery.extract_regions.find(
          (entry) => entry.asset_file && asset.public_path.endsWith(entry.asset_file),
        );
        contracts.push({
          route: route.path,
          public_path: asset.public_path,
          section_owner: section.section_id,
          narrative_job: region?.narrative_job ?? `Approved ${asset.label} evidence for ${route.path}`,
          reuse_intent:
            region?.reuse_intent ??
            "Approved page-owned asset; crop and section ownership remain route-specific.",
        });
      }
    }
  }

  mkdirSync(path.join(ROOT, "site_build"), { recursive: true });
  writeFileSync(path.join(ROOT, "site_build/page_set.json"), JSON.stringify({ pages: pageSet }, null, 2));
  writeFileSync(
    path.join(ROOT, "site_build/site_build_contracts.json"),
    JSON.stringify(
      {
        source: "design_assets/pages/<slug>/extraction_plan.json + section_manifest.json",
        precedence:
          "Manifest wins for content. Section refs win for visual language. Page flow wins for transitions. Composition map identifies load-bearing relationships. Extraction plan and NOTES determine image ownership and implementation layers.",
        assets: contracts,
      },
      null,
      2,
    ),
  );
  console.log(`Wrote section_implementation.json for ${pageSet.length} pages, ${contracts.length} asset contracts.`);
}

main();
