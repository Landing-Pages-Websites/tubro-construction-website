import type { ReactElement } from "react";
import styles from "./city.module.css";

/**
 * Existing posts that are about one served city. Each destination was live
 * and returned HTTP 200 on 2026-11-26. Do not add a city or a post that is
 * not in this list. Kent's bathroom page is excluded: the audit flagged a
 * wrong phone number there, and another task owns that repair.
 */
const LOCAL_GUIDES: Record<string, ReadonlyArray<{ href: string; label: string }>> = {
  "maple-valley": [
    {
      href: "/blog/how-much-does-a-kitchen-remodel-cost-in-maple-valley-wa",
      label: "Kitchen remodel cost in Maple Valley",
    },
    {
      href: "/blog/how-much-does-a-bathroom-remodel-cost-in-maple-valley-wa",
      label: "Bathroom remodel cost in Maple Valley",
    },
    {
      href: "/blog/how-much-a-full-home-remodel-costs-in-maple-valley-wa",
      label: "What a full home remodel costs in Maple Valley",
    },
    {
      href: "/blog/do-i-need-permits-for-a-home-remodel-in-maple-valley-wa",
      label: "When a Maple Valley remodel needs a permit",
    },
    {
      href: "/blog/how-much-do-kitchen-countertops-cost-in-maple-valley-wa",
      label: "Kitchen countertop cost in Maple Valley",
    },
    {
      href: "/blog/top-kitchen-remodeling-trends-for-homes-in-maple-valley-wa",
      label: "Kitchen remodeling ideas for Maple Valley homes",
    },
  ],
  renton: [
    {
      href: "/blog/a-step-by-step-guide-to-bathroom-remodels-in-renton-what-to-expect",
      label: "What to expect from a bathroom remodel in Renton",
    },
  ],
  auburn: [
    {
      href: "/blog/how-to-maximize-natural-light-when-remodeling-your-auburn-home",
      label: "How to bring more natural light into an Auburn remodel",
    },
  ],
  covington: [
    {
      href: "/blog/planning-a-home-addition-in-covington-what-you-need-to-know",
      label: "Planning a home addition in Covington",
    },
  ],
  "bonney-lake": [
    {
      href: "/blog/cost-effective-upgrades-for-older-homes-in-bonney-lake",
      label: "Cost-effective upgrades for older Bonney Lake homes",
    },
  ],
  issaquah: [
    {
      href: "/blog/how-to-prepare-your-issaquah-home-for-a-full-interior-and-exterior-paint-job",
      label: "How to prepare an Issaquah home for painting",
    },
  ],
};

export function CityLocalGuides({
  city,
  citySlug,
}: {
  city: string;
  citySlug: string;
}): ReactElement | null {
  const guides = LOCAL_GUIDES[citySlug];
  if (!guides) return null;
  return (
    <section
      data-mega-section="local-guides"
      className={`${styles.section} ${styles.localGuides}`}
      aria-labelledby="local-guides-heading"
    >
      <h2 id="local-guides-heading">Guides for {city} homeowners</h2>
      <p>
        These existing articles cover remodeling questions homeowners in {city} ask
        before they request an estimate.
      </p>
      <ul>
        {guides.map((guide) => (
          <li key={guide.href}>
            <a href={guide.href}>{guide.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
