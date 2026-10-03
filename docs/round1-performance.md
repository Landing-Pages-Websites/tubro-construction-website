# Round 1 critical-path delivery

Baseline: `cf4b8f84a287e026190afd3f77ea5aeaebc2950f`, supplied isolated worktree and `fix/golive-r1` branch. Local commit only; the controller owns push, exact-head bot review, Git-linked restaging, all eleven preview routes, and served-Git proof.

The approved Measured Living design, copy, route identities, photographs, logo, native forms, upload/security policy, and provider identifiers are conserved. The existing controller receipt for the 83-byte résumé upload and delivered notification is prior evidence, not a new local submission.

## Delivery changes

- Replace PostHog's static SDK/React-context imports with one dynamically imported SDK instance. There are no `usePostHog` or other context consumers. The wrapper always returns the original children, so loading never hides or remounts the site. Queue initial and early SPA URLs; flush once in order, override each captured URL/path, retain `capture_pageview: false`, and retry failed initialization on later navigation.
- Queue GA's official `Arguments` entries, one config with `send_page_view: false`, and initial/navigation events immediately. Insert the existing `googletagmanager.com/gtag/js?id=…` async loader after critical font paint and browser idle. Existing conversion producers are untouched.
- Share a scheduler that waits for `document.fonts.ready`, two animation frames, then `requestIdleCallback` with a 500ms busy-browser deadline. Pointer, touch, or keyboard interaction starts loading immediately. Cleanup cancels all work; browsers without idle callbacks yield with a zero-delay task after paint. No UA filtering, measurement-specific behavior, or long analytics timer.
- Split next/font's Poppins declarations into preloaded 400/600/700/800 and on-demand 500. Next 15 emits the same Poppins family for both; all exact faces, swap behavior, adjusted fallback, and original family variables remain. Keep Fjalla One 400 preloaded. Normal CSS usage still fetches every needed Poppins weight. Hero and logo images keep their original priority and sources.
- Keep home critical text fully unmasked and opaque. Retain short positional entrances (heading 220ms; body 180ms) without the old stagger/delay. Photograph, drawing, below-fold motion, and reduced-motion rules remain intact.
- Disable header/mobile CTA route prefetch. The portfolio's existing 200px intersection observer and explicit activation remain unchanged; scrolling near the real section still loads it.

## Verification plan and evidence

Artifacts: `/var/lib/megaclaw/workspace/tubro-evidence/performance-fixed`.

1. Fresh production build at the baseline. Serial Lighthouse 13.5, two samples per device for home/blog/privacy/projects, desktop simulated CPU1 and mobile CPU4. Preserve original HTML, font hashes, chunk lists, network requests, and LCP breakdowns.
2. Red/green analytics contracts: deferred SDK transfer, queued GA conversions, initial/SPA deduplication, early navigation, retries, stable children, absent-ID/embed exclusion, interaction acceleration, cancellation, and bounded idle fallback. Run all existing security/upload/migration tests, typecheck, and production build.
3. Stop build work before starting production server on 3187. Serial post-change performance for all eleven routes, at least two valid samples per device. Report each LHR's benchmark, warnings, URL/origin, simulated CPU setting, LCP/TBT/CLS, bytes, and LCP node.
4. Stable four-width home/projects/estimate browser checks, screenshot comparison with `browser-fixed/final-*.png`, keyboard portfolio activation/Escape, native form validation, and isolated browser analytics contract checks. Browser fixtures must never be represented as provisioned provider receipt.
5. Simplify and review the focused diff, preserve canonical checkers, commit locally. No push, PR update, merge, deployment, production write, or task action.

Local public GA/PostHog/CAPTCHA environment values are absent. Local Lighthouse is supporting delivery evidence, not a substitute for provisioned preview measurements. Actual Google widget assessment and analytics receiver confirmation remain controller checks; no identifiers or credentials are invented for the site build. Existing unit contracts exercise explicit per-form widget rendering and real execute calls at the SDK boundary. The known canonical `blog.post-ids` false positive for 53 legacy root routes is unchanged; no checker or correct URL was modified.

An initial attempt with only Fjalla preloaded reduced home mobile median LCP to 2.31s but introduced blog CLS 0.05. That attempt is retained under `iteration-one/`; the final candidate restores critical Poppins preloads to preserve stable layout. A subsequent full-route check identified careers CLS 0.119 from its 600-weight heading; `iteration-two/` retains that attempt. The final font split also preloads the existing 600 face. `iteration-three/` completed all eleven routes within metric thresholds, but full-precision home CLS was 0.00065 (earlier rounded console summaries showed 0.00). The final split also preloads its real 800-weight heading to preserve exact zero. No generated font bytes are changed.


## Conservation and browser checks

- `npm test`: 56/56 pass (the original 50 plus six net analytics/scheduler regression cases). The new analytics tests failed against the original eager loaders before implementation; `analytics-red.log` preserves that result.
- `npm run typecheck` and the final `npm run build`: pass. No browser, dependency, or system installation.
- All 19 generated font files retain the exact baseline SHA-256 byte set. The final CSS declares Poppins 400/500/600/700/800 under the same family; five preloads resolve to Fjalla 400 and Poppins 400/600/700/800.
- The initial layout's compressed chunk total falls from 220,512 to 121,613 bytes (98,899 bytes removed). The SDK is emitted as an asynchronous chunk, outside initial HTML script delivery.
- Ten statically rendered key routes retain identical body element/attribute/text sequences, excluding scripts/styles. Projects remains its existing dynamic route.
- The unchanged stable browser measurements were run serially on the requested bounded home/projects/estimate surface at 195/390/834/1440px: 12/12 cases, zero overflow, axe violations, short targets, small text, clipped text/controls, or uncaught page errors. The original checker file was not modified; `stable-browser.mjs` records the bounded invocation. Keyboard skip target, menu Escape, iframe activation/Escape, and focus indication pass.
- Home and projects at both 390 and 1440px: the first 1,000 screenshot pixels are pixel-identical to the supplied `browser-fixed/final-*.png` baseline. Full after screenshots, paired crops, and comparison results are in the evidence directory.
- The isolated browser harness executes the actual analytics source with fixture IDs and intercepted SDK boundaries. Both idle and navigation cases have no synchronous loader/import, one SDK initialization, one GA script/config, and exactly one initial plus one SPA pageview per provider. SDK boundary activation occurred 29.1–31.1ms after the harness installed it on the loaded page. This proves scheduling/event contracts, not third-party network receipt or initial-page wall-clock ingestion.
- A real native estimate form in the final local build blocks empty input. An intercepted valid double-click exercises the browser proof path, reaches one mocked POST, and emits exactly one existing `form_submission`. No lead was sent remotely. The portfolio iframe is absent initially and appears on approach to its section.
- Existing CAPTCHA unit tests still prove explicit invisible rendering, fresh execute calls per action, independent widgets, cleanup, retries, and sentinel isolation. Live Google assessment requires provisioned configuration and is not claimed locally.

Simplification and source review: one shared cancellation-aware scheduler, one SDK instance, one queue per integration, and no page-tree replacement. Reviewed all changed production functions, font faces/preloads, route links, and motion rules. No `simplify` executable or skill is installed in the supplied workspace; the simplification review was performed manually. Canonical checkers and thresholds are untouched. Exact-head org-bot review remains with the controller.

## Final local results

All eleven key routes have two valid desktop and two valid mobile runs: 44 final LHRs. Every requested/final URL remains on `127.0.0.1:3187`, all runs use simulated CPU1/CPU4 as appropriate, all warnings are empty, and benchmark indices range from 1007.5 to 2057. Every route median meets desktop LCP ≤2500ms/TBT ≤200ms and mobile LCP ≤6000ms/TBT ≤1000ms, with CLS ≤0.1. Maximum raw CLS is 0. These are local results with public analytics/CAPTCHA values absent, not a provisioned feature-preview grade.

| Route | Desktop LCP / TBT (ms) | Mobile LCP / TBT (ms) | Max median CLS |
| --- | ---: | ---: | ---: |
| `/` | 778 / 1.8 | 3410 / 116.8 | 0 |
| `/bathroom-remodeling` | 706 / 11.7 | 3062 / 105.2 | 0 |
| `/blog` | 764 / 5.5 | 2951 / 76.8 | 0 |
| `/blog/kitchen-remodel-cost-washington-state` | 698 / 10.2 | 2711 / 181.3 | 0 |
| `/careers` | 748 / 3.5 | 2994 / 81.0 | 0 |
| `/contact` | 633 / 0.5 | 2821 / 91.3 | 0 |
| `/kitchen-remodeling` | 769 / 3.5 | 3170 / 75.5 | 0 |
| `/privacy` | 636 / 5.0 | 2735 / 80.6 | 0 |
| `/recent-projects` | 939 / 6.5 | 3306 / 88.0 | 0 |
| `/schedule-an-estimate` | 713 / 1.2 | 3008 / 131.2 | 0 |
| `/service-area/home-remodeling-maple-valley` | 738 / 97.5 | 2880 / 96.5 | 0 |

Fresh local before/after mobile medians (both samples retained, no selective exclusions):

| Route | Before LCP / TBT (ms) | After LCP / TBT (ms) |
| --- | ---: | ---: |
| `/` | 4437 / 278.8 | 3410 / 116.8 |
| `/blog` | 4140 / 214.5 | 2951 / 76.8 |
| `/privacy` | 2886 / 216.5 | 2735 / 80.6 |
| `/recent-projects` | 4030 / 284.2 | 3306 / 88.0 |

The final bridge requests returned HTTP 200 in 16/44 runs. The browser captured the failure reason for localhost: the response lacks `Access-Control-Allow-Origin`, so Chromium blocks the existing cross-origin script (`net::ERR_FAILED`). See `browser/external-delivery.json`. This external CORS failure is not a JavaScript application exception and is not hidden by the layout/a11y summary. Earlier iteration-three measurements had 32 failed bridge requests despite unchanged tag markup; those measurements remain archived and are not the final matrix. MegaTag, the review-bridge integrity/load attributes, and the CAPTCHA loader remain unchanged. Total transferred-byte differences can reflect remote delivery and image/cache timing, so the controlled bundle reduction above is reported separately.

`performance-summary.json` contains per-run network bytes, script/font bytes, route prefetch counts, external script statuses, observed versus simulated LCP, LCP element selectors, and timing breakdowns. Full LHRs are retained as `before-*.json` and `after-*.json`; `medians.txt` is a compact index. Home header-driven route prefetches are absent after the change; shorter pages may still prefetch visible content/footer links.

All local metric medians meet the requested thresholds. Provider-complete performance remains unverified because local analytics/CAPTCHA values are absent and review-bridge delivery was intermittent. The controller must re-request exact-head org-bot review and measure the Git-linked provisioned feature preview on all eleven routes, including real initial/SPA analytics receipt and CAPTCHA/upload verification. The supplied preview baseline (home mobile median 8852ms) is a different environment and is not presented as a direct before/after comparison with this unprovisioned local build. No push, PR update, merge, deployment, DNS, production write, new tracking identifier, or task action was performed.
