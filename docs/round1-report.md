# Tubro combined go-live round1 — controller handoff

Branch: `fix/golive-r1`. Baseline: `fc61cb10d027bb6cb4ce63b115c388798799c47a`. All work stayed in the supplied isolated checkout. No push, PR, merge, deployment, task mutation, DNS change, credential access or real lead submission was performed. Controller retains review and staging deployment ownership.

**Careers résumé-byte delivery is now implemented in this same combined round1.** The later director ruling supersedes the historical filename-only scope below. The form uses MEGA's existing signed-upload endpoint, uploads actual bytes, and forwards only owned, token-bound keys in `form_data._mega_uploads`. See [résumé delivery evidence and controller handoff](round1-resume-delivery.md). No remote submission or platform-persistence result is claimed here.

**All remaining browser residuals are repaired and locally verified across 44 cases. The full combined scope remains intact.** This follow-up starts at `ff69dba59f641956867e1c1a4da578ed84965c11` on the same isolated branch. The supplied Chromium binary works with the supplied library path; no browser/system dependencies were installed. Final browser-repair evidence is recorded below. Deployed Google assessments, analytics ingest, real lead receipt and valid Lighthouse measurements remain controller-owned and are not certified here. Existing before screenshots were not modified.

## What changed

| Area | Owning files | Result |
| --- | --- | --- |
| SSR and semantics | `app/layout.tsx`, page/layout main elements, `MobileEstimateCta.tsx`, privacy composition | Children render normally under the retained PostHog provider. Only the URL-dependent mobile CTA has bounded Suspense. Common skip navigation targets a focusable main. Mobile CTA is a landmark; privacy headings no longer skip h2. |
| Complete migration | `content/blog/*.md`, `_inventory.json`, `src/lib/blog-posts.ts`, `app/[legacySlug]/page.tsx`, `app/blog/*`, `app/sitemap.ts` | 54 recovered articles, 13 faithful authored exports, two preserved nonarticle legacy pages. Exact original/required paths serve directly; the reader uses the real Markdown source. Full source/body hashes and precise targets cover 87 URL records. |
| Article metadata | `src/lib/article-metadata.ts`, `article-schema.ts`, `seo.ts` | Original dates and stable identities; one BlogPosting per article, unique canonical destination. Short SEO strings are separate from complete visible editorial text. |
| Lead boundary | `app/api/lead/route.ts`, `src/lib/lead-{policy,server,validation,challenge,client}.ts`, `leadProof.ts` | Exact staging sentinel and sanctioned host/environment checks; production exact allowlist fails closed. Enterprise assessment checks token/action/host/score. Bounded JSON stream parsing, required fields, allowed options, boolean consent and fixed upstream customer/site/source prevent spoofing. |
| Lead UI | `useEstimateForm.ts`, `estimate-fields.ts`, `submission-lock.ts`, `EstimateField.tsx`, the three form components, `EstimateStatusNote.tsx` | Native required/pattern/action/method match actual canonical field keys. Client and server share validation; HTML v-mode patterns compile. Synchronous lock prevents duplicate calls and conversion is emitted only after confirmed success. Separate inline phone/email errors and recoverable failures; inputs retained on errors. |
| CAPTCHA | `recaptcha-client.ts`, `RecaptchaBootstrap.tsx`, proof helpers | Each form owns an explicitly rendered invisible policy-based Enterprise widget; `enterprise.js?render=explicit`, `execute(widgetId, { action: "lead_submit" })`, reset before retry, and no mount-time tokens. Signed fallback uses the existing upload signing secret and the canonical bounded warm-instance replay guard after load/execute or assessment failures. No new environment or storage dependency. |
| Analytics | `GoogleAnalytics.tsx`, `PostHogProvider.tsx` | GA forwards official Arguments objects, config disables its initial automatic view, explicit initial/navigation views are deduplicated locally. The official PostHog SDK provider stays mounted, defers initialization and explicitly captures pageviews with bot filtering disabled for browser verification. Provisioned public IDs remain environment driven. |
| Embed/performance | `DeferredPortfolio.tsx`, `GalleryA.tsx`, `RealWorkPortfolio.tsx` | Live iframe mounts within 200px of the viewport or interaction, with reserved dimensions, explicit keyboard entry, skip control, visible frame focus and Escape return. Existing RealWork configuration and integration retained. No live performance claim. |
| Accessibility | Existing route CSS/modules and shared components | Supporting text raised to at least 14px at source; deeper existing green for small text/cream CTAs; inactive index opacity fixed. Expanded link/control/label targets without enlarging radio glyphs. Intrinsic form width and narrow layout repairs; offscreen motion thresholds avoid unreachable large sections. |
| Discovery | `public/manifest.webmanifest`, `public/llms.txt` | Manifest linked in layout; truthful business name, phone and service regions in shared LocalBusiness/Organization schema. No fabricated address or rating. |

The exact file manifest is in [`round1-changed-files.txt`](round1-changed-files.txt). Detailed extraction/identity decisions are in [`round1-migration.md`](round1-migration.md). No authored project-photo names, logos, design references/artifacts, checker scripts or provisioning IDs changed. Existing JSON posts remain provenance; they no longer supply abbreviated article bodies.

## Checks actually run

| Check | Actual outcome |
| --- | --- |
| `npm ci` | Passed on both baseline and final lockfile. Markdown rendering/sanitizing packages and sanitizer types were added through npm. No browser/system installation. |
| `npm run typecheck` | Passed again after the final controller-fix production build. |
| `npm run build` | Passed again, 196 generated static pages plus the existing dynamic boundaries. Local build used `VERCEL_ENV=development` and the sanctioned public CAPTCHA sentinel. No Tubro app server was running during either build. Runtime port 3187 used a local test-only signing value; no production credentials or analytics IDs were accessed. |
| `npm test` | 27 passing tests. Added the npm test script for the existing Node test runner. Actual API handlers use intercepted outbound requests. Covers phone/native-v patterns, strict hosts/sentinel, explicit widget render/execute/reset/dispose, multiple forms and loader retry, rejected/throwing Google assessments followed by valid proof, labels, signed payload binding, replay races/capacity/expiry, missing secrets, invalid inputs, identity spoofing, client retry, analytics call paths, and migration identities. |
| `python3 scripts/verify-round1.py` | 103 paths passed against the local production server. Direct 200 status, no migration redirects, raw h1/main/forms, native field contracts, metadata bounds/social tags, canonical/article schema checks, complete source body hashes, link counts and table counts. |
| DOM/HTML accessibility inspection | 11 key routes passed heading order, one main target, image alt presence, control labels and duplicate-id checks. This is not axe or rendered contrast/reflow testing. |
| Asset checks | 114 downloaded editorial images plus manifest, llms, robots and sitemap: 118 local HEAD requests returned 200. All original editorial image bytes decoded successfully. Contact sheet reviewed; actual rendered crops remain unverified. |
| Source color calculations | Home small green on plaster: 5.74:1; cream CTA text on action-deep: 6.09:1; portfolio index on sage/plaster: 6.39:1 / 6.81:1. Rendered axe contrast still requires the browser. |
| `git diff --check` | Passed. Protected-path diff is empty. New boundary code has no `any`, debugger or console logging. |
| Browser launch | Passed with the controller-supplied Chromium executable and `LD_LIBRARY_PATH`, using the supplied Playwright and axe-core modules. No dependency installation or Chromium wrapper. |
| Lint | Not run: the repository has no lint script. Next's build output is not represented as a separate passed lint command. |

Evidence directory: `/var/lib/megaclaw/workspace/tubro-evidence`.

- `round1-ssr.json`: per-path status, metadata, schema and body parity.
- `round1-migration.json`: source selector, original hashes, word/link/table counts.
- `round1-dom-a11y.json`: eleven-route DOM checks and native fields.
- `round1-assets.json`, `round1-color-tokens.json`.
- `round1-unit-tests.log`, `round1-build.log`, `round1-typecheck.log`, `round1-browser-bootstrap.txt`.
- `legacy-image-index.jpg` and `.json`: original editorial-image index, not browser screenshots.

## Review and simplification

Manual reuse/simplification and security/data-integrity review were completed before commit. The controller pass consolidated the proof lifetime and separated the shared loader from per-form widget state; all new functional helpers are at most 30 lines, with no `any`, console logging or debugger. Existing long JSX compositions were preserved. Shared validation, field collection, metadata, schema and lock helpers replace duplicated behavior; error announcements were consolidated. Review found and fixed stale blog motion targeting, duplicate phone/email error ids, HTML pattern v-mode escaping, residual index opacity and Duda indentation-as-code conversion. New functional helpers remain small; pre-existing long JSX compositions were retained to conserve the authored design rather than broadly refactored.

The requested `simplify` executable/skill is not installed or exposed in this session (direct invocation returned exit 127, `simplify: command not found`; skill/command search found no implementation). The manual pass is documented honestly and is not claimed as a successful invocation of that unavailable command. Independent bot review remains controller owned.

## Controller regression pass — 2026-10-02 (before browser residual repair)

- **Phone/email:** HTML and server use the same v-flag-valid patterns. Exactly ten phone digits; `+1(757)6855050`, all other country-prefix/eleven-digit forms, short phones and one-character/numeric TLDs fail. Only validated ten-digit formatting is normalized before forwarding. Error copy no longer advertises `+1`.
- **Policy-based CAPTCHA:** ported the supplied Gary explicit/invisible widget contract, with one container per form, shared retryable loader, readiness/error/expiry handling, cleanup after unmount, and fresh reset/execute per submission. Preview sentinel creates no Google script/widget/token execution. The production public key stays environment-driven; no provisioning values changed.
- **Fallback:** GET returns a fresh string `issuedAt`, random challenge and HMAC signature with `Cache-Control: no-store`. HMAC binds hostname, timestamp and challenge using the already configured `LEAD_UPLOAD_SIGNING_SECRET`. Proof follows the canonical `lead-pow-v1` sorted, type-preserving binding and 16-bit work over all submitted fields except verification fields. Removed the artificial 750 ms minimum age. Invalid signature, field changes, stale/future challenges and replay fail closed. The shared warm-instance guard remembers at most 100,000 fixed-size keys and refuses capacity overflow without evicting fresh claims.
- **Assessment failure:** low score, `BROWSER_ERROR`, rejected Google HTTP responses and thrown assessments all permit a fresh valid proof fallback. Tokenless or invalid-proof production POSTs still fail. Missing production assessment/signing configuration fails closed. Only the exact staged sentinel succeeds on a sanctioned preview host; production aliases remain denied.
- **Delivery labels:** server-owned `form_data.spamCheck` is `Passed reCAPTCHA` for a verified assessment, or `Unverified: reCAPTCHA did not pass; passed fallback check` for a valid fallback. Client fields cannot supply or override this label. Staging sentinel is not falsely labelled as a real reCAPTCHA pass.
- **Forms:** hidden `form_key` reads the same hook value used in the payload. Each served form has one explicit CAPTCHA container. The six forms on the required routes returned verification `403` for valid tokenless probes, rather than unknown-form `422`. Careers still sends only `resumeFileName`; no byte upload or storage was invented.
- **Browser form flows:** all six forms blocked `+1(757)6855050`, eleven/short digits and a one-letter TLD; accepted formatted ten digits; retained data after an intercepted 502; and produced exactly one successful intercepted request and one `form_submission` despite rapid repeat activation. No real leads were delivered and no Google requests occurred in this sentinel build.

References consulted: the supplied `/var/lib/megaclaw/workspace/gary-golive-round4/components/RecaptchaWidget.tsx` and the four local site-starter proof reference files under `/var/lib/megaclaw/workspace/tmp/grey-lead-pow-reference/src/lib/captcha/`. Anonymous public raw GitHub `main`/`master` URLs returned 404 in this environment; no authenticated lookup or credentials were used. The local canonical replay contract explicitly has warm-instance scope, with downstream same-contact deduplication described by that reference. This patch does not claim distributed single-use enforcement or independently verify downstream deduplication.

The following historical evidence describes head `ff69dba` before this browser follow-up. Its remaining browser findings are superseded by the browser-repair evidence below. Evidence is under `/var/lib/megaclaw/workspace/tubro-evidence/`:

- `round1-controller-tests.log`, `round1-controller-build.log`, `round1-controller-typecheck.log`, `round1-controller-ssr.log`.
- `controller-review/round1-browser.json`: unchanged existing browser checker, 33 desktop/tablet/mobile route checks plus 11 narrow/reduced-motion checks; intercepted success/duplicate check and menu Escape passed. The command exits 1 because of the recorded contrast and narrow overflow findings, not a bootstrap failure.
- `controller-review/browser-details.json`: supplemental rendered fonts, actual associated label/control rectangles, form keys, tokenless probes, stable scrolling, axe and final screenshots. Closed native disclosure content is excluded from visible-target measurements; 16–18 px radio glyphs are judged by their actual clickable labels.
- `controller-review/form-browser.json`: six intercepted invalid/error/retry/success flows, filename-only careers payload, exact conversion counts and no Google loads.
- `controller-review/overflow-diagnosis.json`: offending elements for the six narrow-layout routes.
- `controller-review/keyboard.json`: skip-link focus, mobile menu Escape and same-origin portfolio iframe Escape all passed.
- `controller-review/summary.json`: final 44 rendered cases, no visible text below 14 px, no radio/checkbox labels below 44 px, six tokenless verification 403s and zero Google loads. Final stable axe findings are only the same two homepage portfolio controls, at each of the four widths. All other final route/width axe runs have zero violations.
- `controller-review/final-*.png` and `form-*.png`: final screenshots at the actual CSS widths. `review-contact-sheet.jpg` is a visual-review convenience crop. Authored logo, photography, typography and form composition were inspected; no design or content overhaul was made.

## Browser residual repair — 2026-10-03

All combined browser findings remained in scope throughout this follow-up; no partial shipment or lowered threshold is proposed. Changes are limited to owning CSS/TSX, supplemental browser tests, and this documentation. Existing checker scripts are unchanged.

| Repair | Owning sources | Behavior |
| --- | --- | --- |
| Intrinsic reflow | `app/home.css`, `app/service-area/city.module.css`, shared `SectionIntro`/`LedgerList`, affected section compositions | Single-column tracks use a zero minimum; narrow headings and the office email wrap. Numbered ledgers and the city trust strip stack below 360px. |
| Photo captions | `CaptionTab`, `KitchenRemodelingHero`, affected photo/filmstrip compositions, homepage capability photos | Captions stay inside their frames; cramped collages/strips stack only below 360px. Every photograph and caption is retained. The decorative tape SVG remains contained in its original photo frame. |
| Previously clipped content | `app/blog/blog.module.css`, `app/recent-projects/portfolio.module.css` | At 195px, topic/project selectors, editorial columns, project details, and carousel controls reflow inside the viewport. No global overflow hiding or page scaling was added. |
| Control contrast and focus | `app/globals.css`, `app/home.css` | Portfolio controls use the existing plaster surface with deep-green text. Their focus ring remains visible after iframe Escape, including when entry began with a pointer. Dark-section focus outlines use cream. |
| Actual hit areas | Estimate, contact, bathroom-estimate, project and blog CSS | Jump link, photo icon, office-email link, phone link, project link and blog-work link meet 44px. The estimate photo icon cannot flex-shrink below 44px. Radio/checkbox glyphs remain unchanged; associated labels provide the hit area. |
| Motion readability | Shared motion CSS, homepage, estimate, contact, kitchen, bathroom, city, blog and portfolio motion owners | Text stays opaque while moving into position. Existing drawings, photo masks, transforms, timing and reduced-motion behavior remain. Portfolio text opacity is constrained in its owning CSS while retaining the existing animation hook. |
| Authored prose | `app/blog/articles.module.css` | Removed the earlier blanket 44px treatment of article-body links. Inline authored prose links retain their normal text flow; the separate article CTA keeps a 44px target and explicit cream text over green. Article bodies/identities and source hashes are unchanged. |

The supplemental test is `tests/round1-browser-residuals.mjs`. It checks all eleven routes at 195/390/834/1440 CSS pixels, with reduced motion at 195px. It scrolls through the complete page and settles before axe, measures associated labels and actual controls, checks text/control clipping as well as document width, and verifies skip/menu/portfolio keyboard behavior. Inline links inside the original `[data-article-body]` prose are explicitly classified separately. Screen-reader-only counters and text reachable inside native horizontal project rails are reported according to their actual role; neither is concealed or removed from the page.

The completed matrix measures **zero document overflows, zero axe violations, zero short actual controls, zero visible text below 14px, zero clipped text, and zero clipped controls across all 44 cases**. All eleven 195px/reduced-motion documents have `scrollWidth === 195`; 390/834/1440 also equal their viewport widths. The matrix measures 2,161 targets, including 136 radio/checkbox label instances. Five short link instances at 834/1440 are explicitly recorded as inline authored prose exceptions, not navigation or standalone controls. The final supplemental runner exits **0** after explicit page cleanup; it runs the same measurements in two isolated pages and retains every assertion.

| Verification in this follow-up | Measured result |
| --- | --- |
| `npm test` | 27 tests passed, zero failed. |
| `npm run build` | Passed; 196 generated static pages. Every build ran with the Tubro server stopped. |
| `npm run typecheck` | Passed on the final production build. |
| Unchanged `scripts/verify-round1-browser.mjs` | Exit 0. All 44 layout cases pass; all 33 motion-enabled axe cases have zero violations. Invalid phone blocked; one intercepted success and exactly one `form_submission`; menu Escape passed. Analytics correctly remains marked unverified without provisioned IDs. |
| `tests/round1-browser-residuals.mjs` | Exit 0. All 44 stable axe/layout/target/font/text-clipping/control-clipping cases pass; no page errors. Skip link, menu Escape, portfolio entry/Escape and restored focus ring pass. |
| `python3 scripts/verify-round1.py http://127.0.0.1:3187` | 103 paths passed; no failures in SSR, canonical/schema, native-form or source-body parity checks. |
| Supplemental interactions | All eleven 360px documents fit. The 195px project dialog has no short/clipped controls and closes with Escape. Estimate jump/photo links work. The article CTA renders cream text on deep green with a 54.5px height. |
| Portfolio color/focus | Deep green on plaster: **5.74:1**; hover sage: **5.38:1**; cream focus ring on the dark section: **15.63:1**. |
| Conservation review | Compared existing `controller-review/final-*.png` with new captures. Logos, photos, type families/scales, normal-width composition and green accent remain. Changes visible at normal widths are necessary target padding, readable captions, focus/contrast, and restored inline prose flow. Narrow-only stacking retains every image and caption. |
| Source review | `git diff --check` passes. No changes to checker scripts, lead/security/replay code, provisioning IDs, source articles/identities, metadata, photos/logos, dependencies or integrations. No new `any`, console logging, debugger, global overflow hiding or page scaling. |

`simplify` was invoked again and returned exit 127 (`command not found`). No matching installed skill was found. The manual simplification/reuse and code review pass is complete; no successful automated simplify run is claimed. Existing long JSX compositions were retained; no new production functions or abstractions were introduced.

Evidence directory: `/var/lib/megaclaw/workspace/tubro-evidence/browser-fixed`:

- `summary.json`, `browser-details.json`, `keyboard.json`: final stable measurements and associated-label/native-glyph rectangles.
- `round1-browser.json`: unchanged checker output; `interactions.json`, `colors.json`, `ssr.json`: supplemental evidence.
- `exit-codes.json`, `build.log`, `typecheck.log`, `tests.log`, `ssr.log`, `checker.log`, `supplemental.log`, `simplify.log`.
- `final-*.png`: all 44 final viewport captures. `mobile-comparison.jpg`, `desktop-comparison.jpg`, `routes-comparison.jpg`, `narrow-contact-sheet.jpg`, `portfolio-controls-focus.png`, `project-dialog-195.png`: visual review artifacts. The original before files remain untouched.
- `first-pass-*` and diagnostic traces retain earlier findings; final files above supersede them. A complete zero-finding matrix was also saved under `completed-matrix-before-cleanup-*` after its runner returned signal 143 during Chromium cleanup. It is not represented as a clean command exit.

Browser commands use the supplied `CHROMIUM_PATH=/var/lib/megaclaw/user-tools/apt/usr/lib/chromium/chromium`, `LD_LIBRARY_PATH=/var/lib/megaclaw/user-tools/apt/usr/lib/x86_64-linux-gnu`, and Playwright/axe modules from `/var/lib/megaclaw/workspace/gary-postlive-parity/node_modules`. Base URL is `http://127.0.0.1:3187`; evidence goes to `browser-fixed`. The build uses the sanctioned public staging sentinel and `VERCEL_ENV=development`; the local runtime signing value is test-only. No real lead or Google assessment was sent.

## Controller-owned combined acceptance

1. **Git Preview analytics and performance:** run the exact Git-linked preview GA/PostHog ingest checks and valid deployed Lighthouse measurements. This patch does not claim provisioned analytics ingest or a new LCP/TBT result.
2. **Deployed CAPTCHA and lead receipt:** test the configured policy-based key on an allowed hostname and exact preview sentinel mode, then verify the controller's marked synthetic lead and delivery labels. No real lead was submitted locally. Lead validation, warm-instance replay guard, existing signing-secret contract and migration metadata are unchanged from `ff69dba`; no KV or other storage dependency was introduced.
3. **Careers:** résumé-byte upload is implemented using the existing supported MEGA endpoint. Local tests mock signing, byte PUT and the lead destination; the controller must verify a marked harmless résumé actually persists and is claimed by the application on sanctioned Git-linked Preview. See [the upload handoff](round1-resume-delivery.md). Filename-only delivery no longer meets or describes the accepted scope.

The dependency audit previously reported baseline PostCSS/Next transitive advisories. This browser repair does not change dependencies or suppress that audit.

Controller next step: review this exact local commit, then use the existing staging workflow for exact Git-linked preview acceptance. No push, PR, merge, deployment, DNS or task write was performed. Full combined go-live acceptance remains with the controller; browser residuals are not excluded from it.
