import Link from "next/link";
import type { ReactElement } from "react";
import type { BlogPost } from "@/lib/blog-posts";
import styles from "./articles.module.css";

export function ArticleBody({ post }: { post: BlogPost }): ReactElement {
  return <div className={styles.body}>
    <div data-article-body dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
    <section data-mega-section="next-step" className={styles.nextStep} aria-labelledby="next-step-heading"><h2 id="next-step-heading">Bring your ideas. We’ll talk through the next step.</h2><p>Tell us about your home, your project city, and what you would like to change.</p><Link data-mega-cta="article-next-step-estimate" href="/schedule-an-estimate">Book Your Free Estimate</Link></section>
  </div>;
}
