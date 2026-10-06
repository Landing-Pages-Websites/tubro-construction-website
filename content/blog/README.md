# Blog source

Each `.md` file is the actual server-rendered source. Required frontmatter: unique `item_` id, slug, title, date, description, canonicalPath, kind. Preserve an existing id on every edit. New identities in this migration use the existing `blogmig.stableid.item_id_from_entropy` encoder with SHA-256 of the stable source URL; they are deterministic, not randomly regenerated.

The 54 recovered Duda articles use semantic HTML inside Markdown to preserve complete body text, links, images and tables. Do not replace their bodies with summaries. The 13 authored repository posts were exported faithfully from JSON. The former JSON files remain historical provenance, not rendering inputs.

`_inventory.json` reconciles all 86 sitemap URLs and the additional required MEGA root path. Records excluded from article migration are ordinary site pages, with their precise retained target and reason. Legacy root URLs serve directly from a bounded registry. The Washington kitchen article keeps its original item id and `/blog/` canonical; its required root alias also serves directly.

Rendering sanitizes active HTML. Metadata may use shorter SEO excerpts without changing visible editorial copy. Schema is one BlogPosting per article, preserving original publication/modification dates and any verified named author. `kind: page` preserves the two nonarticle legacy pages without Article schema.
