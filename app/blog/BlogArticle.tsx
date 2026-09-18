import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { relatedBlogPosts, type BlogPost } from "@/lib/blog-posts";
import { ArticleBody } from "./ArticleBody";
import styles from "./articles.module.css";
import blogStyles from "./blog.module.css";

const SITE_URL = "https://tubro-construction-website.vercel.app";

export function BlogArticle({ post }: { post: BlogPost }): ReactElement {
  const date = new Date(`${post.publishedDate}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  const schema = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, image: new URL(post.image, SITE_URL).href, datePublished: post.publishedDate, author: { "@type": "Organization", name: "Tubro Construction", url: `${SITE_URL}/about-us` }, publisher: { "@type": "Organization", name: "Tubro Construction", logo: { "@type": "ImageObject", url: `${SITE_URL}/images/tc-logo.png` } }, mainEntityOfPage: `${SITE_URL}/blog/${post.slug}` };
  return <div className={styles.article}>
    <a href="#article" className={blogStyles.skip}>Skip to article</a><SiteHeader />
    <main id="article"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">{post.category}</span></nav>
      <article><header className={styles.articleHeader}><p className={styles.label}>{post.category}</p><h1>{post.title}</h1><p className={styles.dek}>{post.description}</p><div className={styles.byline}><Link href="/about-us">By Tubro Construction</Link><time dateTime={post.publishedDate}>{date}</time></div></header>
        <div className={styles.articleImage}><Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 1400px) 1280px, 95vw" /></div>
        <div className={styles.articleLayout}><aside className={styles.contents}><h2>In this guide</h2><nav aria-label="Article contents">{post.sections.map((section, index) => <a key={section.heading} href={`#section-${index + 1}`}>{section.heading}</a>)}</nav></aside><ArticleBody post={post} /></div>
      </article>
      <section className={styles.related} aria-labelledby="related-heading"><h2 id="related-heading">Keep planning your remodel.</h2><nav aria-label="Related articles">{relatedBlogPosts(post).map((item) => <Link key={item.slug} href={`/blog/${item.slug}`}>{item.title} <ArrowUpRight size={16} className="inline" aria-hidden="true" /></Link>)}</nav></section>
    </main><SiteFooter />
  </div>;
}
