import type { Metadata } from "next";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { articleMetadata } from "@/lib/article-metadata";
import { blogPosts } from "@/lib/blog-posts";
import { BlogArticle } from "../BlogArticle";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((article) => article.slug === slug);
  if (!post) notFound();
  return articleMetadata(post);

}

export default async function Page({ params }: Props): Promise<ReactElement> {
  const { slug } = await params;
  const post = blogPosts.find((article) => article.slug === slug);
  if (!post) notFound();
  return <BlogArticle post={post} />;
}
