import type { Metadata } from "next";
import type { BlogPost } from "./blog-posts";
import { siteMetadata } from "./seo";

export function articleMetadata(post: BlogPost): Metadata {
  const metadata = siteMetadata(post.metaTitle || post.title, post.description, post.canonicalPath, post.image || undefined);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: post.kind === "article" ? "article" : "website", ...(post.kind === "article" ? { publishedTime: post.publishedDate, modifiedTime: post.dateModified, authors: [post.author] } : {}) } };
}
