// Usage: node tests/metadata-graph-evidence.mjs .next /absolute/report.json [before-report.json]
// Reads build/source artifacts only. Captures webpack registrations without executing factories.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const ROUTE = "/schedule-an-estimate/page";
const SOURCE_ENTRY = "app/schedule-an-estimate/page.tsx";
const OLD_OWNER = "src/components/site/DesignedPage.tsx";
const TARGETS = [
  { source: "src/components/sections/BathroomContactForm.tsx", exportName: "BathroomContactForm",
    markers: ["bathroom-remodeling", "Book Your Free Estimate"], historicalId: 680 },
  { source: "src/components/sections/compositions/FilterableFilmstrip.tsx", exportName: "FilterableFilmstrip",
    markers: ["Filter project photos by service type", "No photos match this filter"], historicalId: 8553 },
];
const read = file => readFileSync(file, "utf8");
const sha = value => createHash("sha256").update(value).digest("hex");
const parse = (file, text) => ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);

function walk(node, visit) {
  visit(node);
  ts.forEachChild(node, child => walk(child, visit));
}

function resolveLocal(file, specifier) {
  const base = specifier.startsWith("@/") ? path.join("src", specifier.slice(2))
    : specifier.startsWith(".") ? path.join(path.dirname(file), specifier) : null;
  if (!base) return null;
  return [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]
    .find(candidate => /\.tsx?$/.test(candidate) && existsSync(candidate)) ?? null;
}

function sourceGraph() {
  const nodes = new Map();
  function collect(file) {
    if (nodes.has(file)) return;
    const text = read(file);
    const imports = parse(file, text).statements
      .filter(node => ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
      .filter(node => node.moduleSpecifier && !node.importClause?.isTypeOnly && !node.isTypeOnly)
      .map(node => resolveLocal(file, node.moduleSpecifier.text)).filter(Boolean);
    nodes.set(file, { sha256: sha(text), imports });
    imports.forEach(collect);
  }
  collect(SOURCE_ENTRY);
  collect("app/layout.tsx");
  return nodes;
}

function chain(graph, roots, target, omittedEdge) {
  const queue = roots.map(root => [root]);
  const seen = new Set();
  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];
    const last = current.at(-1);
    if (last === target) return current;
    if (seen.has(last)) continue;
    seen.add(last);
    for (const next of graph.get(last)?.imports ?? []) {
      if (omittedEdge?.[0] === last && omittedEdge[1] === next) continue;
      queue.push([...current, next]);
    }
  }
  return null;
}

function inspectFactory(factory) {
  const code = factory.toString();
  const tree = parse("factory.js", `(${code})`);
  const fn = tree.statements[0].expression.expression;
  const requireName = fn.parameters[2]?.name.getText(tree);
  const imports = new Set();
  const exports = new Set();
  walk(fn.body, node => {
    if (!ts.isCallExpression(node)) return;
    const callee = node.expression.getText(tree);
    const args = node.arguments;
    if ([requireName, `${requireName}.t`].includes(callee)
      && args[0] && ts.isNumericLiteral(args[0])) imports.add(args[0].text);
    if ([`${requireName}.bind`, `${requireName}.t.bind`].includes(callee)
      && args[1] && ts.isNumericLiteral(args[1])) imports.add(args[1].text);
    if (callee === `${requireName}.d` && args[1] && ts.isObjectLiteralExpression(args[1])) {
      args[1].properties.forEach(property => exports.add(property.name.getText(tree)));
    }
  });
  return { sha256: sha(code), imports: [...imports].sort(), exports: [...exports].sort(), code };
}

function startupRoots(callback) {
  const roots = new Set();
  if (!callback) return [];
  walk(parse("startup.js", `(${callback.toString()})`), node => {
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken
      && ts.isPropertyAccessExpression(node.left) && node.left.name.text === "s"
      && ts.isNumericLiteral(node.right)) roots.add(node.right.text);
  });
  return [...roots];
}

function inventory(build) {
  const chunks = new Map();
  const files = readdirSync(path.join(build, "static/chunks"), { recursive: true })
    .filter(file => file.endsWith(".js")).sort();
  for (const file of files) {
    const relative = `static/chunks/${file}`;
    const text = read(path.join(build, relative));
    if (!text.includes("webpackChunk_N_E") || !text.includes(").push([[")) continue;
    const registrations = [];
    vm.runInNewContext(text, { self: { webpackChunk_N_E: { push: data => registrations.push(data) } } });
    const modules = new Map();
    const roots = [];
    for (const [, factories, startup] of registrations) {
      Object.entries(factories).forEach(([id, factory]) => modules.set(id, factory));
      roots.push(...startupRoots(startup));
    }
    chunks.set(relative, { sha256: sha(text), roots, modules });
  }
  return chunks;
}

function clientReferences(build) {
  const file = `server/app${ROUTE}_client-reference-manifest.js`;
  const text = read(path.join(build, file));
  const context = {};
  vm.runInNewContext(text, context);
  const manifest = context.__RSC_MANIFEST[ROUTE];
  return { file, sha256: sha(text), modules: manifest.clientModules };
}

function targetIdentity(target, references, chunks) {
  const referencesForSource = Object.entries(references.modules)
    .filter(([source]) => source.endsWith(`/${target.source}`));
  assert.equal(referencesForSource.length, 1, `manifest identity: ${target.source}`);
  const [source, reference] = referencesForSource[0];
  const id = String(reference.id);
  const definitions = [];
  for (const [file, chunk] of chunks) {
    if (!chunk.modules.has(id)) continue;
    const factory = inspectFactory(chunk.modules.get(id));
    target.markers.forEach(marker => assert.ok(factory.code.includes(marker), `${target.source}: ${marker}`));
    assert.ok(factory.exports.includes(target.exportName), `compiled export identity: ${target.source}`);
    definitions.push({ file, chunkSha256: chunk.sha256, factorySha256: factory.sha256,
      exports: factory.exports, markers: target.markers });
  }
  assert.ok(definitions.length, `compiled definition: ${target.source}`);
  assert.match(read(target.source), new RegExp(`export function ${target.exportName}\\b`));
  return { ...target, sourceSha256: sha(read(target.source)), manifestSource: source, id, reference, definitions };
}

function buildGraph(chunks, files) {
  const graph = new Map();
  for (const file of files) {
    for (const [id, factory] of chunks.get(file)?.modules ?? []) {
      const inspected = inspectFactory(factory);
      const previous = graph.get(id);
      const definition = { file, chunkSha256: chunks.get(file).sha256, factorySha256: inspected.sha256 };
      graph.set(id, { ...inspected, file, chunkSha256: chunks.get(file).sha256,
        imports: [...new Set([...(previous?.imports ?? []), ...inspected.imports])].sort(),
        definitions: [...(previous?.definitions ?? []), definition] });
    }
  }
  return graph;
}

function entryEvidence(chunks, graph, routeFiles) {
  const files = routeFiles.filter(file => file.startsWith("static/chunks/app/schedule-an-estimate/page-"));
  assert.equal(files.length, 1, "one actual estimate page entry chunk");
  const file = files[0];
  const roots = chunks.get(file).roots;
  assert.equal(roots.length, 1, "one actual estimate bootstrap module");
  return { file, chunkSha256: chunks.get(file).sha256, roots,
    modules: roots.map(id => ({ id, ...graph.get(id) })) };
}

function targetEvidence(target, source, graph, roots, entry, loaded) {
  const sourceChain = chain(source, [SOURCE_ENTRY], target.source);
  return { ...target, sourceChain,
    sourceWithoutMetadataOwner: chain(source, [SOURCE_ENTRY], target.source, [SOURCE_ENTRY, OLD_OWNER]),
    sourceFromLayout: chain(source, ["app/layout.tsx"], target.source),
    bootstrapDirectImport: entry.modules.some(module => module.imports.includes(target.id)),
    pageCompiledChain: chain(graph, entry.roots, target.id),
    pageAndLayoutCompiledChain: chain(graph, roots, target.id),
    presentInLoadedChunks: target.definitions.filter(definition => loaded.includes(definition.file)) };
}

function htmlEvidence(build) {
  const file = "server/app/schedule-an-estimate.html";
  const text = read(path.join(build, file));
  const head = text.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, "generated estimate head");
  const metadataTags = head.match(/<title>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*rel="canonical"[^>]*>/g);
  assert.ok(metadataTags?.length, "generated metadata tags");
  const main = text.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(main, "generated estimate main markup");
  return { file, sha256: sha(text), metadataTags,
    mainSha256: sha(main) };
}

function createReport(build) {
  const manifestFile = "app-build-manifest.json";
  const manifestText = read(path.join(build, manifestFile));
  const pages = JSON.parse(manifestText).pages;
  const routeFiles = pages[ROUTE];
  const loaded = [...new Set([...routeFiles, ...pages["/layout"]])].sort();
  const chunks = inventory(build);
  const references = clientReferences(build);
  const graph = buildGraph(chunks, loaded);
  const roots = loaded.flatMap(file => chunks.get(file)?.roots ?? []);
  const entry = entryEvidence(chunks, graph, routeFiles);
  const source = sourceGraph();
  const targets = TARGETS.map(target => targetIdentity(target, references, chunks))
    .map(target => targetEvidence(target, source, graph, roots, entry, loaded));
  const chunkEvidence = loaded.filter(file => file.endsWith(".js")).map(file => ({ file,
    sha256: sha(readFileSync(path.join(build, file))), roots: chunks.get(file)?.roots ?? [],
    sharedWithRoutes: Object.keys(pages).filter(route => route !== ROUTE && pages[route].includes(file)).sort() }));
  return { method: "TypeScript source graph plus conservative webpack require/bind graph (including lazy calls). Factories are inspected, never executed. Bootstrap then(require.bind) schedules initialization; chunk presence alone is not evaluation.",
    route: ROUTE, buildId: read(path.join(build, "BUILD_ID")).trim(),
    appManifest: { file: manifestFile, sha256: sha(manifestText) },
    clientManifest: { file: references.file, sha256: references.sha256 },
    sourceGraph: Object.fromEntries(source), entry, chunks: chunkEvidence, targets, html: htmlEvidence(build) };
}

function compare(before, after) {
  assert.deepEqual(after.html.metadataTags, before.html.metadataTags, "complete generated metadata tags");
  assert.equal(after.html.mainSha256, before.html.mainSha256, "generated main markup unchanged");
  for (const target of after.targets) {
    const old = before.targets.find(candidate => candidate.source === target.source);
    assert.ok(old?.sourceChain?.includes(OLD_OWNER), `old metadata-owner chain: ${target.source}`);
    assert.equal(old.sourceWithoutMetadataOwner, null);
    assert.equal(old.bootstrapDirectImport, true);
    assert.ok(old.pageCompiledChain);
    assert.equal(target.sourceSha256, old.sourceSha256, "component source preserved");
    assert.equal(target.sourceChain, null, `source removal: ${target.source}`);
    assert.equal(target.sourceFromLayout, null, `layout reachability: ${target.source}`);
    assert.equal(target.bootstrapDirectImport, false);
    assert.equal(target.pageAndLayoutCompiledChain, null, `compiled removal: ${target.source}`);
  }
  return "PASS: metadata-owner edge and page/layout bootstrap reachability removed; complete generated metadata and main markup unchanged. Shared-chunk presence reported separately.";
}

try {
  const [build, output, previous] = process.argv.slice(2);
  assert.ok(build && output, "Usage: node tests/metadata-graph-evidence.mjs BUILD OUTPUT [BEFORE]");
  const report = createReport(path.resolve(build));
  // Save measurements before asserting comparison so a failed prerequisite remains available.
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" });
  if (previous) process.stdout.write(`${compare(JSON.parse(read(previous)), report)}\n`);
  process.stdout.write(`Evidence saved: ${output}\n`);
} catch (error) {
  process.stderr.write(`Metadata graph verification failed: ${error.stack ?? error}\n`);
  process.exitCode = 1;
}
