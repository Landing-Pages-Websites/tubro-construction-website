# PR18 metadata extraction evidence

Baseline: `889c31bcbf00e72ba3aa47338fca8939135c5ec9` on
`fix/golive-estimate-startup`. Sanctioned run:
`e08de286-c516-4aac-8595-1f503a8c2730`.

Only the three authorized production files changed. The metadata function,
signature, imports and comment moved verbatim. `DesignedPage` retains its exact
component implementation and component imports; its `routeForSlug` import remains
necessary. The estimate page changes only its metadata import. Every other
previously tracked file, including motion source/tests/reports, matches its
recorded baseline SHA256. The three protected untracked files also match.

## Verification

- Baseline `npm test`: 69/69; baseline `npm run build`: exit 0.
- Focused test initially failed because the leaf did not yet exist.
- `node --test tests/designed-page-metadata.test.mjs`: 12/12.
- Final `npm test`: 81/81; `npm run typecheck` and `npm run build`: exit 0.
- Complete old-head metadata fixtures match through the leaf and public re-export
  for six slugs, plus the actual privacy/careers consumer exports and estimate
  override. Canonical, all social fields/images/URLs, and absent robots overrides
  are preserved. The two APIs expose the same function object.
- Static transitive dependency allowlist proves the leaf imports only data/code
  under `src/lib`, plus Node's `fs` and `path`; no component or client/provider.
- Generated estimate metadata tags and `<main>` bytes match the baseline exactly.
- `git diff --check` and simplify-equivalent self-review pass: no unused imports,
  dead code, `any`, debug statements, new async operations, functions over 30 lines,
  or files of 500 lines. No package, configuration, or existing test edits.

## Compiled identity and graph

`metadata-graph-evidence.mjs` binds the actual route via `app-build-manifest.json`,
its client-reference manifest, startup callback, and compiled factory AST. Target
identities require source paths, named compiled exports, matching content markers,
source/factory SHA256, and containing chunk SHA256. Numeric IDs alone are not used.

Before: estimate entry `page-004ce45f091e898a.js`, SHA256
`78e9900bae71c581f46a8ec069458557134eba23a574079fa057c68ed65cdfbd`,
bootstrap module `1520`, explicitly schedules both `680` (`BathroomContactForm`)
and `8553` (`FilterableFilmstrip`). Both source chains pass through
`DesignedPage → PageSections → registry`; removing only that metadata-owner edge
eliminates both source chains.

After: estimate entry `page-815a00db92439039.js`, SHA256
`728c162a0fecd9e2d87ac2b2c199582429ff515a73149fa46126b1775059f9c3`,
bootstrap module `9737`, has neither import. Neither target is reachable from the
page/layout bootstrap graph or present in their loaded chunks. Their shared chunk
`9296-1eb96e3e6a488ee3.js`, SHA256
`5b5c6bd6d0a32b08268826a5eaeeb715072f360f580e2c284062ed1649b3f3d8`,
still exists for other routes but is absent from estimate startup. Other legitimate
shared chunks remain and are listed separately in the reports. Chunk registration
is distinguished from factory initialization; the script never executes factories.

## Raw artifacts and reproduction

Preserved outside the repository (including original pre-existing build output):
`/var/lib/megaclaw/workspace/tubro-evidence/metadata-extraction/run-e08de286-c516-4aac-8595-1f503a8c2730/`.
This contains `before-state.json`, baseline/final build trees and logs, metadata
fixtures, and `before-graph.json` / `after-graph.json`. Reports are created with
exclusive writes; failed diagnostic attempts are retained separately.

After building, reproduce with:

```sh
node tests/metadata-graph-evidence.mjs .next /absolute/new-report.json /absolute/before-graph.json
```

No UI source or controls changed, so no local browser/form/provider writes or
Lighthouse runs were performed. This is local compiled/source evidence, not a
deployed artifact or measured performance result. The valid failed mobile TBT pair
1333.5795/1374.5675 (median 1354.0735) remains blocking. Push, exact-head bot review,
deployment and the four-run pilot remain with the controller.
