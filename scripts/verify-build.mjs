import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import { CITY_SLUGS, DESIGNED_ROUTES, SITE_ROUTES } from "./site-routes.mjs";

/**
 * Deterministic build verification:
 *  - every approved route has its manifest/refs/composition/asset/
 *    section-implementation/review-sheet artifacts;
 *  - the rendered route set matches sitemap.json exactly (no omissions, no
 *    chooser/variant routes);
 *  - with BASE_URL set, every served route returns 200 with one H1, a title,
 *    global nav/footer, and every manifest section as data-section-id.
 *
 * Usage: node scripts/verify-build.mjs            (static checks)
 *        BASE_URL=http://localhost:3000 node scripts/verify-build.mjs
 */
const ROOT = process.cwd();
const failures = [];

function fail(message) {
  failures.push(message);
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function slugifySource(source) {
  const base = source.split("/").pop() ?? source;
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function checkArtifacts() {
  for (const route of DESIGNED_ROUTES) {
    const pageDir = path.join(ROOT, "public/design/pages", route.slug);
    for (const file of ["section_manifest.json", "composition_map.json", "page.png", "section_implementation.json"]) {
      if (!existsSync(path.join(pageDir, file))) fail(`${route.slug}: missing ${file}`);
    }
    if (!existsSync(path.join(pageDir, "section_manifest.json"))) continue;
    const manifest = readJson(path.join(pageDir, "section_manifest.json"));
    if (manifest.page.route !== route.path) {
      fail(`${route.slug}: manifest route ${manifest.page.route} != sitemap route ${route.path}`);
    }
    const assetDir = path.join(ROOT, "public/images/design", route.slug);
    const assetFiles = existsSync(assetDir) ? readdirSync(assetDir) : [];
    for (const section of manifest.ordered_sections) {
      if (!existsSync(path.join(pageDir, section.frame))) {
        fail(`${route.slug}: missing native ref ${section.frame}`);
      }
      for (const source of section.imagery.sources) {
        const wanted = `${section.id}-${slugifySource(source)}`;
        if (!assetFiles.some((name) => name.startsWith(wanted))) {
          fail(`${route.slug}/${section.id}: approved asset missing for ${source}`);
        }
      }
    }
    const implementation = existsSync(path.join(pageDir, "section_implementation.json"))
      ? readJson(path.join(pageDir, "section_implementation.json"))
      : null;
    if (implementation) {
      const implIds = new Set(implementation.sections.map((section) => section.section_id));
      for (const section of manifest.ordered_sections) {
        if (!implIds.has(section.id)) fail(`${route.slug}: section_implementation missing ${section.id}`);
      }
      for (const section of implementation.sections) {
        if (!section.owner_component || !existsSync(path.join(ROOT, section.owner_component))) {
          fail(`${route.slug}/${section.section_id}: owner component missing (${section.owner_component})`);
        }
      }
    }
  }
}

function checkRouteFiles() {
  const coreDirs = SITE_ROUTES.filter((route) => !route.path.startsWith("/service-area/") && route.path !== "/");
  for (const route of coreDirs) {
    if (!existsSync(path.join(ROOT, "app", route.slug, "page.tsx"))) {
      fail(`missing app route for ${route.path}`);
    }
  }
  if (!existsSync(path.join(ROOT, "app/page.tsx"))) fail("missing homepage app/page.tsx");
  if (!existsSync(path.join(ROOT, "app/service-area/[city]/page.tsx"))) fail("missing dynamic city route");
  if (!existsSync(path.join(ROOT, "app/design-review/[slug]/page.tsx"))) fail("missing design-review sheets");
  for (const banned of ["app/variant-a", "app/variant-b", "app/site-design"]) {
    if (existsSync(path.join(ROOT, banned))) fail(`unwanted chooser route present: ${banned}`);
  }
  const routesSource = readFileSync(path.join(ROOT, "src/lib/routes.ts"), "utf8");
  for (const city of CITY_SLUGS) {
    if (!routesSource.includes(`"${city}"`) && !routesSource.includes(`${city}:`)) {
      fail(`src/lib/routes.ts missing city ${city}`);
    }
  }
  const pageSetFile = path.join(ROOT, "site_build/page_set.json");
  if (!existsSync(pageSetFile)) {
    fail("missing site_build/page_set.json");
  } else {
    const registered = new Set(readJson(pageSetFile).pages.map((page) => page.route));
    for (const route of DESIGNED_ROUTES) {
      if (!registered.has(route.path)) fail(`page_set.json missing ${route.path}`);
    }
    if (registered.size !== DESIGNED_ROUTES.length) fail("page_set.json contains extra routes");
  }
  for (const file of ["site_build/batch_plan.json", "site_build/site_build_contracts.json"]) {
    if (!existsSync(path.join(ROOT, file))) fail(`missing ${file}`);
  }
}

async function checkServedRoute(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route.path}`, { redirect: "manual" });
  if (response.status !== 200) {
    fail(`${route.path}: HTTP ${response.status}`);
    return;
  }
  const html = await response.text();
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) fail(`${route.path}: expected 1 h1, found ${h1Count}`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${route.path}: missing title`);
  if (!html.includes('aria-label="Main"')) fail(`${route.path}: missing global nav`);
  if (!html.includes("<footer")) fail(`${route.path}: missing footer`);
  if (!html.includes("app.gomega.ai/review-bridge/v7/review-bridge.js")) {
    fail(`${route.path}: review bridge missing from initial HTML`);
  }
  if (route.path !== "/") {
    const manifest = readJson(path.join(ROOT, "public/design/pages", route.slug, "section_manifest.json"));
    for (const section of manifest.ordered_sections) {
      if (!html.includes(`data-section-id="${section.id}"`)) {
        fail(`${route.path}: missing data-section-id ${section.id}`);
      }
    }
  }
}

async function checkServed(baseUrl) {
  for (const route of SITE_ROUTES) {
    try {
      await checkServedRoute(baseUrl, route);
    } catch (error) {
      fail(`${route.path}: fetch failed (${error instanceof Error ? error.message : error})`);
    }
  }
  for (const banned of ["/variant-a", "/variant-b", "/site-design"]) {
    try {
      const response = await fetch(`${baseUrl}${banned}`, { redirect: "manual" });
      if (response.status === 200) fail(`chooser route still served: ${banned}`);
    } catch (error) {
      fail(`${banned}: fetch failed (${error instanceof Error ? error.message : error})`);
    }
  }
  try {
    const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
    const sitemapXml = await sitemapResponse.text();
    const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
    const expected = SITE_ROUTES.map((route) => route.path);
    if (JSON.stringify(urls) !== JSON.stringify(expected)) {
      fail(`sitemap.xml route set/order mismatch: got ${urls.length} routes ${JSON.stringify(urls.slice(0, 4))}...`);
    }
    if (sitemapXml.includes("variant") || sitemapXml.includes("site-design") || sitemapXml.includes("design-review")) {
      fail("sitemap.xml contains excluded routes");
    }
  } catch (error) {
    fail(`sitemap.xml: fetch failed (${error instanceof Error ? error.message : error})`);
  }
}

checkArtifacts();
checkRouteFiles();
if (process.env.BASE_URL) {
  await checkServed(process.env.BASE_URL.replace(/\/$/, ""));
}

if (failures.length > 0) {
  console.error(`VERIFY FAILED (${failures.length}):`);
  for (const message of failures) console.error(` - ${message}`);
  process.exit(1);
}
console.log(
  `VERIFY OK: ${DESIGNED_ROUTES.length} designed routes + homepage${process.env.BASE_URL ? " (served checks included)" : " (static checks only)"}`,
);
