# Contact startup continuation

This is the bounded continuation of child `c8700297-c2e1-409e-9d87-053b37ee7646`, under director ruling `a09e151b-db0f-4610-8378-55d12267bc97` (2026-10-03T02:10:28Z). It starts at reviewed staging merge `c8945a07e37a592695b6b4f0835926d5dc3ebd6e`, on `fix/golive-r1-contact`.

The controller owns remote actions, exact-head automated review, staging merge, Git-linked deployment, and the final 44 served-Git measurements. No push, PR, deployment, Atlas write, real lead, migration, content, design, CAPTCHA, security, or dependency changes are included here. Prior PR 16 approval does not cover this change. The checker root-path candidate remains unadjudicated.

## Immutable acceptance baseline

Deployment `dpl_HQ63jSEWjjHJeuHpHnkp4yeETpSy`, [immutable contact URL](https://tubro-construction-website-864oacse9-mega-websites.vercel.app/contact), serves the reviewed merge. The existing `contact-validity-receipts.json` and four `merged-lighthouse/contact-{desktop,mobile}-{1,2}.json` files under `/var/lib/megaclaw/workspace/tubro-evidence` remain unchanged. Their SHA-256 values were checked against the receipts.

| Canonical sample | Benchmark | LCP ms | TBT ms | CLS |
| --- | ---: | ---: | ---: | ---: |
| Desktop 1 | 2059.5 | 639.161 | 79 | 0 |
| Desktop 2 | 2047.5 | 526.917 | 125.105 | 0 |
| Mobile 1 | 2013 | 4285.5355 | 1217 | 0 |
| Mobile 2 | 1977 | 1838.5265 | 1312.5 | 0 |

All four canonical samples have no warnings or runtime error, simulated throttling, CPU 1 desktop / 4 mobile, and matching requested/final origins. Canonical mobile median TBT **1264.75 ms remains blocking** until the controller measures a new served Git deployment. Local measurements do not replace this baseline.

## Investigation and implementation

The measured baseline identified PostHog's asynchronous bundle, GA, and React as the long-task owners. Inspection found no material contact-specific synchronous work that justified changing `page.tsx`, `ContactMotion.tsx`, or `LeadForm.tsx`. Those files, SSR children, form markup, fonts, layout, copy, and styles remain unchanged.

PostHog 1.435.8 ships a 322,471-byte default module, a 151,813-byte slim module, and a 171,395-byte extension bundle (raw installed bytes). The [upstream JavaScript documentation](https://posthog.com/docs/libraries/js) documents the advanced, experimental slim entry, `__extensionClasses`, and `AllExtensions` as equivalent to the default feature set. The [upstream extension bundle source](https://github.com/PostHog/posthog-js/blob/main/packages/browser/src/extensions/extension-bundles.ts) agrees with the installed declarations and implementation. Installed files were read only; no SDK internals were patched and no private lifecycle methods were called.

The candidate imports the slim core and then the complete typed extension bundle through separate asynchronous chunks, awaiting both before the single `init`. This divides module evaluation across browser tasks. It does **not** claim to reduce total SDK bytes. It preserves all default extensions, including actual SDK autocapture, feature flags, replay hooks, pageleave, and session attribution. The original `capture_pageview: false`, `capture_pageleave: true`, `person_profiles: "identified_only"`, `opt_out_useragent_filter: true`, and `disable_surveys: true` configuration remains intact. No provider wrapper or conditional child mount was introduced.

The project's public remote config returned 200 and currently disables replay, surveys, tours, conversations, heatmaps, error autocapture, and console capture, while enabling autocapture. This snapshot alone is insufficient reason to remove those extension classes: remote settings can change. Late registration through private SDK methods, hand-replayed DOM clicks, and experimental deferred extension initialization were not used. Keeping the complete extension set avoids an additional period after core initialization in which the first click could be lost.

GA and PostHog retain independent calls to the existing bounded paint/idle scheduler. Neither waits for the other provider's response. No interaction-only gate, benchmark detection, request blocking, or extra startup timer was introduced. Queued PostHog pageviews now retain their occurrence timestamps across early navigation and capture retry. A GA script transfer error removes the failed element so the next navigation can retry without repeating config or pageviews.

## Verification evidence

All new artifacts live in `/var/lib/megaclaw/workspace/tubro-evidence/contact-continuation`. Public provisioned IDs and the sanctioned CAPTCHA bypass were supplied only via build/server environment. No private keys were read. The local production origin is `http://localhost:3187`.

The unmodified build passed all 56 tests. Four new regression tests first failed (`tdd-red.log`), then passed (`tdd-green.log`). They cover complete extension initialization, queued timestamps and capture retry, extension-download failure and recovery, and GA failure recovery without duplicate configuration/events. Existing provider tests now mock the documented split entrypoints while retaining their assertions.

The canonical screenshots inspected were `merged-browser/final--contact-{390,1440}.png`; local `before-contact-{195,390,834,1440}.png` and `before-layout.json` establish the matching local comparison. Browser and Lighthouse jobs run serially with the controller-provided Chromium and existing modules. No browser/system packages were installed.

All **60 tests**, production build, and `tsc --noEmit` pass (`candidate-tests.log`, `candidate-build.log`, `candidate-typecheck.log`). `git diff --check` passes. There is no lint script or installed `simplify` command/skill in this workspace; a manual simplification/self-review and TypeScript AST function-length check were performed instead. Changed production functions and new test functions stay within 30 lines; files remain under 500 lines. No `any`, console/debugger calls, private SDK bridge, or dependency change was added.

`browser-flows.json` records idle initial capture, SPA navigation, one autocapture for the first chosen real click, one persistent session with its UTM source, pageleave, one GA configuration and script, queued early navigation with ordered timestamps, and GA recovery after a deliberately failed transfer. The initial and both SPA GA pageviews received 204 responses. The normal idle initial PostHog pageview arrived in 555 ms in the final passing flow (earlier passing flows: 611/703 ms). The regression flow deliberately aborts only its first GA transfer; normal flows and every Lighthouse run have no blocked provider requests.

The contact form test intercepts **every** lead request: empty/invalid input sends zero POSTs; one mocked 503 presents the existing retry state without a conversion; retry succeeds with one POST despite double activation and emits exactly one manual `form_submission`. The consent value and camelCase form-data keys remain unchanged. No actual lead or upload was sent. Home, blog, and Maple Valley city routes return 200 with one H1, and the contact keyboard focus/Escape check passes. Existing proof/upload unit coverage remains intact.

`after-a11y.json` has zero violations at 195/390/834/1440 px and no horizontal overflow. Main submit hit areas are 46.5 px high (91.5 px when wrapped at 195 px). `ssr-comparison.json` confirms all 14 form/control elements and attributes match the immutable deployment, including requirements, patterns, and button type. `visual-comparison.json` confirms matching computed fonts, sizes, weights, line heights, colors, horizontal positions, widths, and heights at all four widths. Initial capture attempts ran during CSS smooth scrolling; those artifacts are retained under `unsettled-scroll-capture`. Final `after-contact-*.png` captures wait for an instant return to the top and settled reveal motion. They were visually compared with the canonical mobile/desktop screenshots; they are not claimed to be pixel-identical. No UI source changed. Known review-bridge v7 localhost loading/SRI behavior remains outside scope; its markup was retained.

## Provisioned local Lighthouse results

Every row below has benchmark >1000, `runWarnings: []`, no runtime error, exact requested/final `http://localhost:3187/contact`, simulated CPU 1 desktop / 4 mobile, and CLS 0. Each run retains the complete LHR, `-0.trace.json`, `-0.devtoolslog.json`, log, and `.receipt.json`. All six runs contain successful GA script 200, GA collection 204 (`analytics.google.com/g/collect`), PostHog config 200, and PostHog ingestion 200 responses. No SDK request was blocked to obtain these timings. `lab.py` enforces a 115-second maximum per run.

| Local sample | Benchmark | LCP ms | TBT ms | CLS |
| --- | ---: | ---: | ---: | ---: |
| Before desktop 1 | 2027 | 650.1902 | 103 | 0 |
| Before mobile 1 | 1998 | 2789.5416 | 861.1823 | 0 |
| After desktop 1 | 1926.5 | 632.1734 | 61 | 0 |
| After desktop 2 | 2000.5 | 694.1380 | 72 | 0 |
| After mobile 1 | 1897 | 2351.8080 | 875.6490 | 0 |
| After mobile 2 | 1933.5 | 2773.9928 | 843.8759 | 0 |

Both candidate samples per device meet **local** LCP/TBT/CLS thresholds. Candidate mobile median TBT is 859.76245 ms, essentially unchanged from the single provisioned local baseline sample (861.1823 ms). This is not evidence of a meaningful total mobile TBT improvement, and it is not a replacement for the canonical blocking 1264.75 ms median.

The trace does show shorter individual PostHog tasks. The local baseline's default chunk `b468fba8.d2ca49f8a8510dbb.js` owns a 390 ms simulated mobile task (111 ms desktop). The candidate core chunk `5913.867eea3bae5c45a2.js` owns 110/130 ms mobile tasks; extension chunk `47984944.d967138451498411.js` owns 287/302 ms mobile tasks and 73/75 ms desktop tasks. Actual Chrome timeline events support the attribution: mobile sample 1 records core evaluation at 26.886 ms and extension evaluation at 71.025 ms before simulation. The raw traces, not only these summaries, are retained.

GA still owns the longest candidate mobile task at 361/350 ms, plus a second 181/176 ms task; React owns 258/199 ms. Mobile sample 1 bootup scripting is GA 486.972 ms, PostHog core 148.164 ms, and PostHog extensions 265.640 ms. Splitting reduces the longest uninterrupted SDK task, but does not remove its aggregate work. The built SDK resource sizes increase from 303,607 bytes to 314,056 bytes combined; local transfer sizes increase from 98,357 to 104,072 bytes. That tradeoff and the documented experimental entrypoint require exact-head review.

## Controller handoff

This is a locally verified candidate, **not a completed go-live performance acceptance**. The controller must run the new exact-head automated review and its provisioned, Git-linked served deployment checks, including all 11 affected key routes. Prior approval is not reusable. No remote actions were performed.

If the served contact median still exceeds 1000 ms, the next diagnosis is to compare the deployed core/extension task split and GA execution with these traces, then attribute the remaining extension and GA container work to specific enabled features. The installed API offers constructor selection at initialization, but no documented post-init lazy registration contract suitable for preserving the first real interaction. Further removal needs evidence of unused features and conserved attribution; it must not silently disable autocapture, session/replay hooks, or GA events. These measurements do not establish that mandatory third-party code alone makes the target impossible, and no waiver or cap is proposed.
