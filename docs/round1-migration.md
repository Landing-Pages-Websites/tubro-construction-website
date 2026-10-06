# Duda recovery and identity audit

The public `https://www.tubroconstruction.com/sitemap.xml` was fetched with `User-Agent: Mozilla/5.0`, then reconciled against all 86 direct-audit records and the additional required `/kitchen-remodel-cost-washington-state` path. No credential or private API was used. Public HTML snapshots remain in `/tmp/tubro-legacy`; the source SHA-256 and exact body text SHA-256 are recorded in `content/blog/_inventory.json`.

The exact article selector is `.postPageExtRoot > .blog-post-row`. `.postPageExtRoot` alone is too broad: it also includes older/newer post navigation. The related-post grid is outside these rows. All article rows are concatenated in DOM order, retaining paragraphs, headings, links, lists, images and tables. Duda layout classes, inline styles, active scripts and empty structural wrappers are removed. Inline spans are retained, including text-node boundaries; this prevents joining or splitting words when verifying source text. Indentation before HTML tags is removed so Markdown does not misinterpret Duda headings as code blocks. An introductory h3 used as a dek becomes a paragraph; page-level h1s in the two legacy nonarticle pages become h2s under the route's h1.

The Markdown reader parses the supported source files, renders Markdown/semantic HTML, sanitizes active content, and adds contents anchors. It does not read the old JSON excerpts. Both tables and every source link survive; same-site absolute hrefs become equivalent local paths. Original timestamps come from each Duda BlogPosting schema, rather than the fetch/build date. Named authors are preserved where verified in the public article/listing; otherwise the existing publisher organization is used. No publication date was invented for the two nonarticle legacy pages.

Results:

- 87 outgoing URL records: 86 old sitemap URLs plus the required MEGA root alias.
- 54 distinct original articles, exposed through 55 original/required URL records.
- 32 nonarticle records excluded from *article* migration, with explicit reasons and exact retained 200 targets. `/backlinks` and `/Bathroom-Remodels-Kent-WA` retain their source content directly. No broad redirects.
- 13 authored JSON posts exported faithfully to Markdown, preserving every heading, paragraph, bullet, source, slug and date. Their JSON files remain provenance only.
- 67 article source identities and 2 legacy page identities, all unique. `item_q2fvf282v44npyrpr5bgbybjrr` is unchanged. New ids use the existing `blogmig.stableid.item_id_from_entropy` encoder on the first 16 bytes of SHA-256 of the source URL, preserving file ids on reruns. No random ids.
- 114 editorial image URLs downloaded from the original public CDN into new `public/images/blog/legacy-*` paths. All decoded successfully; the source/target manifest and contact sheet are in the evidence directory. Existing project photographs and logo files were untouched.

The three required MEGA root paths return 200 directly. The Washington kitchen-cost article retains its original `/blog/kitchen-remodel-cost-washington-state` canonical and item id; its root alias serves the same complete body without a redirect. Other migrated articles have their original root canonical. Each article document emits exactly one BlogPosting schema.

`python3 scripts/verify-round1.py` compares the production server's actual rendered bodies against the source-derived normalized text SHA-256, link counts and table counts for all 55 original/required article paths. This caught the indented-heading conversion defect before the final passing run. It also verifies status, no redirected destinations, raw h1/main/forms, metadata, schema and skip targets. The original root sitemap and the migration inventory are not reduced to the articles that happened to exist in the baseline JSON.
