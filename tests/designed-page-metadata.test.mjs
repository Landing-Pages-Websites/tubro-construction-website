import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";
import ts from "typescript";

const fixture = JSON.parse(readFileSync("tests/fixtures/designed-page-metadata.json", "utf8"));
const componentMocks = Object.fromEntries([
  "@/components/sections/PageSections", "@/components/site/SiteHeader",
  "@/components/shared/SiteFooter", "@/components/shared/SiteMotion",
].map(name => [name, {}]));
const globals = { process, moduleMocks: componentMocks };
const cache = new Map();
const leaf = loadModule("src/lib/designed-page-metadata.ts", globals, cache);
const publicApi = loadModule("src/components/site/DesignedPage.tsx", globals, cache);
const normalize = value => structuredClone(value);

for (const [slug, expected] of Object.entries(fixture.helpers)) {
  test(`complete metadata equals old-head fixture through both APIs: ${slug}`, () => {
    assert.deepEqual(normalize(leaf.designedPageMetadata(slug)), expected);
    assert.deepEqual(normalize(publicApi.designedPageMetadata(slug)), expected);
    assert.equal(Object.hasOwn(expected, "robots"), false, "old helper has no robots override");
    assert.ok(expected.openGraph.images.length && expected.twitter.images.length);
  });
}

test("DesignedPage re-exports the same function object", () => {
  assert.equal(publicApi.designedPageMetadata, leaf.designedPageMetadata);
});

for (const slug of ["privacy", "careers"]) {
  test(`existing DesignedPage consumer retains complete metadata: ${slug}`, () => {
    const moduleMocks = { "@/components/site/DesignedPage": publicApi };
    const page = loadModule(`app/${slug}/page.tsx`, { process, moduleMocks });
    assert.deepEqual(normalize(page.metadata), fixture.consumers[slug]);
  });
}

test("estimate page retains the complete override object, including original social descriptions", () => {
  const names = ["./EstimateHero", "./EstimateNextSteps", "./EstimateWork", "./EstimateQuestions",
    "./EstimateContact", "./EstimateMotion", "./estimate.module.css"];
  const moduleMocks = { ...componentMocks, ...Object.fromEntries(names.map(name => [name, {}])) };
  const page = loadModule("app/schedule-an-estimate/page.tsx", { process, moduleMocks });
  assert.deepEqual(normalize(page.metadata), fixture.estimate);
  assert.notEqual(page.metadata.description, page.metadata.openGraph.description);
  assert.equal(page.metadata.openGraph.description, page.metadata.twitter.description);
});

function imports(file) {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  return source.statements.filter(node => ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
    .filter(node => node.moduleSpecifier && !node.importClause?.isTypeOnly && !node.isTypeOnly)
    .map(node => node.moduleSpecifier.text);
}

test("metadata leaf has only data dependencies, including transitive imports", () => {
  assert.deepEqual(imports("src/lib/designed-page-metadata.ts"), ["@/lib/seo", "@/lib/manifest", "@/lib/routes"]);
  const allowed = new Map([
    ["src/lib/designed-page-metadata.ts", ["@/lib/seo", "@/lib/manifest", "@/lib/routes"]],
    ["src/lib/seo.ts", ["./content"]], ["src/lib/content.ts", []],
    ["src/lib/manifest.ts", ["fs", "path"]], ["src/lib/routes.ts", []],
  ]);
  for (const [file, dependencies] of allowed) {
    assert.deepEqual(imports(file), dependencies, file);
    assert.doesNotMatch(readFileSync(file, "utf8"), /["']use client["']|\bimport\s*\(|\brequire\s*\(/);
  }
});

test("estimate imports the leaf while public consumers keep the DesignedPage API", () => {
  const estimateImports = imports("app/schedule-an-estimate/page.tsx");
  assert.ok(estimateImports.includes("@/lib/designed-page-metadata"));
  assert.ok(!estimateImports.includes("@/components/site/DesignedPage"));
  assert.match(readFileSync("src/components/site/DesignedPage.tsx", "utf8"),
    /export \{ designedPageMetadata \} from "@\/lib\/designed-page-metadata";/);
  for (const slug of ["privacy", "careers"]) {
    assert.ok(imports(`app/${slug}/page.tsx`).includes("@/components/site/DesignedPage"));
  }
});
