import Link from "next/link";
import type { ReactElement } from "react";
import type { BlogPost } from "@/lib/blog-posts";
import styles from "./articles.module.css";

const SERVICES: Record<string, { href: string; label: string }> = {
  "Kitchen remodeling": { href: "/kitchen-remodeling", label: "Explore kitchen remodeling" },
  "Bathroom remodeling": { href: "/bathroom-remodeling", label: "Explore bathroom remodeling" },
  "Painting & exteriors": { href: "/interior-exterior-painting", label: "Explore painting and exterior services" },
  "Decks & outdoor living": { href: "/general-contractor", label: "Explore decks and general contracting" },
  "Home additions": { href: "/custom-home-services", label: "Explore custom home services" },
};

export function ArticleBody({ post }: { post: BlogPost }): ReactElement {
  const service = SERVICES[post.category] || { href: "/general-contractor", label: "Explore general contracting" };
  return <div className={styles.body}>
    {post.sections.map((section, index) => <section key={section.heading} id={`section-${index + 1}`} aria-labelledby={`heading-${index + 1}`}>
      <h2 id={`heading-${index + 1}`}>{section.heading}</h2>
      {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
    </section>)}
    <section className={styles.sources} aria-labelledby="sources-heading"><h2 id="sources-heading">Sources &amp; further reading</h2><p>Consult the relevant authority for requirements specific to your property and project.</p><ul>{post.sources.map((source) => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul></section>
    <section className={styles.nextStep} aria-labelledby="next-step-heading"><h2 id="next-step-heading">Bring your ideas. We’ll talk through the next step.</h2><p>Tell us about your home, your project city, and what you would like to change.</p><Link href="/schedule-an-estimate">Schedule a free estimate</Link></section>
    <section className={styles.related} aria-label="Explore Tubro services"><nav><Link href={service.href}>{service.label}</Link><Link href="/recent-projects">See recent projects</Link><Link href="/service-areas">Find your service area</Link></nav></section>
  </div>;
}
