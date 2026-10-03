# Remodeling journal

## Editorial and SEO plan

Audience: homeowners planning residential remodeling in King and Pierce Counties.
The journal addresses distinct informational searches and supports the existing service pages. Ten additional articles expand the initial three-guide collection to thirteen articles.

| Article | Search intent | Next step |
| --- | --- | --- |
| Kitchen remodel planning checklist | Organize layout, selections, scope, and estimate questions | Kitchen remodeling / free estimate |
| Bathroom remodel planning guide | Decide bathing arrangements, ventilation, storage, and construction scope | Bathroom remodeling / free estimate |
| Choosing a remodeling contractor in Washington | Verify a business and compare written scope and communication | General contracting / free estimate |
| Exterior painting preparation | Organize repairs, cleaning, access, and surface preparation | Painting and exterior services |
| Deck remodel planning | Define outdoor use, existing conditions, and project scope | General contracting |
| Exterior painting weather window | Understand forecast, surface conditions, and product instructions | Painting and exterior services |
| Exterior stain versus paint | Compare finish choices for existing wood | Painting and exterior services |
| Kitchen cabinet storage | Match cabinet layouts and accessories to daily routines | Kitchen remodeling |
| Bathroom lighting | Plan mirror, general, and shower-area lighting | Bathroom remodeling |
| Material selection checklist | Track specifications, purchasing, and dependencies | General contracting |
| Preparing for a remodel estimate | Bring the information needed for a productive visit | Free estimate |
| Living at home during a remodel | Plan household access, temporary spaces, and daily communication | General contracting |
| Home addition planning | Define the brief, property constraints, and feasibility questions | Custom home services |

Research, SEO planning, and writing were delegated separately. Articles use original practical guidance, authentic project photography, and source links to King County, Pierce County, EPA, and Washington L&I. No search-volume, ranking, price, completion-time, or return-on-investment claims were invented.

## Adding an article

Store each article as an item-id-bearing Markdown file in `content/blog/`. The actual server-side reader is `src/lib/blog-posts.ts`; see `content/blog/README.md` for the migration and identity contract. The listing, routes, related reading and sitemap derive from those files. The JSON directory is retained only as provenance.

Check source links and jurisdiction-specific guidance before publishing, use a truthful publication date, and use an image with verified provenance. The article template supplies a canonical URL, social preview, `BlogPosting` structured data, contents links, source list, and estimate CTA. It inherits the site's current canonical host; changing domains belongs to the site-wide launch configuration.
