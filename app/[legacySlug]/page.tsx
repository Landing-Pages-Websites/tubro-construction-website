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
  if (legacySlug === "how-much-does-it-cost-to-replace-kitchen-cabinets") {
    return {
      ...articleMetadata(post),
      title: "Tubro Construction | Kitchen Cabinet Installation",
      description:
        "Learn what affects kitchen cabinet installation costs, from cabinet type to labor, and request a free estimate from Tubro Construction in Western Washington.",
    };
  }
  if (legacySlug === "how-much-does-kitchen-cabinet-refacing-cost") {
    return {
      ...articleMetadata(post),
      title: "Cabinet Refacing vs Replacement Cost | King and Pierce",
      description: "Compare cabinet refacing and replacement costs for kitchens in King and Pierce Counties, with a guide to options; book a free estimate from Tubro Construction.",
    };
  }
  return articleMetadata(post);
}

export default async function LegacyPage({ params }: Props): Promise<ReactElement> {
  const { legacySlug } = await params;
  const post = rootPosts.find((item) => item.slug === legacySlug);
  if (!post) notFound();
  return <BlogArticle post={post} />;
}
