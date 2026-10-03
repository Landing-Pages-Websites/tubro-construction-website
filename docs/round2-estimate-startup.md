# Estimate startup: local candidate evidence and controller handoff

The estimate-only candidate removes eager offscreen animation preparation and repeated layout work. Two valid local mobile runs give **694.5 ms median TBT**, **3169.5439 ms median LCP**, and **0 CLS**. Two valid desktop runs give **66.25 ms median TBT**, **662.4728 ms median LCP**, and **0 CLS**. These are advisory provisioned-local results, not a replacement for the immutable served-Git baseline or a QA READY determination. Final acceptance requires controller measurement on the newly reviewed, Git-linked staging artifact.

## Scope and source

- Child: `c8700297-c2e1-409e-9d87-053b37ee7646`; director ruling: `a443687c-863b-40ae-b372-cc0bf65ce5cb`, `2026-10-03T03:06:32Z`.
- Worktree: `/var/lib/megaclaw/workspace/tubro-golive-r1`; branch: `fix/golive-estimate-startup`.
- Starting merge: `51d2051c7295b06839ac1a3cf455dfe733fb856e`. PR 17 is already merged; its provider changes were retained.
- Only production source changed: `app/schedule-an-estimate/EstimateMotion.tsx`. `page.tsx`, the existing client wrapper and server children, all markup/CSS, fonts, images, logo, copy, metadata, forms, shared runtime, analytics, CAPTCHA, uploads, lead transport, dependencies, routes and article identities remain unchanged.
- Added focused mock-observer tests, a reusable browser harness and diagnostic probe, and this report. Test instrumentation is outside application imports.

Read the local AGENTS, customer-website-delivery and frontend-design skills. The approved Direction A remains frozen: the same homeowner estimate page, typography, asymmetric hero/form composition, restrained green accent and step-line motion. The existing isolated worktree was used. The plan and alternative assessment are in `plan.md` in the evidence directory: first attribute setup work, write failing tests, remove only unnecessary preparation, verify, simplify, review, and commit locally. No installed superpowers/simplify entry point was found; the same planning/TDD/review sequence and manual simplification were performed without claiming a skill invocation that was unavailable.

## Immutable baseline retained

Deployment `dpl_GdzLAva7ShPRGfyPATBPQFUQ5CrK`, READY/source=git, serves the starting merge at [the immutable estimate URL](https://tubro-construction-website-at7evgk4q-mega-websites.vercel.app/schedule-an-estimate).

The original files remain in `/var/lib/megaclaw/workspace/tubro-evidence/contact-continuation/merged-lighthouse/`: `estimate-{mobile,desktop}-{1,2}.json`, `performance-summary.json`, and `contact-estimate-validity-receipts.json`. Their original SHA-256 values are retained in this attempt's `baseline-sha256.json` and checked again before commit.

| Baseline sample | Benchmark | LCP ms | TBT ms | CLS |
| --- | ---: | ---: | ---: | ---: |
| Mobile 1 | 2041.5 | 4539.2405 | 929.166 | 0 |
| Mobile 2 | 2050 | 4274.896 | 1095.384 | 0 |
| Desktop 1 | 2011.5 | 740.714 | 66 | 0 |
| Desktop 2 | 1988.5 | 762.6125 | 71.5 | 0 |

All are valid: benchmark >1000, no warnings or runtime error, exact requested/final estimate URL, simulate with mobile CPU 4 / desktop CPU 1. The **1012.275 ms mobile TBT median remains a failed canonical result**, including its valid 1095.384 ms sample. The contact median of **854.54125 ms** and other passing routes in the 44-run matrix are retained, not regraded or rerun.

## Attribution and implementation

The immutable mobile LHR forced-reflow insight attributes **29.741 ms / 28.227 ms** to the estimate route's geometry loop; the first also records 1.085 ms at a second estimate location. This is a bounded route-specific problem inside a larger startup workload. The existing GA tasks (394/425 ms plus 181/217 ms), PostHog extension tasks (307/306 ms), and React/application tasks (281/253 ms) do not justify provider suppression or an unsupported claim that the motion helper saves hundreds of milliseconds.

A fresh instrumented Chromium capture of the immutable preview includes a CPU profile and DevTools trace. Native `getBoundingClientRect` and `animate` calls receive User Timing measures from a test-only probe. At 390 px, before scrolling:

| Observed startup work | Immutable preview | Local candidate |
| --- | ---: | ---: |
| Estimate WAAPI animations created | 44 | 0 |
| Paused animations | 44 | 0 |
| Geometry calls | 44 | 25 |
| Time inside native geometry calls | 30.0 ms | 0.3 ms |
| Time inside native animate calls | 4.2 ms | 0 ms |
| Layout events with estimate-route stacks | 44 | 0 |
| Duration of those Layout events | 14.103 ms | 0 ms |

The CPU samples independently put 26.756 ms under the initial estimate configure loop and 13.231 ms under its fonts-ready invocation; total sampled time with an estimate-route ancestor is 45.362 ms before and 5.427 ms after (`cpu-profile-attribution.json`). The captured immutable page chunk maps those stacks back to the original configure/geometry loop. These diagnostic timings are unthrottled and instrumented. They describe actual removed work, not a controlled total-TBT delta. The baseline created 22 offscreen text animations twice: initial configuration, then the fonts-ready callback. Cancellation/animation writes alternated with geometry reads and forced layout. The candidate's single snapshot reads all 25 targets (22 text targets and three step markers) before observer/style changes. It does not prepare animations for an idle visitor who never reaches those targets.

The existing observer boundary remains `rootMargin: "0px 0px -6% 0px"`, threshold 0. On first intersection, an eligible heading/body creates its running animation directly. Heading duration stays 650 ms, body duration 500 ms, easing stays `cubic-bezier(.16,1,.3,1)`, and every authored delay is read unchanged. Desktop headings retain 22 px travel; mobile headings and body text retain 12 px. Step visibility still activates the unchanged horizontal/vertical CSS line animation with 650 ms duration and 0/80/160 ms staggering.

Initially visible or already passed targets are remembered, so a font event, preference change, duplicate observer delivery or reverse scroll cannot newly transform them. There is no font-ready reconfiguration, idle timer, request gating or delayed startup replay. During reduced motion, observer visibility only remembers targets; no text animation is prepared. Preference changes cancel running animations and clear the step animation attribute, leaving the authored full static line visible. Focus reveals the target, all matching ancestors and matching descendants. Unmount disconnects the observer, removes listeners, cancels animations and guards stale deliveries. Without IntersectionObserver the enhancement returns early and preserves usable SSR content.

The trace supports removing animation preparation. It does not establish a benefit from moving the main out of its client wrapper, so that boundary was retained. Shared provider source is unchanged. Local shared bundle bytes are not asserted identical to the deployed build: the immutable Next client bundle includes deployment-ID headers and cache-busting strings absent locally (`shared-chunk-diff.json`). This environmental difference is another reason local timings cannot substitute for served-Git acceptance. No source/client-tree boundary affecting contact changed. Candidate LHRs no longer attribute forced reflow to the estimate route. Larger mobile tasks remain GA (365/334 ms plus 174/171 ms), PostHog extensions (283/304 ms), and React/application (212/213 ms); see `candidate-attribution.json`.

## Behavior, visual and accessibility evidence

All artifacts below are under `/var/lib/megaclaw/workspace/tubro-evidence/estimate-startup/` unless explicitly stated otherwise.

- **TDD:** `tdd-red.log` records seven failures and two passes against the original implementation. `tdd-green.log` records all nine focused tests passing. Coverage includes mock IO entry/duplicates/passed content, fixed geometry snapshot ordering, font-ready no-op, authored timing/distance, completion cleanup, focus ancestor/descendant cancellation, focus before approach, reduced-motion changes, stale callbacks, unmount and unavailable IO. `all-tests.log` records **69/69 passing**, retaining the previous 60 tests.
- **Build/types:** `build.log` records the provisioned production build; `typecheck.log` records a passing `npm run typecheck`. Public environment values were process-only. No private key or config file was read or written. `candidate-source.json` records the production source hash and local build ID.
- **SSR:** `baseline-ssr.html`, `candidate-ssr.html` and `ssr-contract.json` establish identical title/meta/main/H1/form/control attributes, including `main#main-content`, `tabIndex=-1`, native form fields and `type="button"`. No empty Suspense or conditional child mount was introduced.
- **Responsive/a11y:** `baseline-{195,390,834,1440}-axe.json` and candidate counterparts report zero axe violations in the estimate main. All four widths have zero document horizontal overflow. Computed typography, colors, element widths/heights, horizontal placement and recorded hit-area styles match exactly (`visual-comparison.json`). Existing contact 195/390/834/1440 a11y/reflow and form contracts are reused from `contact-continuation/after-a11y.json`, `visual-comparison.json` and `ssr-comparison.json`, because no contact/shared owner changed.
- **Screenshots:** initial and settled-scroll screenshots at every width are byte-identical to the immutable preview. Mobile 390 and desktop 1440 were visually inspected, including logo legibility, the kitchen crop, form composition and continuous step lines. Original keyboard captures caught smooth scrolling in progress; they remain as diagnostic artifacts. Separate `*-keyboard-settled.png` captures place the actual focused link in view before recording it. Harness selector corrections are retained in `harness-corrections/`; these were browser-harness issues, not replacement performance samples.
- **Actual timelines:** `baseline-*-timeline.json`, `candidate-*-timeline.json` and `timeline-comparison.json` match all 22 authored animations and three step styles at every width. Every candidate text animation runs without a pause, fires finish, and cancels at currentTime = duration + authored delay (floating-point tolerance 0.000001 ms). Animation event dispatch differs by normal frame scheduling; no shortened duration is substituted. Full-scroll checks exercise every reveal.
- **Focus/preferences/fallback:** `candidate-browser-results.json` records a running paragraph animation cancelled to zero active animations and `transform: none` when its child link receives focus; main focus reveals every descendant. Initial reduced motion creates zero animations, and preference changes cancel active motion. The baseline missing-IO probe crashes with `IntersectionObserver is not defined` and loses the form; `baseline-fallback-results.json` records that failure. The candidate keeps its H1 and one form with no page errors. The ordinary candidate matrix also has no page errors.
- **Estimate smoke:** radio selection, native text entry, keyboard focus and FAQ opening behavior pass. This diff does not affect form controls, validation, transport or retry hooks; previous full estimate flow evidence remains applicable. No actual estimate POST or upload was made.

## Local Lighthouse pair, preserved in full

Lighthouse 13.5 ran against the local production server on port 3187. Chromium was the existing provisioned binary; no dependency/browser/system installation occurred. Browser, build and Lighthouse performance collection were serialized. Each LHR had a 115-second maximum; exactly two candidate samples per profile were collected. No additional valid pairs were sampled to select a pass.

| Candidate sample | Benchmark | CPU | LCP ms | TBT ms | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mobile 1 | 1946.5 | 4 | 3181.1664 | 696 | 0 |
| Mobile 2 | 1974 | 4 | 3157.9214 | 693 | 0 |
| Desktop 1 | 2010.5 | 1 | 721.0758 | 52 | 0 |
| Desktop 2 | 2028 | 1 | 603.8698 | 80.5 | 0 |

Every raw LHR has benchmark >1000, `runWarnings: []`, **absent** `runtimeError`, simulate throttling and the intended CPU/profile. Requested and final displayed URL both equal `http://localhost:3187/schedule-an-estimate`. All providers were allowed. Every sample records GA collect **204** and PostHog ingest **200**. `candidate-estimate-*.json`, `.receipt.json`, `-0.trace.json`, `-0.devtoolslog.json` and `.log` retain full output. `performance-summary.json` includes full LHR hashes, settings and provider receipts; `lab.py` records the exact commands.

These local results meet mobile LCP <=6000 / TBT <=1000 / CLS <=0.1 and desktop LCP <=2500 / TBT <=200 / CLS <=0.1. They have a 305.5 ms local median TBT margin. **That margin is not attributed entirely to this code change.** The baseline is a deployed immutable origin and this candidate is local; delivery, resource order, cache/CPU and provider variability prevent a causal before/after total-TBT comparison. No new local baseline performance pair was needed or used to replace the existing canonical failed samples.

## Provider and preserved integration verification

The unchanged `tests/contact-startup-browser.mjs` was reused once on the provisioned local build and exited 0. Initial idle PostHog delivery occurred in **947 ms**. Initial contact → blog → contact navigation produced exactly **three GA pageviews delivered with 204**, three PostHog pageviews, one GA config/script, one first-click capture, one session with retained UTM attribution, and pageleave. Browser errors were empty. The intercepted contact fixture sent zero invalid POSTs, one failed attempt, then one successful rapid retry and one conversion; early navigation/provider failure recovered on the second download attempt without duplicate pageviews. Its normal-idle and SPA checks use actual GA/PostHog delivery; only its explicitly labeled failure/retry fixtures intercept provider transfer or contact-form POST. Those fixtures are separate from all performance runs. Results are recorded in `browser-flows.json` and `provider-browser.log`.

The previously verified **80-byte text/plain résumé, scan_state CLEAN**, and delivered notification remain unaffected, as recorded in `contact-continuation/final-served-evidence.md` and the retained upstream receipts. No lead, notification or upload was repeated. Attribution, session, first-click, pageleave and conversion retry semantics remain the existing PR 17 behavior; no privacy or ID change was made.

## Review and controller acceptance boundary

Manual simplification retained a single route owner and a small typed state, removed duplicate configuration and unused startup work, and kept all functions below 30 lines and all new files below 500 lines. The source has no `any`, console/debugger calls, provider modifications, timers or benchmark/UA branches. `source-standards.json` and `simplify-review.md` record the local review, including geometry read/write ordering, observer races, focus completeness and cancellation paths. `git diff --check` passes. This local review does not substitute for the org reviewer's exact-head approval.

The controller owns the next steps: canonical `web-build.sh verify tubro-c870-estimate-0306` after this committed engine run finishes successfully; a **new** PR and `website-pr-review-mega` approval of its exact head; merge into the existing staging branch with reviewed-tree parity; Git-push-triggered, Git-linked READY/source=git nonproduction deployment whose `gitSource.sha` equals that merge; and final immutable-origin estimate pairs plus provider/browser checks. PR 17's existing approval cannot cover this diff. No push, PR, merge, deployment, Atlas action or external message was made here.

If final served measurements miss the threshold, retain that valid pair and its traces. The next useful evidence would be exact-merge React/application task attribution and a same-origin estimate-motion comparison before considering a narrowly justified client-boundary change. The present evidence does not justify a broader rewrite or provider suppression.

The separate **53 preserved root-article paths / `blog.post-ids` checker contradiction** remains unchanged, failed and unwaived. Its checker, source IDs, URLs and bodies were not altered. This report neither regrades that check nor declares overall go-live acceptance.
