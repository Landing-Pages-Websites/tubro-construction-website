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

Store each article as a JSON file in `src/lib/blog-content/`, then import it into the typed `blogPosts` array in `src/lib/blog-posts.ts`. The listing, static route params, article metadata, related links, and XML sitemap derive from that registry. Related reading prioritizes the current article's category and is capped at three suggestions. Keep each article's category mapped to its relevant service in `ArticleBody.tsx`. Do not add articles to `DESIGNED_ROUTES`, which requires separate page-design manifests.

Check source links and jurisdiction-specific guidance before publishing, use a truthful publication date, and use an image with verified provenance. The article template supplies a canonical URL, social preview, `BlogPosting` structured data, contents links, source list, and estimate CTA. It inherits the site's current canonical host; changing domains belongs to the site-wide launch configuration.
