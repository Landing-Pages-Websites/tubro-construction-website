# Tubro candidate residual repair — 2026-10-07

Base: `cc3a33e20b03bf253aa7528ff678b92f236cf581`, existing isolated feature worktree. Local commit only; the controller owns the new exact-head org review, push, merge, production integration, and final sweep. No endpoint validation, analytics identity, hosting configuration, notification routing, or QA checker was changed.

## Approved scope and execution

Read customer-website-delivery, its implementation/forms references, frontend-design and its production review reference, and the local Superpowers brainstorming/planning/TDD guidance. The supplied task is the approved design: preserve the visitor experience while correcting owning sources. Plan executed: reproduce with failing SSR/content regressions; remove two broken links; declare actual form identities and the client-added résumé filename; export the two complete authored articles into the existing content directory; validate source preservation, build, served HTML and browsers; simplify/self-review; commit locally. No additional feature or visual direction was introduced.

## Repairs

- `/backlinks`: the BizMaker and CGMIMM dead targets became `BizMaker — Tubro Construction` and `CGMIMM — Tubro Construction` plain labels. All 54 list entries remain. Regressions cover all nine reported broken directory targets and their labels.
- Every one of the 27 SSR forms declares exactly one `<input type="hidden" name="form_key" value="…"/>`. The value comes from the same resolved `form.formKey` used by the submission hook. The home, bathroom and dedicated estimate forms use `homepage_estimate`, `estimate_bathroom_remodeling` and `schedule_estimate` respectively; the shared forms retain their existing keys below.
- Careers also declares `<input type="hidden" name="resumeFileName" required="" value=""/>`, synchronized to the selected file name on change and reset with the form. The file picker stays intact. The client continues to explicitly read approved fields, obtain the filename from the selected file, and send boolean consent. It ignores hidden routing metadata and never nests `form_key` or other payload-only fields inside `form_data`. No required consent was added to the home/bathroom contracts.
- Both complete authored article bodies now live in actual owning Markdown files, including every paragraph, heading, list, table and source link. The original JSON/TS files remain byte-identical provenance and are no longer renderer imports. The authored HTML rendering path sanitizes active content while preserving original link attributes, CTA markers and contents navigation. File ordering preserves blog listings and related links. Canonical URLs, publication/modification dates, wording, layouts and exact hero images are unchanged; each route still emits one BlogPosting schema.

## Form declarations observed in served HTML

For every row, the exact declaration is `<input type="hidden" name="form_key" value="KEY"/>`, substituting the existing key below. It is top-level request identity, not a `form_data` field.

| Route | KEY |
| --- | --- |
| `/` | `homepage_estimate` |
| `/general-contractor` | `estimate_general_contractor` |
| `/bathroom-remodeling` | `estimate_bathroom_remodeling` |
| `/custom-home-services` | `estimate_custom_home_services` |
| `/about-us` | `estimate_about_us` |
| `/careers` | `careers_application` |
| `/contact` | `contact_message` |
| `/schedule-an-estimate` | `schedule_estimate` |
| `/service-area/home-remodeling-maple-valley` | `estimate_home_remodeling_maple_valley` |
| `/service-area/home-remodeling-tacoma` | `estimate_home_remodeling_tacoma` |
| `/service-area/home-remodeling-covington` | `estimate_home_remodeling_covington` |
| `/service-area/home-remodeling-renton` | `estimate_home_remodeling_renton` |
| `/service-area/home-remodeling-kent` | `estimate_home_remodeling_kent` |
| `/service-area/home-remodeling-auburn` | `estimate_home_remodeling_auburn` |
| `/service-area/home-remodeling-ravensdale` | `estimate_home_remodeling_ravensdale` |
| `/service-area/home-remodeling-enumclaw` | `estimate_home_remodeling_enumclaw` |
| `/service-area/home-remodeling-issaquah` | `estimate_home_remodeling_issaquah` |
| `/service-area/home-remodeling-bellevue` | `estimate_home_remodeling_bellevue` |
| `/service-area/home-remodeling-newcastle` | `estimate_home_remodeling_newcastle` |
| `/service-area/home-remodeling-black-diamond` | `estimate_home_remodeling_black_diamond` |
| `/service-area/home-remodeling-fairwood` | `estimate_home_remodeling_fairwood` |
| `/service-area/home-remodeling-sumner` | `estimate_home_remodeling_sumner` |
| `/service-area/home-remodeling-bonney-lake` | `estimate_home_remodeling_bonney_lake` |
| `/service-area/home-remodeling-buckley` | `estimate_home_remodeling_buckley` |
| `/service-area/home-remodeling-snoqualmie` | `estimate_home_remodeling_snoqualmie` |
| `/service-area/home-remodeling-north-bend` | `estimate_home_remodeling_north_bend` |
| `/service-area/home-remodeling-sammamish` | `estimate_home_remodeling_sammamish` |

## Identity provenance and truthful counts

Neither structured source contains an existing item ID. Each new file ID was created with the unmodified `blogmig.stableid.item_id_from_entropy(SHA-256(seed_url)[:16])` encoder. The root-URL seed convention was verified against all 13 previous authored exports. These seed URLs are deterministic identifiers, not claims that new root routes or previous MEGA publications exist. Both authored inventory rows retain `old_url: null`.

| Owning file | New stable file ID | Retained original renderer ID | Hash seed |
| --- | --- | --- | --- |
| `content/blog/outdoor-living-space-western-washington.md` | `item_29fa1hpj5b0xv6ffkkp63hjy04` | `structured_outdoor-living-space-western-washington` | `https://www.tubroconstruction.com/outdoor-living-space-western-washington` |
| `content/blog/small-bathroom-ideas.md` | `item_m1q0rt1gex1q3n6yr4ttsffjbg` | `structured_small-bathroom-ideas` | `https://www.tubroconstruction.com/small-bathroom-ideas` |

The inventory records the original source paths and full source-file SHA-256 hashes alongside these identities. The Markdown frontmatter retains `sourceUrl`, `rendererId`, `idSeedUrl`, image/alt, publication/modification date, canonical path and original contents navigation.

- **71 Markdown content files = 67 existing article IDs + 2 new file article IDs + 2 existing legacy nonarticle IDs.**
- **69 articles = 54 legacy + 15 authored**; all now have owning Markdown and valid unique item IDs. There are 15 complete authored-export provenance entries.
- Standard inventory summary remains **69 / 54 / 54** for `posts_found` / `posts_migrated` / `posts_with_item_id`; the latter two are legacy parity counts.
- All **87 original source URL/hash/identity records**, 32 retained nonarticle records, one canonical alias, 54 legacy body audits and existing source oracle remain unchanged. There are no artificial redirects, routes or sitemap entries.
- Of the **69 original Markdown files**, 68 are byte-identical to the base; only the two requested `/backlinks` owning links changed in the remaining file. Both JSON/TS provenance sources and all 13 earlier exported Markdown articles are byte-identical.

## Validation and limits

- `npm run typecheck`: passed.
- `node --test tests/*.test.mjs`: **58 passed**, zero failures. The new tests first failed on the missing SSR identities, missing article IDs and remaining directory links. Tests exercise all 27 actual SSR forms against the real route with an isolated production host configuration, requiring **403 and `code: verification_failed`**, not merely any 403. Unknown/default keys, nested identity, string consent and foreign top-level fields still return 422. The explicit client field reader ignores routing/foreign fields and retains boolean consent and the selected filename.
- `npm run build`: passed, all **198 generated pages**, from an exact source copy at `/var/lib/megaclaw/workspace/tubro-residual-validation-20261007`. The first temporary-copy build hit `/tmp` ENOSPC; moving only that scratch copy to the workspace volume resolved it. No dependencies were installed. The controller's server and build directory were not rebuilt or restarted; validation used port **3289**.
- Unmodified `golive_sweep._validated_inventory`: passed with **69 / 54 / 54**. No QA script was modified.
- `TEST_BASE_URL=http://127.0.0.1:3289 node tests/production-round2-html.mjs`: passed **105 routes, 27 forms, 69 articles, 104 canonical sitemap URLs**, all 54 original legacy body hashes/link/table counts, unique article schemas and exact existing small-bathroom S3 image through the optimizer (200 at 1920px).
- Browser: existing Chromium/Playwright and supplied library path worked. Both article routes have byte-identical full-page before/after screenshots and identical body/contents/image DOM at **360px and 1440px**. Blog index text, links and ordering are unchanged. Visual crops were inspected. No horizontal overflow or undecoded article image.
- Browser: home, bathroom, estimate, contact, careers and backlinks checked at **360px, 768px and 1440px** (18 route/viewport checks). Empty forms were blocked; five real client submissions were intercepted locally, validated against the unchanged server field validator and returned synthetic local success, with exactly one conversion each. The careers hidden filename followed file selection. No lead was delivered externally. Axe on affected forms/backlinks found no serious/critical WCAG A/AA violations. Reposting the five captured canonical payloads locally with all CAPTCHA/proof fields removed returned **403 verification_failed** for each.
- `npm run verify`: still **fails with 310 existing artifact schema mismatches**. The verifier, route artifact registry, `public/design` and `site_build` are byte-unchanged from the base. This check is not reported green.
- Precommit simplify/self-review: shared the resolved hook key rather than repeating literal identities; retained explicit client field selection and strict route validation; kept complete source bodies and existing ordering; reviewed diff, source preservation and tests. No standalone `simplify` command or installed skill was available, so this was an inline simplification review. The controller's fresh org review remains required.

Local browser evidence and the unmodified probe capture are in `/tmp/tubro-residual-evidence/`. Build/unit/HTML/typecheck/verify logs are `/tmp/tubro-residual-{build,unit,html,typecheck,verify}.log`. These are local validation evidence, not production acceptance.

### Historical CAPTCHA probe incompatibility (superseded below)

Read `_declares_form_key`, `_lead_fields`, `_lead_probe_body` and `_fallback_fields` directly in the canonical sweep. The corrected SSR declaration is recognized: a real local `/contact` probe now selects **`contact_message`**. However `_lead_probe_body` also nests the same key inside `form_data` and adds unsupported top-level `company_website`, `company`, snake-case attribution, `context`, `captchaAction`, and other fields absent from the legitimate client contract. The unmodified probe therefore still returns **422 “Unexpected submission field.”** Its generic résumé sample is also not the selected `.pdf`/Word filename required by the actual careers client contract. Accepting those payloads would contradict the requested strict validation/no-duplicate-fields boundary, so neither the endpoint nor checker was changed. The independent exact-wire tests and browser captures prove the site's real contract reaches CAPTCHA; **the sweep's `form.lead-captcha` verdict is not claimed fixed**. The controller must address/review that probe-contract limitation separately.

### Preview parity

No preview parity patch was made. The outgoing host and counts are unchanged. Independent old-host counting is unaskable after production cutover under the sweep's own production logic; the controller owns the production parity check after the reviewed merge.

## Final bounded safety and heading repairs

Base: `a49bb7a`, same isolated feature branch. The supplied scope defines the bounded design: preserve existing content and presentation, restore owned heading targets, and refuse requests with no verification material before schema disclosure. Regressions failed first, followed by minimal repairs, local verification and simplification/self-review. No remote delivery operation or source-secret access; the controller retains PR26, fresh org-bot review on the final head, push, merge, deployment and real integration verification.

- Authored sanitization permits `id` only on `h2` and `h3`, preserving supplied values. Wildcard attributes, event handlers, scripts, frames and extra data attributes remain disallowed. The outdoor export already declared seven `section-1`…`section-7` contents entries but its raw source HTML contained no IDs; its owning Markdown now adds exactly those seven IDs. Removing only these additions reproduces the previous file byte-for-byte. The small-bathroom source has **zero contents entries and no heading IDs**; it remains byte-identical with no invented navigation. Tests for both export paths also preserve custom h2/h3 IDs and reject active attributes.
- Source HTML/text, links, tables, title, dates, image, stable item IDs and provenance remain checked. The JSON/TS provenance sources, inventory and small-bathroom Markdown are byte-unchanged. Existing source-parity assertions now expect exactly the outdoor navigation attributes, with no content exclusions.
- After bounded JSON parsing and the unchanged origin/host check, absence of a nonempty string CAPTCHA token **and** a complete nonempty string proof pair returns **403 `verification_failed`**. This is only a preliminary refusal: purported tokens/proofs still undergo the unchanged field whitelist, then full existing authorization. No schema errors or Enterprise calls occur for credential-free JSON. Unknown/default keys and foreign fields with valid CAPTCHA or payload-bound proof remain **422**, with zero assessment/forwarding calls. Malformed JSON/oversize requests remain **400**; invalid material and honeypots still fail closed. Existing client fallback behavior and all delivery/analytics code remain unchanged.
- Regression coverage includes canonical and foreign tokenless payloads, blank/nonstring tokens, incomplete/invalid proofs, missing and filled honeypots, valid CAPTCHA with unknown fields, and correctly solved proofs covering unknown fields. Existing validation fixtures now contain verification material while retaining their original expected statuses. All 27 SSR wire payloads additionally pass the real field validator, independently of the preliminary guard.

Validation on the final application source:

- `node --test tests/*.test.mjs`: **64 passed**. Subsequent strengthening of the SSR/schema-proof assertions passed all **16 targeted route/SSR tests**.
- `npm run typecheck` and `npm run build`: passed, **198 generated pages**. Build ran from an exact application-source copy under ignored `qa/final-safety/build`, using only existing dependencies. Local server used **43189**; controller port **3278** and its build remained untouched.
- `TEST_BASE_URL=http://127.0.0.1:43189 node tests/production-round2-html.mjs`: passed **105 routes / 27 forms / 69 articles / 104 sitemap URLs**, including unique owned heading targets for every served contents href in both exports. Existing image cache supplied the original optimized image; validation-server external fetches were blocked.
- Existing Chromium launched with the supplied library path, executable, `--no-sandbox` and **10-second timeout**. All seven outdoor links were clicked at **360 / 768 / 1440px** (21 clicks), reaching their unique heading at the existing ~100px scroll offset. Both article routes retained their exact contents lists, had no horizontal overflow and **zero default axe violations** at all three sizes. Screenshots inspected. No dependencies installed.
- Unmodified canonical `check_lead_captcha` against local `/contact` in staging mode: **PASS**, all **10 tokenless probe POSTs returned 403**. Checker SHA-256 was unchanged; its transport allowed only local requests. This supersedes the tokenless 422 finding above, without accepting the probe's foreign fields. Local sanctioned sentinel configuration was confined to development; no production sentinel or external lead submission was used.
- `npm run verify`: still **FAILED (310 pre-existing artifact-schema errors)**. Verifier, route registry, `public/design` and `site_build` remain byte-unchanged from the base. No test/checker weakening. `git diff --check` passed.
- `simplify` was attempted and unavailable (exit 127); manual simplification/code review retained one small presence helper, one shared refusal response and the heading-only allowlist. No unrelated UI, dependencies, forwarding, CAPTCHA assessment, origin or host-policy changes.

Local logs, browser click/axe results, screenshots, checker result/hash and isolated build are under ignored `qa/final-safety/`. These results establish local behavior, not production integration acceptance.
