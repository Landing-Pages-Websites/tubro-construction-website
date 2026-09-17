# City page design

## Purpose and scope

Help homeowners in the 19 listed communities understand the remodeling offer and request an estimate. One shared layout, individually written introductions and planning prompts, and curated authentic portfolio photographs. Preserve the public URLs, route-specific form keys, canonical URLs, header, footer, and submission mechanics. The directory at `/service-areas` remains separate.

## Research, September 17, 2026

- [HOUS Luxury Homes — Awwwards Honorable Mention](https://www.awwwards.com/sites/hous-luxury-homes): reviewed the award submission image and the [current project-to-contact content sequence](https://hous.nl/). Takeaway: give real work substantial space and a short route to an inquiry. Do not import the imagery, copy, branding, or full-screen loading experience.
- [Rickman Architecture + Design — Orpetron Site of the Day](https://orpetron.com/sites/rickman-architecture-design/): gallery, project-page, and horizontal-layout references; inspected the [live site](https://radga.com/) and its [about content](https://radga.com/about). Takeaway: make project photographs and concise captions carry the visual story. Tubro retains ordinary vertical scrolling and visible contact actions.
- Inspected the running Tubro `/service-areas` page at desktop size. Its architectural corner crop, green emphasis, warm surface palette, and existing Poppins/Fjalla pairing are the visual authority.
- Attempted `21st search "architecture editorial split hero project gallery" --context auto`; catalog access requires sign-in. Reused existing Tubro components and local photographs instead.

## Chosen treatment

Split hero with a clipped architectural corner and an inset portfolio caption, compact sage trust band, numbered three-step process, photographic services list, staggered two-image project gallery, city planning guidance beside accessible native FAQs, and a light estimate panel. One main estimate action with in-page anchors.

Use the existing tokens: ink `#231f20`, plaster `#f7f4ee`, sage `#e8efe8`, action `#0c883d`, deep action `#0a6f33`. Poppins carries headings and body; Fjalla is reserved for process numbers and a short portfolio closing line.

### Motion

The shared city layout carries one coordinated construction-themed motion sequence across all 19 routes. `city-hero-motion.module.css` draws the hero frame, uncovers the project photo with a plaster-colored shutter, settles the crop, and sequences the copy and caption. It runs from server-delivered CSS rather than hiding visible content after hydration. Mobile uses shorter durations. Keyboard focus shows the copy immediately without resetting its animation clock.

`CityMotion.tsx` handles the lower page with native Web Animations and an IntersectionObserver. Process rules draw across their rows; photographs uncover within stable containers; service rows enter with bounded stagger; the estimate panel arrives as one unit. Initially visible content is left alone, and paragraphs and individual form fields are not moved. Image clipping does not interfere with the existing hover zoom. There are no continuous scroll handlers, animation dependencies, or decorative loops.

Keyboard focus cancels the relevant pending entrance immediately, including when a project link wraps its image. Reduced-motion changes cancel animations and reveal all content, and switching back reconnects offscreen discovery. The component is keyed by city to clean up and register the new route's targets. Without JavaScript, the page retains visible static content. Existing form mechanics and FAQ controls are unchanged.

## Content and functionality

`city-content.ts` is the source for the new city introductions and image selections. The historical design manifests remain reference artifacts, not the runtime city copy. No claims about city-specific completed projects are introduced. Portfolio captions describe the actual image subject, and the gallery explicitly identifies a shared portfolio. Planning prompts are useful homeowner guidance, not claims about local housing stock or permitting.

The shared `LeadForm` gains an optional editable `defaultCity`. All other consumers retain their previous behavior. Field keys, consent, endpoint, analytics, validation focus, success/error states, and route attribution stay with the existing form and hook.

## Validation scope

Use the existing port-3000 dev server. Check all 19 routes, distinct metadata, headings, image availability, city prefills, anchors, FAQs, desktop/mobile overflow, reduced motion, and mocked form error/success payloads. Inspect full-page screenshots on desktop and mobile. Do not post test leads to the live submission endpoint.

### Results

- All 19 routes returned 200 and passed at 1536, 768, 390, and 320px: one H1, correct city and canonical, distinct description, working fragment targets, no duplicate IDs or horizontal overflow, and decodable project images.
- Inspected desktop/mobile full pages and all six hero photo selections. Applied the directory page's existing narrow-header treatment locally to city pages at 320px.
- Keyboard FAQ/menu controls, estimate anchors, reduced motion, and content visibility without JavaScript passed.
- Mocked submission checks passed: empty-field focus, required consent, error retention/retry, editable city, reset to the route city, route/form attribution, UTM propagation, and one success analytics event. The Contact form still starts with an empty city.
- TypeScript and scoped whitespace checks passed; the Impeccable detector returned no findings. Independent read-only review found no critical or important issues.
- `npm run verify` reports 310 existing artifact-schema errors. The unchanged verifier reads `section_id` / `owner_component`, while committed artifacts use `frame` / `implementation_owner`. This broader tool is not evidence of runtime acceptance for the redesigned routes. The inherited review-bridge script also reports an external CORS failure on localhost; no app runtime exceptions were observed.

### Animation validation

Parallel hero, lower-page, and QA work was integrated into the shared layout. All 19 routes passed first-heading visibility, actual hero animation, live reduced-motion cancellation, and overflow checks at 320, 390, 768, and 1536px. Focused browser checks confirmed lower animations actually play and finish, preference changes reconnect discovery, city navigation registers new targets, and content remains visible without JavaScript. Focusing a pending service link, estimate field, or project image link immediately exposes the corresponding content. TypeScript and the motion-file design detector passed. No form submission logic changed in this animation pass.
