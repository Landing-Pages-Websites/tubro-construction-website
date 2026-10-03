# Careers résumé-byte delivery — combined round1 handoff

This implements the current director ruling on the existing `fix/golive-r1` branch after browser fixes (`91b3b7f`). It supersedes the older report's filename-only scope; it is not a new fixround. The supplied isolated checkout was retained. No push, PR, merge, deployment, task write, remote lead, credential lookup, provisioning or storage creation was performed.

## Implemented behavior

- The careers form retains Measured Living Direction A, existing native selection, contact consent, typography and browser fixes. The label and chooser are at least 44px high; support text remains 14px. One PDF, DOC, DOCX or TXT up to **25 MiB** is accepted. RTF, empty, oversized, unknown extensions and incompatible/executable MIME declarations fail before signing. Empty browser MIME is mapped only for those four known extensions.
- The form obtains a fresh `lead_submit` token first. Its SHA-256 hash goes to signing; the original token is preserved. A second clean, connected invisible Enterprise widget renders and executes **`lead_upload`**, then is disposed. Production signing rejects a submit-action token. The exact sanctioned staging sentinel and existing environment/hostname policy are preserved, including local development mode; production hostname rules are unchanged.
- `POST /api/lead/upload-url` reuses bounded JSON reading with a 4 KiB limit. It verifies the upload CAPTCHA **before** requesting `https://analytics.gomega.ai/submission/upload-url`. The customer and site IDs are fixed server values matching the existing lead boundary. User-supplied identities never control routing.
- The signing response must contain exactly one upload with matching MIME and byte count, an owned `lead-uploads/pending/<customer>/...` key, and a signed HTTPS Amazon S3 URL matching that key. The server HMAC capability binds the exact key set and submit-token hash using the already-provisioned `LEAD_UPLOAD_SIGNING_SECRET`.
- The browser PUT sends the actual `File` body with the exact signed `Content-Type` and `If-None-Match: *`. It never manually sets `Content-Length`; the browser derives it from the body. Only PUT 2xx produces a declared key. No file bytes, base64 or file contents enter JSON, source, logs, analytics or browser storage.
- Lead forwarding retains the explicit field allowlist. Only the validated capability helper supplies `form_data._mega_uploads`; supplied keys never enter through a spread. Nonempty unauthorized claims are denied with verification 403. A failed PUT can declare the empty subset. Filename is supplemental, and server-owned `resumeUploadStatus` distinguishes uploaded from not sent.
- Signing denial, malformed/short signing responses, unavailable signing tokens and failed PUT all allow the enquiry to continue **without attachment claims**. Success plainly says the résumé was not sent and supplies `mailto:workorders@tubroconstruction.com`. The selected file stays in browser memory on upload or submission errors. Attached success says the résumé uploaded with the application and notes that scanning may delay email availability; PUT is never represented as a passed scan.
- The existing synchronized submission lock covers token acquisition, signing, PUT and forwarding. Rapid clicks create one signing attempt and one lead request. `window.dataLayer.push({ event: 'form_submission' })` still runs only after confirmed lead success.

## Fallback and replay boundaries

GET challenge issuance and payload-bound proof retain their existing contract. A valid proof can deliver a lead after a failed `lead_submit` assessment; it cannot authorize signing or unsigned/foreign attachment keys. A legitimately signed capability remains bound to the actual submission token even on this fallback path.

Capabilities expire after 15 minutes, allowing upload time while bounding retained claims. A synchronous warm-instance map stores at most 100,000 hashed capability claims, refuses capacity overflow without evicting fresh claims and retains each through capability expiry. Concurrent reuse is denied before forwarding; a fresh proof cannot bypass that claim. This is **not distributed replay prevention**. MEGA owns the persisted one-lead object claim and scanner behavior; those upstream properties were taken from the supplied canonical contract and are not independently certified by these local mocks. No KV dependency was introduced.

## Verification and evidence

Evidence: `/var/lib/megaclaw/workspace/tubro-evidence/resume-upload/`.

The tests execute actual TypeScript helpers and API handlers with network interception. Coverage includes exact byte length/body, Content-Type/If-None-Match and absent manual Content-Length, post-PUT key declaration, fixed IDs, one-file and size/type limits, malformed responses, signing failures, token order and action separation, exact preview policy, capability tampering/wrong binding/unknown keys, signed proof fallback and replay, and a complete client → signing handler → byte PUT → lead handler → mocked destination flow. Existing strict phone/email, analytics, proof and migration regression tests remain in the suite.

The browser runner is `tests/careers-upload-browser.mjs`; checker scripts are unchanged. It uses the previously supplied absolute Chromium binary and library path, plus existing Playwright/axe modules under `gary-postlive-parity/node_modules`. No browser or system dependency was installed. All external browser requests are blocked; signing, PUT and destination are intercepted. The marked fixture is 79 bytes and contains no real applicant information.

| Check | Measured outcome |
| --- | --- |
| `npm test` | 43 passing tests, including the original regressions and new upload contracts. Final standalone log: `tests-final.log`. |
| `npm run typecheck` | Passed, exit 0 after the final production build; `typecheck.log`. |
| `npm run build` | Passed, exit 0; 197 generated pages/boundaries including the new signing route. Build used the sanctioned public sentinel and `VERCEL_ENV=development`; `build.log`. No app server was running during the build. |
| Local Chromium interactions | All 11 cases completed: attached success and failed PUT at 195/390/834/1440; destination failure/retry, signing refusal and short response at 390. Mock PUT bodies were exactly 79 bytes with the signed headers. All repeated activations yielded one attempt, and only successful lead delivery emitted one conversion. |
| Rendered axe and layout | 15 audits across idle, attached and failed states: zero violations; no horizontal overflow at any width. Native chooser and associated label measured at least 44px high; file text was 14px. |
| Screenshots | `careers-<width>-<state>.png`, matching `form-<width>-<state>-final.png` crops and `review-<width>.jpg` reviewed at all four widths. Capture clears audit focus and returns to the top so fixed navigation is not painted over the form. |
| Diff/scope | `git diff --check` passed. No checker, dependency, global CSS, image/logo, SEO, migration, production policy, challenge/proof contract or existing lead-route changes. |

`browser-results.json`, `summary.json` and `browser-final.log` contain the final complete matrix. **The browser process returned signal 143 during final Chromium cleanup, after all 11 assertions and the evidence write completed.** This is not represented as a clean command exit. An earlier retry harness waited on a generic alert too early; it now waits on the specific form destination-error message. The focused retry rerun passed with exit 0 (`retry-browser.log`). The unit suite was then rerun separately from Chromium cleanup.

Runtime used `http://127.0.0.1:3187` with a local test-only signing value. Chromium was `/var/lib/megaclaw/user-tools/apt/usr/lib/chromium/chromium`, `LD_LIBRARY_PATH=/var/lib/megaclaw/user-tools/apt/usr/lib/x86_64-linux-gnu`. `browser.log` and earlier form crops retain diagnostic captures; the final files named above supersede them.

## Review and simplification

Manual security/data-integrity and simplification review checked the explicit upstream allowlist, HMAC binding, host/action boundaries, ownership, fallback behavior, capability expiry, byte-only PUT transport, metadata shape and single submission lock. Shared validation and bounded JSON reading are reused. All new functional helpers are at most 30 lines, with explicit exported return types and no `any`, console logging or debugger. The existing large `LeadForm` JSX composition was preserved rather than refactored into unrelated components.

`simplify` was invoked and returned exit 127, `command not found`; the skill/command search found no installed implementation. The manual pass is complete; no automated simplify success is claimed. Controller retains independent shipping review.

## Controller-owned Preview acceptance

Use the existing Git-linked staging workflow after reviewing the scoped commit. On a sanctioned Preview hostname, send a harmless marked résumé through careers and verify the persisted object's bytes, the application's `_mega_uploads` ownership/claim and eventual scan-gated attachment availability. Production Enterprise behavior must be exercised separately with real action-specific tokens on an allowed hostname.

No local capability gap was found when implementing and testing the supported contract. Customer enablement, deployed CORS, signed response details and actual persistence have not been remotely measured in this task; they are not asserted to be blockers. If Preview returns a platform failure, capture the exact status/response and stage (signing, PUT, claim or scan) without exposing signed URLs or tokens.
