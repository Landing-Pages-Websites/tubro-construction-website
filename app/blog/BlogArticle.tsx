import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { relatedBlogPosts, type BlogPost } from "@/lib/blog-posts";
import { articleSchema } from "@/lib/article-schema";
import { ArticleBody } from "./ArticleBody";
import styles from "./articles.module.css";


export function BlogArticle({ post }: { post: BlogPost }): ReactElement {
  const date = new Date(post.publishedDate.length === 10 ? `${post.publishedDate}T12:00:00Z` : post.publishedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  const schema = articleSchema(post);
  return <div className={styles.article}>
    <SiteHeader />
    <main id="main-content" tabIndex={-1}>{post.kind === "article" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">{post.category}</span></nav>
      <article><header className={styles.articleHeader}><p className={styles.label}>{post.category}</p><h1>{post.title}</h1><p className={styles.dek}>{post.description}</p>{post.publishedDate && <div className={styles.byline}><span>By {post.author}</span><time dateTime={post.publishedDate}>{date}</time></div>}</header>
        {post.image && <div className={styles.articleImage}><Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 1400px) 1280px, 95vw" /></div>}
        <div className={styles.articleLayout}><aside className={styles.contents}><h2>In this guide</h2><nav aria-label="Article contents">{post.sections.map((section) => <a key={section.id} href={`#${section.id}`} dangerouslySetInnerHTML={{ __html: section.heading }} />)}</nav></aside><ArticleBody post={post} /></div>
      </article>
      <section className={styles.related} aria-labelledby="related-heading"><h2 id="related-heading">Keep planning your remodel.</h2><nav aria-label="Related articles">{relatedBlogPosts(post).map((item) => <Link key={item.slug} href={item.canonicalPath}>{item.title} <ArrowUpRight size={16} className="inline" aria-hidden="true" /></Link>)}</nav></section>
    </main><SiteFooter />
  </div>;
}
