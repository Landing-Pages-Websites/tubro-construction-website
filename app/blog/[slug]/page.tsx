import type { Metadata } from "next";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-posts";
import { BlogArticle } from "../BlogArticle";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams(): { slug: string }[] {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((article) => article.slug === slug);
  if (!post) notFound();
  return {
    title: `${post.title} | Tubro Construction`, description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, url: `/blog/${post.slug}`, publishedTime: post.publishedDate, images: [{ url: post.image, alt: post.imageAlt }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.image] },
  };
}

export default async function Page({ params }: Props): Promise<ReactElement> {
  const { slug } = await params;
  const post = blogPosts.find((article) => article.slug === slug);
  if (!post) notFound();
  return <BlogArticle post={post} />;
}
