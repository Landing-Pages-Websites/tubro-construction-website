# Project conventions (web-coding-os)

## Stack
Next.js (App Router) + Tailwind CSS v4 + the Mega component library. Use existing
components from the Mega lib / `src/components/ui` before creating new ones.

## Hard rules (auto-fail floors — from WEB director AGENTS.md)
- Vercel project MUST be Git-linked; deploy via git push, never `vercel deploy --prod` CLI fallback.
- ≥6 kebab-case section anchors per LP (#hero #trust-bar #how-it-works #services #faq #form), DOM order.
- Submit buttons: `type="button"` + onClick → validate-first → `form.requestSubmit()`. NEVER raw `type="submit"`.
- Manual `window.dataLayer.push({ event: 'form_submission' })` on submit success.
- No duplicate form-data keys (camelCase only; never firstName + first_name).

## Code standards (workspace AGENTS.md)
- Functions ≤30 lines; no `any`; async ops need try/catch with meaningful errors.
- No dead code, no console.log/debugger, early returns over deep nesting, named constants over magic values.
- Explicit return types on exported functions. One component per file. Files <500 lines.
- Run `simplify` before committing.

## Process
Use superpowers: brainstorm before building features, TDD where testable, plan multi-step work,
worktrees for isolation, code review before shipping. Browser-verify any UI change before pushing.

**Never install browser/system deps mid-task.** If headless Chromium won't launch, do NOT run
`apt-get` / `sudo` / `playwright install --with-deps` — that's an hour-long rabbit hole and a
bootstrap problem, not yours to fix. Try the browser once with a short timeout; if it fails, do a
DOM/HTML a11y check, note "browser screenshots unavailable — bootstrap gap" for the reviewer, and
move on. Don't loop on dependency installation.

## Design quality bar — ship work that looks like it cost $5,000+
**Before writing ANY UI, invoke the `frontend-design` skill.** Pipeline: Figma (intended
design, if provided) → Mega component library → `frontend-design` (quality layer). The bar
is a senior agency designer's portfolio piece, not a functional prototype. Build to the
full rubric in [references/5-design-quality.md](skills/web-coding-os/references/5-design-quality.md). Non-negotiables:

- **Typography:** a deliberate type scale (≥1.2 ratio), ≤2 families, tight tracking on display
  headings, generous body line-height (~1.6). Never system-font-default.
- **Layout & space:** an 8px rhythm, generous whitespace, real hierarchy and editorial
  composition. NOT everything-centered-stacked.
- **Color:** restrained palette, ONE confident accent reserved for primary CTAs, off-black/
  off-white neutrals (never pure #000/#fff), AA contrast.
- **Depth & detail:** consistent radii, layered soft shadows, hover + focus-visible states on
  every interactive element, optical alignment, one icon family (e.g. lucide — never emoji).
- **Imagery & motion:** real/on-brand imagery or custom gradients/illustration (never obvious
  stock); subtle purposeful motion (150–250ms, scroll-reveal, respects `prefers-reduced-motion`).
- **Responsive:** mobile-first, verified at 360px → desktop. No layout shift, no overflow.
- **Functional honesty:** anything styled as a control must have a complete useful outcome
  (selected/result/error/success as applicable). Never ship decorative radios, filters,
  quizzes, calculators, or forms that accept input and then do nothing.
- **Identity:** use the real logo; verify the complete lockup at its actual rendered size and
  on every background. The mark and lettering must remain separately legible.
- **Image roles:** inspect every source at full resolution and in desktop/mobile crops. Do not
  reuse one image for unrelated semantic roles, and reject generated blur, invented objects,
  impossible scene details, or damaged faces.
- **Motifs:** recurring lines, paths, or diagrams are one system. Keep stroke widths and seam
  positions continuous; endpoint dots/caps appear only where the motif truly terminates.

**Forbidden "generic-AI tells" (auto-fail the design-review gate):** centered-hero + three equal
feature cards, stock indigo-500 buttons, system-font-only, lorem ipsum shipped, emoji as icons,
unstyled native inputs, walls of equal-weight text, missing hover/focus/empty/loading states.
Decorative all-caps eyebrow fragments are not a default section requirement: use them only when
they orient the reader; otherwise write a useful subtitle or remove them.

## Conversion (every LP and marketing page)
Design for the visitor's decision, not just aesthetics. See `landing-page-cro` / `landing-page-architect`.
- **Above the fold:** ONE crisp outcome-focused value prop + supporting subhead + ONE primary
  CTA + a trust signal. A visitor knows what/why/for-whom in 5 seconds.
- **Narrative:** problem → solution → proof → action. Benefit-led, scannable headlines.
- **Proof early & often:** logos, named testimonials (with faces), metrics, ratings.
- **CTA strategy:** one primary action, repeated at natural decision points, high-contrast,
  action-oriented copy ("Get my free audit", not "Submit").
- **Friction & trust:** shortest viable form, inline validation, no-spam reassurance, guarantees /
  security signals / real contact. Specificity over hype.
