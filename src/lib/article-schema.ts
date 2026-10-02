import type { BlogPost } from "./blog-posts";
import { SITE_URL } from "./seo";

export function articleSchema(post: BlogPost): Record<string, unknown> {
  const organizationAuthor = post.author === "Tubro Construction";
  return {
    "@context": "https://schema.org", "@type": "BlogPosting", identifier: post.id,
    headline: post.title, description: post.description,
    image: post.image ? new URL(post.image, SITE_URL).href : undefined,
    datePublished: post.publishedDate, dateModified: post.dateModified,
    author: { "@type": organizationAuthor ? "Organization" : "Person", name: post.author, ...(organizationAuthor ? { url: `${SITE_URL}/about-us` } : {}) },
    publisher: { "@type": "Organization", name: "Tubro Construction", logo: { "@type": "ImageObject", url: `${SITE_URL}/images/tc-logo.png` } },
    mainEntityOfPage: `${SITE_URL}${post.canonicalPath}`,
  };
}
