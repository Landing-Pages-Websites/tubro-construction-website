# Tubro combined go-live remediation

This is a commit-only staging candidate from `153879ade7a68702dc065a35a5a9764a2cf85be4` on `fix/tubro-golive-r2`. No push, PR, merge, deployment, DNS change, provider configuration access, or task update was performed. Independent review, immutable Preview verification, deployed performance, analytics receipt and lead delivery remain with the controller.

## Bounded changes

| Residual | Owning source and repair |
| --- | --- |
| Painting palette semantics | `PaintingHero.tsx`: the existing grouped palette and unchanged accessible name now have `role="img"`. |
| Small text | `general-contractor-estimate.module.css`: service-area text and form labels increase from 13 to 14 px. `painting-quote.module.css`: caption, hours and email increase from 12 to 14 px. Existing hierarchy, copy and responsive rules remain. |
| Contact and article targets | General office links and painting phone/email use real minimum 44 px anchor boxes. Article prose anchors are inline blocks with minimum 44 × 44 px, bounded wrapping and vertical padding in normal flow; adjacent hit areas cannot overlap. Focus/hover styles remain visible. De-anchored long URL text also wraps in list items. No prose-link exception, invisible overlay, negative margin or checker alteration was used. |
| Legacy company phone | Exactly three `253-352-4578` occurrences in `Bathroom-Remodels-Kent-WA.md` become `253-216-2633`: description, `tel:` href and visible number. Every other byte and the stable identity/path remain unchanged. |
| Broken backlink destinations | Exactly the seven supplied links in `backlinks.md` become their original visible plain text. All 47 other links, entry order, visible text and identity remain unchanged. `/backlinks` still returns 200. |
| General-contractor startup | `GeneralContractorMotion.tsx` defers animation creation and SVG path measurement to first intersection. Observer-provided rectangles replace synchronous geometry reads. The route-owned hero uses the same Next Image, original photograph, default quality, crop, sizing geometry and preload, with an explicit high fetch priority and accurate responsive `sizes`. Shared image/loading components are untouched. |

The design remains the approved residential service-page composition: Poppins/drafting/foundation imagery for general contracting, Fjalla/project photography/palette and office quote path for painting, and authentic long-form article content. Visible changes are limited to text legibility, normal-flow link spacing and safe wrapping. There is no new design direction or asset transformation.

## Diagnosis and motion preservation

Before editing performance source, the local production baseline probe observed **28 startup animations**, **26 still paused after settling**, **32 route-owned synchronous geometry reads** (9.5 ms in this unthrottled instrumented sample) and **five SVG path-length reads**. The raw probe also includes its own image-rectangle reads; these are excluded from the route-owned count by stack attribution.

The baseline mobile Lighthouse sample identified the foundation photograph as LCP, reported a missing high-priority preload hint and served its 750 px variant. That diagnostic sample was valid at 4083.17055 ms LCP, 309.44315 ms TBT and zero CLS. It is not a replacement for the supplied deployed 6002.148875 ms median. The local receipts contain no GA/PostHog requests, so these LHRs do not establish performance with their provisioned deployed runtime cost; provider source is unchanged and deployed certification is still required.

Animation descriptors keep the exact selectors, frame values, 650/900/1100/1000 ms durations, easing and 75/65 ms stagger with the original caps and 80 ms ruler delay. Above-the-fold decoration still animates. Already-painted text stays still. Belowfold text, images, rulers and process paths animate once when reached. Completed or focused targets are forgotten; preference changes cancel running motion without replaying seen content. Reduced motion and missing browser animation/observer support leave complete server-rendered content usable. Cleanup disconnects the observer, cancels animations, removes listeners and ignores stale deliveries. There is no hidden SSR content, idle replay or analytics deferral.

The final instrumented startup probe creates only **two above-the-fold decorative animations**, with **zero pending/paused animations, zero route-owned synchronous rectangle reads and zero path-length reads** after settling. `startup-summary.json` attributes each native call by the general-contractor chunk's stack. The hero retains its 350 px slot at a 390 px viewport, now requests the appropriate 384 px image at DPR 1 instead of 640 px, and exposes `fetchPriority="high"`. These instrumented timings diagnose removed work; they are not a causal claim about the entire Lighthouse change.

## Final browser results

All **25 route/viewport and motion checks pass**, with **zero page errors**. All **nine full axe scans report zero violations**, including zero serious/critical results. Overflow checks pass at 320/390/834/1440 on all six checked routes. The repaired text computes to at least 14 px. Every measured actionable anchor and associated radio/checkbox label meets 44 × 44 px; there are no overlapping anchor boxes. Desktop contact examples are general phone **95.38 × 44**, general email **252.41 × 44**, painting phone **151.59 × 44**, and painting email **277.41 × 44** CSS pixels. Article multi-line links grow in normal flow; a 390 px example measures **350 × 74.78**. The article table stays within the page width.

The browser keyboard check reaches the actual repaired article body link with a visible focus indicator, and activates the general project radio with Space. Normal scrolling starts the original process animations. Reduced motion has no animations; changing the preference cancels running motion within the browser test's 250 ms event-delivery bound, before those 650–1100 ms animations could finish naturally. Seen content does not replay when motion is enabled again.

## Local Lighthouse results

Lighthouse 13.5.0 ran exactly two final samples per profile, serially in this order: mobile 1, mobile 2, desktop 1, desktop 2. No build, test suite or other task browser ran during these samples. Full raw LHRs, traces, DevTools logs, per-run receipts and SHA-256 hashes are retained; `performance-summary.json` records the exact build ID, settings, URL and medians. No valid candidate samples were discarded or replaced.

| Profile / sample | Benchmark | CPU | LCP ms | TBT ms | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| mobile 1 | 2027.5 | 4 | 4070.6528 | 119.5000 | 0 |
| mobile 2 | 1981 | 4 | 3695.8836 | 130.5388 | 0 |
| desktop 1 | 2001.5 | 1 | 803.6739 | 7.0000 | 0 |
| desktop 2 | 1908.5 | 1 | 768.0175 | 4.5000 | 0 |

The **mobile LCP median is 3883.2682 ms**, a **2116.7318 ms margin** below 6000 ms. Mobile TBT median is 125.0194 ms. Desktop medians are **785.8457 ms LCP** and **5.75 ms TBT**, meeting 2500/200 ms; every sample has **0 CLS**. Both individual samples also meet the relevant LCP/TBT limits.

Every raw LHR has `runWarnings: []`, no `runtimeError` property, benchmark >1000, `throttlingMethod: "simulate"`, CPU 4 for mobile / CPU 1 for desktop, and requested/final displayed URL exactly **`http://localhost:3193/general-contractor`**. Mobile emulation is 412 × 823 CSS px at DPR 1.75; desktop is 1350 × 940 at DPR 1. The LCP discovery audit confirms the image is discoverable in initial HTML, eagerly loaded and high priority.

All local numeric targets pass. These are supporting local results, **not certified deployed results** or proof of a comparable production before/after gain. The supplied deployed median remains the canonical failed baseline until the controller measures the new immutable Git-linked staging artifact with provisioned analytics. No performance work or LHR sampling was applied to the other 12 advisory pages.

## Regression coverage and preservation

- New `tests/round2-content.test.mjs` checks the palette representation and scoped typography, reverses only the three phone substitutions and seven de-anchorings to prove the original whole-file hashes, and locks the inventory and every other Markdown article to their baseline bytes.
- New `tests/general-motion.test.mjs` executes the actual TypeScript boundary with observer/animation mocks. It covers zero eager geometry/path/animation work, authored motion timing and frames, once-only entry, initially visible text, zero-size/already-passed eligibility, reduced-motion toggling, focus, disposal and the no-observer fallback.
- New `tests/round2-browser.mjs` measures actual anchor and associated label rectangles, target overlap, computed font size, keyboard focus, radio activation, normal/reduced-motion behavior, page errors and document overflow. It does not import or use the existing prose exclusion. The primary matrix covers general, painting and `/blog/kitchen-remodel-cost-washington-state` at 320/390/834/1440. Additional wrapping checks cover `/backlinks`, `/Bathroom-Remodels-Kent-WA` and the Pierce County kitchen-cost article at all four widths. Full axe scans and nine AFTER screenshots cover the three primary pages at 390/834/1440, 900 px viewport height and DPR 1.
- The existing tests and checker scripts remain unchanged. The new content tests initially failed four expected residual assertions; the motion tests initially failed four eager/preference/focus assertions. Their red outputs are retained outside Git.
- All **102 unique sitemap routes** returned direct 200 responses with no redirects. Existing identity tests retain **54 migrated + 13 authored articles**. Inventory provenance is unchanged. A separate baseline comparison proves 46 analytics, library and API source files unchanged, including the complete lead/CAPTCHA/upload/notification boundaries.
- No lead was sent. Local browser lead requests are aborted. Existing unit tests exercise the real handlers with isolated/intercepted external dependencies. No external backlinks were replaced with invented destinations.

## Local commands and evidence

Evidence is outside Git at `/var/lib/megaclaw/workspace/tubro-evidence/r2/`.

| Check | Result / artifact |
| --- | --- |
| `npm ci` | Exit 0; lockfile unchanged. |
| `npm test` | Exit 0, 93 passing tests; `npm-test.log`. |
| `npm run typecheck` | Exit 0; `typecheck.log`. |
| `npm run build` | Exit 0; 197 generated Next pages/boundaries; `build.log`. This is distinct from the 102 public sitemap routes. |
| `git diff --check` | Exit 0. |
| Browser and axe | Exit 0, 25 checks and nine clean axe scans; `browser-results.json`, `browser.log`, `axe-{general,painting,article}-{390,834,1440}.json`. |
| Visual evidence | `after-{general,painting,article}-{390,834,1440}.png`; focused review crops also retained. |
| Route and integration preservation | `routes.json`, `integration-source-preservation.json`. |
| Performance reproduction | `lab.py`, full LHRs, per-run receipts, traces and DevTools logs. |

Build/server commands use `VERCEL_ENV=development NEXT_PUBLIC_RECAPTCHA_SITE_KEY=recaptcha-staging-bypass-key`; server command is `npm run start -- --port 3193`. No environment files or tracked environment values changed. Browser execution uses the supplied Chromium, Playwright and axe with `LD_LIBRARY_PATH=/var/lib/megaclaw/user-tools/apt/usr/lib/x86_64-linux-gnu`. No browser or system dependencies were installed. There is no lint script and no standalone lint pass is claimed.

The screenshot harness uses immediate test-only scrolling and waits for every image to load before capture. An early smooth-scroll capture missed lazy photographs; a later local image-optimizer request stalled and was resolved by restarting only this task's server. Those diagnostics remain in the evidence directory. The expanded wrapping regression then found the de-anchored plain URL overflow at 320 px; the source list-wrapping repair resolves that case while retaining the exact visible text.

## Pre-commit simplify and code/visual review

Read the supplied customer-website-delivery, frontend-design, verify/ship guidance and local AGENTS/CLAUDE instructions first. Used the assigned isolated worktree. Planned diagnosis → failing regressions → minimal owner edits → production/browser/performance verification → simplify/review → local commit. The approved design was frozen; normal-flow anchor sizing was selected to make target dimensions real and avoid overlapping pseudo-element hit areas.

No installed `superpowers`, `simplify` or slash `code-review` entry point was found in the supplied skills root. Per the task's permitted fallback, manual simplify/reuse and code-quality review were performed. The motion code has one observer and one lifecycle; it reuses existing selectors and motion frames instead of adding a parallel animation system. Shared providers, forms, image component, dependencies and routes are untouched. New/rewritten helpers are at most 30 lines, have explicit TypeScript return types where applicable, and stay below 500 lines per file. Async test runners report contextual failures. No `any`, debug logging, debugger, dead code, hidden content or security bypass was added.

Visual review compared the supplied desktop BEFORE screenshots with AFTER general/painting captures and inspected mobile/tablet views and article link crops. Photography, logos, copy hierarchy, drafting marks, ledger/process geometry and page signatures remain intact. Contact rows and article links have the intended extra space; long text wraps within its container. This is the builder's self-review, not the controller's independent review or a deployed QA verdict.
