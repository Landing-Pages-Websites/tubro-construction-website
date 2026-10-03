# Kent legacy-widget remediation

Local work on `fix/tubro-golive-r3`, against immutable baseline
`2f21f130fd37d4b8013713ea1b6451b3e97c5bf6`. Inspected and retained the initial
Markdown repair at `99a96176dd4cb2dad87e7fc25797b0d5b2facd16` and completed the
supplied uncommitted widget repairs. No push, PR, review request, merge, deployment,
task-status change, or lead submission was performed.

The existing long-form Kent service page and site design remain in place. Its five
service photographs now use existing repository assets with subject-specific alt
text. Both copied form states link to `/schedule-an-estimate`; all five services
have one working Learn more label each, without the duplicated inert label. The empty telephone destination now uses
`253-216-2633`. Review navigation targets `/recent-projects#realwork-portfolio`;
location navigation uses existing service-area routes, and all nine addresses
remain plain text. The only editorial change is “fill out the contact form below”
→ “follow the quote link below.” The rest of that paragraph is byte-identical.

`tests/round2-content.test.mjs` retains the original phone occurrence assertions
and original reversal hash, reading Kent with `git show` of the exact immutable
round-2 baseline. New current-state tests independently compare complete
frontmatter, unaffected prose/imagery, headings, citations, visible useful text,
location strings, every other content file, authored source exports, and inventory
against that same baseline. All 67 inventory articles (54 migrated + 13 authored),
Kent ID `item_ptnrv0nzhbtdxx73yr7pde8z9w`, and `/Bathroom-Remodels-Kent-WA` survive.
These tests require the baseline Git object to be available.

## Verification

Evidence directory: `/var/lib/megaclaw/workspace/tubro-evidence/r3` (outside Git).

| Command | Result / evidence |
| --- | --- |
| `node --test tests/round2-content.test.mjs tests/round3-content.test.mjs` | Exit 0; 15 tests; `content-after.log`. |
| `npm test` | Exit 0; 103 tests; `npm-test.log`. |
| `npm run build` | Exit 0; `build.log`. |
| `npm run typecheck` | Exit 0; `typecheck.log`. |
| `npm run artifacts && npm run verify` | Exit 0 in the disposable `checker-copy` evidence directory; 32 page artifacts, 280 asset contracts; canonical static verification passed. Scripts/thresholds are unchanged. No generated rewrites enter the working branch. |
| Browser command below | Exit 0; `browser.log`, `browser-results.json`, `verification-summary.json`. |
| `git diff --check` | Exit 0. |

The contact-direction and duplicate Learn more regressions failed before their
source repairs (`content-before.log`, `learn-more-before.log`). A separate
negative-control run substituted the immutable Kent source in an evidence-only
copy of the new test: seven repair assertions failed as expected, while identity,
visible-text preservation and other-content checks passed
(`content-baseline-negative-control.log`).

Production server: `npm run start -- --port 3195`. The requested preferred port
3194 was already occupied (`server.log`); 3195 started successfully
(`server-3195.log`). No environment files or dependencies changed.

Browser command:

```sh
LD_LIBRARY_PATH=/var/lib/megaclaw/user-tools/apt/usr/lib/x86_64-linux-gnu \
TEST_BASE_URL=http://localhost:3195 node tests/round3-browser.mjs
```

The harness supports `TEST_BASE_URL`, `BASELINE_URL`, and `EVIDENCE_DIR` overrides
for local or deployed verification. It launches the supplied Chromium with a
15-second launch timeout and a 12-minute run deadline, blocks lead and upload
writes, waits for fonts, scrolls to trigger lazy images,
and waits for image completion. It never replaces or removes article content.
Baseline captures use the supplied URL:
`https://tubro-construction-website-6n810dlew-mega-websites.vercel.app`.

The diagnostic first pass is retained in `diagnostic-first-pass/`. Its three phone
findings came from the new harness rejecting valid parenthesized numbers, and its
fetch errors came from an overly broad guard aborting analytics POSTs. The final
harness validates normalized telephone digits and aborts only lead/upload writes;
no page errors are filtered and no integration code changed. Capture scrolling
also now leaves 96 pixels above headings so the existing sticky header does not
cover widget titles.

Final browser results: all **102 sitemap URLs returned HTTP 200 without redirects**.
All 102 were inspected for article bodies: 69 bodies contained 81 images, with
zero missing/broken images, inert form messages or invalid telephone destinations.
Kent passed at 320, 390, 834 and 1440 CSS pixels, height 900, DPR 1: all five service
photos loaded with meaningful alt, no horizontal overflow, visible keyboard focus,
and unchanged article HTML throughout inspection. All 32 keyboard link checks
passed, including 16 arrivals at the estimate form with its six required field
groups, enabled button and invalid empty-form state. The review fragment resolves
to the existing `realwork-portfolio` ID. No submission was attempted; zero lead or
upload requests occurred. There were **zero page errors and zero axe violations**
at every Kent viewport (`axe-kent-{320,390,834,1440}.json`).

Selected exact before/after screenshot filenames, relative to the evidence directory:

| Widget | Before | After |
| --- | --- | --- |
| Quote widgets, 390px | `before-kent-390-intro.png` | `after-kent-390-intro.png` |
| Second quote, 390px | `before-kent-390-quotes.png` | `after-kent-390-quotes.png` |
| Services, 390px | `before-kent-390-services.png` | `after-kent-390-services.png` |
| Services, 1440px | `before-kent-1440-services.png` | `after-kent-1440-services.png` |
| Contact/reviews, 834px | `before-kent-834-contact.png` | `after-kent-834-contact.png` |
| Locations, 1440px | `before-kent-1440-locations.png` | `after-kent-1440-locations.png` |
| Full mobile page | `before-kent-390-full.png` | `after-kent-390-full.png` |
| Full desktop page | `before-kent-1440-full.png` | `after-kent-1440-full.png` |

All six capture types (`full`, `intro`, `quotes`, `services`, `contact`, `locations`)
exist for both before/after at all four widths. Each restored photograph also has
an `after-kent-{width}-{service-route}.png` capture. Visual self-review inspected
all five mobile/desktop image captures, the full mobile page, tablet contact/review
widgets, and desktop locations against the baseline. Subjects match their alt,
links are visibly actionable, addresses remain readable, and existing typography,
logo, article layout, trust imagery and site chrome remain intact.

## Scope and review

Only the five authorized files are included. Shared rendering, CSS, forms,
CAPTCHA, analytics, integrations, dependencies, canonical checkers, and generated
design artifacts are unchanged. Used the assigned isolated worktree and required
customer-website-delivery, frontend-design, web-coding-os and Superpowers guidance.
The bounded design and scope were already specified by the controller.

No executable or installed skill named `simplify` was found in the supplied skills
or local plugin catalogs. The manual simplification pass consolidated duplicated
service labels into single links. Self code review checked
reuse, focused helpers, no dead/debug code, contextual async failures, functions
at most 30 lines, and files under 500 lines (largest function: 21 lines; largest new
file: 324 lines; `code-size-review.json`). `scope-review.json` confirms exactly the
five authorized files changed. This is local builder verification;
the controller owns external review and exact-head Git deployment verification.
