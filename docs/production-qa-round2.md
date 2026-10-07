# Production QA round 2 — local repair record

This records the preceding repair at `cc3a33e`. See [the residual repair record](production-qa-residuals.md) for the subsequent two full authored exports (71 Markdown files, still 69 articles), form declarations, remaining probe-contract finding, and current validation.

Scope: `fix/tubro-production-qa-round2-20261007`, based on `e2da0b0d2b0dfe4de0600271bd0cd10fedb4abfa`. Local commit only. No push, PR, review request, deployment, provisioning, notification change, external lead submission or credential access was performed. The controller owns remote delivery and production verification.

## Repair plan and design constraint

Read the required customer delivery, forms/tracking and frontend design skills first. Repair the existing Tubro marketing site for homeowners without changing its authored palette, typography families, imagery, layout, copy or conversion narrative. Sequence: failing lead regressions → approved fallback and form validation → source inventory reconciliation → targeted content/accessibility repairs → local checks → simplify/self-review → local commit.

## Punch-list results

| Item | Repair and actual local evidence | Controller verification still required |
| --- | --- | --- |
| Exact ten-digit phone and separate email | Shared HTML pattern removes optional country code. SSR `name=email type=email` requires an alphabetic TLD of 2–63 characters; `name=phone type=tel` permits spaces, periods, hyphens and area-code parentheses but exactly ten digits. Actual rendered control patterns and application validation tested together, including `me@x`, nine digits, eleven digits and `+1`. All 27 served forms expose these patterns. | Real desktop/mobile browser validation and inline error/focus behavior. |
| Required fields and malformed/unsupported submissions | Server accepts only the 27 actual form keys. Rejects malformed/oversized JSON, unexpected top-level or form-data keys, invalid project choices, missing required fields/consent and missing careers résumé filename. Existing home/bathroom forms retain their existing consent contract. Tests cover every form key, including all 19 areas. | Live negative submissions without delivery or conversion. |
| CAPTCHA and standard fallback | Restored timestamp-only GET and existing payload-bound `lead-pow-v1` verifier. Removed custom signing, KV and process-memory claiming code. Added a shared honeypot to every form. Enterprise action, hostname, score and risk checks remain. Client falls back after script/execute failure or explicit server verification failure; the rejected CAPTCHA token is omitted from the fallback request. | Live Enterprise and client/server CAPTCHA-failure flows, using provisioned standard vars. |
| Durable proof claim and honest success | Keystone receives the canonical Tubro body plus a server-built claim. Strict marked JSON success, permanent refusals, replay across handler instances, missing token, malformed/unmarked 2xx, identical retry bytes/ID and bounded transport/5xx failures are covered by isolated handler tests. No external lead was sent. | Confirm receiver storage/claim atomicity, one lead, existing recipient delivery, and returned lead ID with controller-classified leads. |
| Duplicate guard and analytics | Existing synchronous submission lock and manual `form_submission` event are preserved. Actual hook tests cover validate-before-requestSubmit, invalid attempts, rapid duplicate activation, failure/retry and exactly one conversion after confirmed success. | Browser dataLayer plus actual analytics ingestion under existing site IDs. |
| Inventory and identities | Standard loader accepts the corrected inventory without edits to the validator. Every original source record, URL, hash, body audit field and identity is retained. All 54 distinct legacy article body hashes, link counts and table counts match the prior recovery audit in served HTML. All 69 real articles have route/schema identity parity; 104 canonical sitemap URLs include the entire blog. | Live sitemap, canonical routes, root alias and independent migration sweep. |
| Internal/external links | Corrected the outdoor-living article’s owning link to `/keys-to-open-communication-with-your-contractor`, retaining the body. All 38 distinct internal paths linked from article bodies returned 200. Seven reported unreliable directory hyperlinks became plain directory labels; all legacy list entries remain. Other directory destinations were left unchanged. | Live affected routes; external directory availability can change. |
| Missing image alt | Inspected `legacy-4034d1975020b4a6.png` at source resolution: it shows palm trees against a pale blue/golden sky, not a bathroom. Added that truthful alt in the owning Markdown. Every image in all 105 checked HTML pages has an alt attribute. | Browser accessibility sweep and actual crops. |
| Painting palette semantics | Controller axe found serious `aria-prohibited-attr` on the labeled palette span at desktop, tablet and mobile. Added `role="img"` to expose its existing accessible name. The label, three swatches, CSS, art and visible copy are unchanged. Focused SSR regression fails without the role and passes with it. | Controller final responsive screenshots and browser accessibility evidence. |
| Scroll contrast | Removed opacity from general-contractor reading-content animation frames. Existing composition colors remain; motion only translates text. Tests exercise paused/before-entry, playing, finished and reduced-motion states. Shared SiteMotion was inspected and already uses translation without text fading. | Contrast during incremental scrolling, including reduced motion; full-page screenshots alone are insufficient. |
| Touch targets | Real anchor boxes now have 44px minimum heights for the about office links, bathroom phone, blog “Explore our work”, contact office-email link, general-contractor phone/email, painting phone/email, and mobile estimate-start link. Existing shared input/radio/checkbox label targets were inspected; consent labels retain explicit 44px sizing. No pseudo-targets or blanket padding added. | Measure exposed boxes at 360px, tablet and desktop; verify keyboard/focus states and overflow. |
| Typography | General-contractor service-area text and form labels increased from 13px to 14px. Painting hours, email and caption increased from 12px to 14px. Source CSS scan found no remaining explicit body/form font sizes below 14px; decorative SVG ruler numerals retain their original design. | Computed text-size check in the live browser. |
| Small-bathroom image | Existing S3 image returned 200/image-webp (28,888 bytes); inspected the original. Empty Next image configuration caused the optimizer rejection. Added an HTTPS remote pattern restricted to the exact existing customer asset with no query string. The actual local optimizer request at `w=1920&q=75` returned 200/image-webp. No replacement asset or analytics change. | Browser route load with image decoded and no site request/page errors; ignore Google keepalive aborts with 204 as instructed. |

## Truthful inventory contract

The original 87 discovery records mixed 55 article URL records with 32 nonarticles. Two of the 55 article records address the same Washington kitchen-cost article. A nonarticle retained at HTTP 200 cannot truthfully use the standard `excluded` article contract, which requires a real 301/308 to another destination. No such redirects existed, so none were invented.

- `posts`: **69 distinct articles**, comprising **54 migrated legacy articles + 15 authored articles** (13 existing Markdown exports plus the two existing structured articles).
- `posts_found`: **69**, exactly the number of `posts` entries.
- `posts_migrated`: **54**, exactly the standard loader's legacy parity rows.
- `posts_with_item_id`: **54**, the loader's identified legacy parity rows. Across all articles, **67 have existing MEGA item IDs**; the two structured articles retain their existing renderer identities.
- `retained_pages`: **32 nonarticle records**, `already_present`, HTTP 200, original URL/hash retained. Two retain their existing legacy page item IDs and bodies (`/backlinks`, `/Bathroom-Remodels-Kent-WA`).
- `aliases`: **1 HTTP-200 root alias**, `/kitchen-remodel-cost-washington-state`, with the existing canonical `/blog/kitchen-remodel-cost-washington-state` and `item_q2fvf282v44npyrpr5bgbybjrr` unchanged.
- **87 original source records remain** across 54 legacy `posts`, 32 `retained_pages` and one `aliases` entry. **Zero excluded/redirected articles**. Source fixture regressions compare every original field, preserving the previous disposition explicitly where reclassified.
- **69 article identities + 2 legacy page identities** remain served. The prior 69 Markdown files and 13 authored-export provenance entries remain intact.

Evidence comes from the prior production recovery record in `docs/round1-migration.md`, the base-commit inventory (archived as a regression fixture), original source/body hashes, and current served-body comparisons. The standard `golive_sweep._validated_inventory` was invoked read-only and passed with counts `69 / 54 / 54`. Existing validators/checkers were not modified.

## Approved fallback wire contract

`GET /api/lead` returns only `{ "issuedAt": "<13 digits>" }`, with `Cache-Control: no-store`, on sanctioned hosts. The browser sends `powIssuedAt` and `powNonce`. Existing `lead-pow-v1` SHA-256 work binds the sorted full payload (including raw form data, form key, attribution and timestamp), difficulty **16 leading zero bits**, maximum age **90 seconds**, with the existing **5-second future clock tolerance**. CAPTCHA token/action and nonce fields are excluded from the hash as in the existing algorithm. Honeypot values fail authorization even with a valid proof.

Fallback delivery uses `POST https://analytics.gomega.ai/submission/submit` with:

- `customer_id`: `b002784f-9543-4362-8814-b7da19078f23`
- `site_id`: `f28d515e-437b-4f9b-96c4-bc1a79a3357c`
- `source_provider`: `website-tubroconstruction`
- Existing `form_key` and canonical `form_data`, without explicit recipients.
- `proof_claim = { issued_at, nonce, email, attempt_id }`, where `email` is the exact raw `form_data.email` covered by verification. Only the server supplies claim fields; `crypto.randomUUID()` mints the attempt ID once per inbound fallback POST.
- Server-only `x-mega-proof-claim-token`, sourced from trimmed, shape-checked 64-hex `LEAD_PROOF_CLAIM_TOKEN`. Missing/invalid configuration fails closed with 502 before forwarding. No signing secret, KV store or other new resource prerequisite.

A fallback succeeds only on 2xx JSON with `ok === true` and the exact string marker `proof_claim === 'claimed'` or `'retry'`. HTTP 400/401/403/409 are permanent refusals without retry. Unmarked, malformed or false-success 2xx fails closed without retry. Transport failures and 5xx permit at most **two 25-second attempts**, reusing identical body bytes and attempt identity; the browser allows 60 seconds for the bounded server operation. There is no process-memory replay guard: the existing receiver owns the durable, transactional claim.

The server sets `form_data.spamCheck` to `Passed reCAPTCHA` only for accepted CAPTCHA, or `Unverified: reCAPTCHA did not pass; passed fallback check` for fallback. Caller-supplied `spamCheck`, claim/token/attempt overrides and unsupported fields are rejected. A constrained upstream `id`, when supplied, is returned safely with success for controller verification. Uncertain delivery never automatically becomes a new fallback submission.

## Checks actually run

- `npm ci`: passed.
- `npm run typecheck`: passed after build generated Next's ignored image declarations. The initial pre-build run reported missing static-image declarations; no source/checker workaround was added.
- `node --test tests/*.test.mjs`: **passed, 51 tests, zero failures**.
- `npm run build`: **passed**, including type validation and all 198 generated pages, after the final source edits.
- `npm run verify`: **FAILED: 310 existing artifact schema mismatches**. `public/design/pages/*/section_implementation.json` uses an existing shape the checker does not recognize as `section_id`/`owner_component`, so it reports missing sections and undefined component owners. `scripts/verify-build.mjs`, `scripts/site-routes.mjs`, `public/design` and `site_build` are byte-unchanged from the requested base (`git diff --exit-code <base> -- ...` passed). No generator, checker fix, weakening or unrelated manifest rewrite was performed. This check is not claimed green.
- `node tests/production-round2-html.mjs`: **passed: 105 local routes, 27 forms, 69 articles, 104 canonical sitemap URLs**, original legacy body/link/table parity, one Article/BlogPosting schema per article, labels/HTML patterns/all image alts, retained pages and root alias, corrected link and 1920px image optimizer response.
- Read-only local article link traversal: **38 distinct internal paths, zero non-200 responses**.
- Unmodified standard inventory loader: **passed**.
- The initial Chromium launch failed on `libnspr4.so` because the launch environment omitted the existing library path. The controller subsequently launched Chromium successfully with `LD_LIBRARY_PATH=/var/lib/megaclaw/user-tools/apt/usr/lib/x86_64-linux-gnu`, executable `/var/lib/megaclaw/user-tools/apt/usr/lib/chromium/chromium`, `--no-sandbox`, and a 10-second launch timeout. This was an environment issue, not missing bootstrap dependencies; none were installed. The controller owns final screenshots and browser evidence.
- Precommit simplify/self-review: shared honeypot; small single-purpose delivery helpers; removed obsolete signing/KV code; separated motion setup/cleanup helpers; strict claim marker types; no new `any`, debug logging, dead code, credentials or unrelated artifacts. Existing large JSX compositions remain scoped to the specified repairs. `git diff --check` passed.

## Palette follow-up validation

Based on `5a5015ac7e59ab14b929facdcf219284ef01cf93`. This follow-up changes only `src/components/sections/PaintingHero.tsx`, `tests/painting-hero-accessibility.test.mjs`, and this record. All previous form, migration, CAPTCHA and security repairs are preserved.

- `node --test tests/painting-hero-accessibility.test.mjs`: failed first on the missing image role. After the one-attribute repair, `node --test tests/*.test.mjs` passed **52 tests, zero failures**, including the new regression.
- `npm run build`: passed, **198 generated pages**. `npm run typecheck`: passed. `git diff --check`: passed.
- `npm run verify`: still **FAILED (310)** with the previously documented artifact schema mismatches. The checker, route script, `public/design`, and `site_build` remain byte-unchanged from the follow-up base; no checks were weakened.
- Isolated Chromium verification used the successful controller launch environment above and `http://127.0.0.1:43187/interior-exterior-painting`. Full default `axe.run()` scans returned **zero violations** at **1440×1000**, **768×1024**, and **360×800**; `aria-prohibited-attr` explicitly passed. At each size, the palette was visible as one image with the exact existing accessible name and three swatches. External browser requests and API requests were blocked; no leads were submitted.
- The first browser harness passed desktop, then timed out waiting for tablet `networkidle`. Rechecking the loaded page after `domcontentloaded` and viewport resizing passed all three sizes. Final screenshots and production browser evidence remain controller-owned.
- `simplify` was attempted but is not installed (exit 127), and no matching skill was found. Manual simplification/code review confirmed a single semantic attribute is sufficient, the test reuses the existing SSR loader/parser, and no styling, dependencies or unrelated source changed.

## Controller handoff

This record describes local evidence only. Before shipping, resolve or explicitly disposition the pre-existing artifact-verification failure, capture responsive before/after screenshots and rendered accessibility measurements, run live Enterprise/fallback/negative/replay/duplicate tests with delivery and analytics verification, obtain org reviewer approval on the exact head, merge normally into production-linked main, and verify the Git-linked READY deployment plus all affected live routes. No production success is claimed here.

## Changed files

35 scoped paths (including the removed obsolete challenge module):

- `app/about-us/about.module.css`
- `app/api/lead/route.ts`
- `app/blog/blog.module.css`
- `app/contact/contact.module.css`
- `app/general-contractor/GeneralContractorMotion.tsx`
- `app/schedule-an-estimate/EstimateRequestForm.tsx`
- `app/schedule-an-estimate/estimate.module.css`
- `content/blog/_inventory.json`
- `content/blog/backlinks.md`
- `content/blog/how-long-does-a-bathroom-remodel-take-in-washington.md`
- `docs/production-qa-round2.md`
- `next.config.ts`
- `src/components/sections/LeadForm.tsx`
- `src/components/sections/bathroom-estimate.module.css`
- `src/components/sections/compositions/FormSplitWithNarrowContactLedger.tsx`
- `src/components/sections/compositions/general-contractor-estimate.module.css`
- `src/components/sections/painting-quote.module.css`
- `src/components/shared/HomepageEstimateForm.tsx`
- `src/components/shared/LeadHoneypot.tsx`
- `src/lib/blog-content/outdoor-living-space-western-washington.json`
- `src/lib/estimate-fields.ts`
- `src/lib/lead-challenge.ts`
- `src/lib/lead-client.ts`
- `src/lib/lead-forward.ts`
- `src/lib/lead-server.ts`
- `src/lib/lead-validation.ts`
- `tests/fixtures/legacy-source-records.json`
- `tests/general-contractor-motion.test.mjs`
- `tests/lead-client.test.mjs`
- `tests/lead-html-patterns.test.mjs`
- `tests/lead-proof-fixture.mjs`
- `tests/lead-route.test.mjs`
- `tests/lead-security.test.mjs`
- `tests/migration-identity.test.mjs`
- `tests/production-round2-html.mjs`
