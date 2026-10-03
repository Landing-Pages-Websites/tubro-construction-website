import type { Metadata } from "next";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { rootPosts } from "@/lib/blog-posts";
import { articleMetadata } from "@/lib/article-metadata";
import { BlogArticle } from "../blog/BlogArticle";

type Props = { params: Promise<{ legacySlug: string }> };
export const dynamicParams = false;

export function generateStaticParams(): { legacySlug: string }[] {
  return rootPosts.map((post) => ({ legacySlug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legacySlug } = await params;
  const post = rootPosts.find((item) => item.slug === legacySlug);
  if (!post) notFound();
  return articleMetadata(post);
}

export default async function LegacyPage({ params }: Props): Promise<ReactElement> {
  const { legacySlug } = await params;
  const post = rootPosts.find((item) => item.slug === legacySlug);
  if (!post) notFound();
  return <BlogArticle post={post} />;
}
