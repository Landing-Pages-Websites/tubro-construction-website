# Tubro go-live blocker repair — staging handoff

Branch: `fix/golive-r1`. Baseline: `fc61cb10d027bb6cb4ce63b115c388798799c47a`. All work stayed in the supplied isolated checkout. No push, PR, merge, deployment, task mutation, DNS change, credential access or real lead submission was performed. Controller retains review and staging deployment ownership.

**Code repairs and local server checks are complete. Browser and deployed integration acceptance are not certified.** Chromium failed its single short launch with missing `libnspr4.so`; no browser/system dependencies were installed or retried. “Browser screenshots unavailable — bootstrap gap.” Consequently there are no new measured Lighthouse LCP/TBT values or browser axe/reflow/keyboard results. Existing before screenshots were not modified.

## What changed

| Area | Owning files | Result |
| --- | --- | --- |
| SSR and semantics | `app/layout.tsx`, page/layout main elements, `MobileEstimateCta.tsx`, privacy composition | Children render normally under the retained PostHog provider. Only the URL-dependent mobile CTA has bounded Suspense. Common skip navigation targets a focusable main. Mobile CTA is a landmark; privacy headings no longer skip h2. |
| Complete migration | `content/blog/*.md`, `_inventory.json`, `src/lib/blog-posts.ts`, `app/[legacySlug]/page.tsx`, `app/blog/*`, `app/sitemap.ts` | 54 recovered articles, 13 faithful authored exports, two preserved nonarticle legacy pages. Exact original/required paths serve directly; the reader uses the real Markdown source. Full source/body hashes and precise targets cover 87 URL records. |
| Article metadata | `src/lib/article-metadata.ts`, `article-schema.ts`, `seo.ts` | Original dates and stable identities; one BlogPosting per article, unique canonical destination. Short SEO strings are separate from complete visible editorial text. |
| Lead boundary | `app/api/lead/route.ts`, `src/lib/lead-{policy,server,validation,challenge,client}.ts`, `leadProof.ts` | Exact staging sentinel and sanctioned host/environment checks; production exact allowlist fails closed. Enterprise assessment checks token/action/host/score. Bounded JSON stream parsing, required fields, allowed options, boolean consent and fixed upstream customer/site/source prevent spoofing. |
| Lead UI | `useEstimateForm.ts`, `estimate-fields.ts`, `submission-lock.ts`, `EstimateField.tsx`, the three form components, `EstimateStatusNote.tsx` | Native required/pattern/action/method match actual canonical field keys. Client and server share validation; HTML v-mode patterns compile. Synchronous lock prevents duplicate calls and conversion is emitted only after confirmed success. Separate inline phone/email errors and recoverable failures; inputs retained on errors. |
| CAPTCHA | `recaptcha-client.ts`, `RecaptchaBootstrap.tsx`, proof helpers | Interaction loads real Enterprise code and executes `lead_submit`; no placeholder token. Loader failure can use an HMAC-signed, host-bound challenge with payload-bound work, age checks and an atomic one-use claim. Development-only memory replay store; hosted fallback requires durable storage and signing configuration. |
| Analytics | `GoogleAnalytics.tsx`, `PostHogProvider.tsx` | GA forwards official Arguments objects, config disables its initial automatic view, explicit initial/navigation views are deduplicated locally. The official PostHog SDK provider stays mounted, defers initialization and explicitly captures pageviews with bot filtering disabled for browser verification. Provisioned public IDs remain environment driven. |
| Embed/performance | `DeferredPortfolio.tsx`, `GalleryA.tsx`, `RealWorkPortfolio.tsx` | Live iframe mounts within 200px of the viewport or interaction, with reserved dimensions, explicit keyboard entry, skip control, visible frame focus and Escape return. Existing RealWork configuration and integration retained. No live performance claim. |
| Accessibility | Existing route CSS/modules and shared components | Supporting text raised to at least 14px at source; deeper existing green for small text/cream CTAs; inactive index opacity fixed. Expanded link/control/label targets without enlarging radio glyphs. Intrinsic form width and narrow layout repairs; offscreen motion thresholds avoid unreachable large sections. |
| Discovery | `public/manifest.webmanifest`, `public/llms.txt` | Manifest linked in layout; truthful business name, phone and service regions in shared LocalBusiness/Organization schema. No fabricated address or rating. |

The exact file manifest is in [`round1-changed-files.txt`](round1-changed-files.txt). Detailed extraction/identity decisions are in [`round1-migration.md`](round1-migration.md). No authored project-photo names, logos, design references/artifacts, checker scripts or provisioning IDs changed. Existing JSON posts remain provenance; they no longer supply abbreviated article bodies.

## Checks actually run

| Check | Actual outcome |
| --- | --- |
| `npm ci` | Passed on both baseline and final lockfile. Markdown rendering/sanitizing packages and sanitizer types were added through npm. No browser/system installation. |
| `npm run typecheck` | Passed on the final source. First clean-checkout attempt lacked Next's generated image declarations; the build generated them without changing image names, and subsequent checks passed. |
| `npm run build` | Passed, 196 generated static pages plus the existing dynamic boundaries. Local build used `VERCEL_ENV=development` and the sanctioned public CAPTCHA sentinel. No analytics IDs or secrets were supplied. |
| `node --test tests/*.test.mjs` | 16 passing tests. Includes actual API handler with mocked network, malformed/oversized payloads, invalid phone/email/consent/options, identity spoofing, staging/production hosts and tokens, Enterprise execution/assessment, signed proof tampering/age/host/replay, synchronous lock, GA Arguments/navigation, explicit PostHog capture, all identities and faithful 13-post exports. |
| `python3 scripts/verify-round1.py` | 103 paths passed against the local production server. Direct 200 status, no migration redirects, raw h1/main/forms, native field contracts, metadata bounds/social tags, canonical/article schema checks, complete source body hashes, link counts and table counts. |
| DOM/HTML accessibility inspection | 11 key routes passed heading order, one main target, image alt presence, control labels and duplicate-id checks. This is not axe or rendered contrast/reflow testing. |
| Asset checks | 114 downloaded editorial images plus manifest, llms, robots and sitemap: 118 local HEAD requests returned 200. All original editorial image bytes decoded successfully. Contact sheet reviewed; actual rendered crops remain unverified. |
| Source color calculations | Home small green on plaster: 5.74:1; cream CTA text on action-deep: 6.09:1; portfolio index on sage/plaster: 6.39:1 / 6.81:1. Rendered axe contrast still requires the browser. |
| `git diff --check` | Passed. Protected-path diff is empty. New boundary code has no `any`, debugger or console logging. |
| Browser launch | Failed once: `libnspr4.so: cannot open shared object file`. No retry or dependency installation. |
| Lint | Not run: the repository has no lint script. Next's build output is not represented as a separate passed lint command. |

Evidence directory: `/var/lib/megaclaw/workspace/tubro-evidence`.

- `round1-ssr.json`: per-path status, metadata, schema and body parity.
- `round1-migration.json`: source selector, original hashes, word/link/table counts.
- `round1-dom-a11y.json`: eleven-route DOM checks and native fields.
- `round1-assets.json`, `round1-color-tokens.json`.
- `round1-unit-tests.log`, `round1-build.log`, `round1-typecheck.log`, `round1-browser-bootstrap.txt`.
- `legacy-image-index.jpg` and `.json`: original editorial-image index, not browser screenshots.

## Review and simplification

Manual reuse/simplification and security/data-integrity review were completed before commit. Shared validation, field collection, metadata, schema and lock helpers replace duplicated behavior; error announcements were consolidated. Review found and fixed stale blog motion targeting, duplicate phone/email error ids, HTML pattern v-mode escaping, residual index opacity and Duda indentation-as-code conversion. New functional helpers remain small; pre-existing long JSX compositions were retained to conserve the authored design rather than broadly refactored.

The requested `simplify` executable/skill is not installed or exposed in this session (`command -v simplify` returned none; skill/command search found no implementation). The manual pass is documented honestly and is not claimed as a successful invocation of that unavailable command. Independent bot review remains controller owned.

## Remaining acceptance and configuration gaps

1. **Browser verification and performance:** all 11 routes still need the controller's full browser sweep at 390/834/1440, 195px equivalent zoom, reduced motion, interaction, focus/iframe Escape, and rendered contrast/target checks. No local screenshot or mobile LCP ≤6000ms / desktop TBT ≤200ms result can be claimed. SSR restoration, deferred PostHog initialization and 200px embed deferral address identified causes; they do not substitute for measurements. `scripts/verify-round1-browser.mjs` supplies the local screenshot/axe/overflow/intercepted-form checks and optional actual ingest assertions using `EXPECTED_GA4_ID` / `EXPECTED_POSTHOG_KEY` from the provisioned environment for a bootstrapped environment; it was syntax-checked, not executed.
2. **Actual analytics ingest:** public provisioned env IDs were not supplied for this build, and none were read from credentials or hardcoded. Unit tests prove real call paths, not `/g/collect` or PostHog ingest. Controller must assert exactly one initial and navigation event on the exact Git-linked preview with its provisioned IDs, including GA enhanced-measurement configuration, and confirm no iframe duplicate events.
3. **CAPTCHA deployed proof:** controller must verify the preview's automatic `VERCEL_URL`/`VERCEL_BRANCH_URL` matches its sanctioned Tubro project hostname and the public sentinel is scoped to preview/development. Production requires a real Enterprise site key/project/API key and nonempty exact `RECAPTCHA_HOSTNAMES`. An arbitrary nonempty token never authorizes a staging request.
4. **Durable fallback:** hosted proof fallback fails closed with 503 unless `LEAD_PROOF_SECRET` and `KV_REST_API_URL`/`KV_REST_API_TOKEN` are configured for an approved atomic replay store. Runtime configuration was not inspected. No store was provisioned. The actual protocol passed local tampering and replay tests; production availability is not claimed. Verify/configure the existing approved store through the controller before certifying fallback acceptance.
5. **Careers attachments:** the legacy public Duda page has a real Duda file-upload widget. This repository has no approved byte-upload integration. The form therefore retains the explicit filename-only disclosure and email follow-up, in both initial and success states. No uploaded-document delivery or new storage is claimed. Restoring actual upload parity requires an approved integration outside this code-only round.
6. **Lead delivery:** no real lead was submitted. All successful handler tests replaced the destination with a mock; invalid local requests never reached it. Controller owns marked staging submission and downstream receipt proof.

The dependency audit also reports baseline PostCSS/Next transitive advisories (npm suggests a Next major upgrade). No unrelated framework major upgrade or audit suppression was performed; this is recorded for review, not represented as a new go-live measurement.

Controller next step: review this exact commit, push/merge via its existing staging workflow, then run the exact Git-linked preview acceptance. No acceptance threshold was weakened and no checker changed.
