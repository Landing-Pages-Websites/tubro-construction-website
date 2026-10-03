# Careers résumé delivery — combined round1

Work remains on the supplied isolated `fix/golive-r1` checkout, starting at `91b3b7f`. No remote actions, credentials, provisioning, storage, checker, SEO or migration changes.

Design read: preserve the Measured Living Direction A careers composition and native file selection for trade applicants; change only the upload limits, attachment outcome and direct email fallback. Keep 14px support text, 44px controls and 195px reflow.

Implementation sequence:
1. Add executable contract tests for actual bytes, signed headers, upload authorization, independent CAPTCHA actions, malformed responses, fallback and replay.
2. Implement the existing MEGA signing endpoint with fixed identities, bounded JSON and one PDF/DOC/DOCX/TXT up to 25 MiB; bind returned keys to the submit-token hash with the existing server secret.
3. Submit-token first, upload-token second in clean action-specific widgets; PUT bytes, then declare only successful keys. Preserve the submission lock and retain browser files on failures. Keep GET proof fallback and reject unauthorized attachment claims before forwarding.
4. Run tests, typecheck, production build and local Chromium/axe at 195/390/834/1440. Review/simplify, document actual evidence and commit only.

The canonical upload helpers, capability, forwarder, hook, signing route and upload tests were read from `/var/lib/megaclaw/workspace/tmp/grey-lead-pow-reference`. The platform is responsible for persistence, scanning and one-lead attachment claims; local verification uses mocked signing, PUT and lead destinations. The controller owns sanctioned Preview proof of persisted bytes.
