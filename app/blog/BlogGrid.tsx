import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import { blogPosts } from "@/lib/blog-posts";
import styles from "./articles.module.css";

export function BlogGrid(): ReactElement {
  return (
    <section id="articles" className={styles.gridSection} aria-labelledby="articles-heading">
      <div className={styles.gridHeading}><div><p className={styles.label}>The remodeling journal</p><h2 id="articles-heading">A clearer plan starts here.</h2></div><p>Practical guides for homeowners in King and Pierce Counties, from the first ideas to the right questions.</p></div>
      <div className={styles.grid}>{blogPosts.map((post) => (
        <article key={post.slug} className={styles.card}>
          <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
            <div className={styles.cardImage}><Image src={post.image} alt={post.imageAlt} fill sizes="(min-width: 900px) 30vw, (min-width: 600px) 45vw, 90vw" /></div>
            <div className={styles.cardCopy}><p className={styles.label}>{post.category}</p><h3>{post.title}</h3><p>{post.description}</p><span className={styles.readLink}>Read the guide <ArrowUpRight size={20} aria-hidden="true" /></span></div>
          </Link>
        </article>
      ))}</div>
    </section>
  );
}
