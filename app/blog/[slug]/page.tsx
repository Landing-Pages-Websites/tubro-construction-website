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
  const metadata = articleMetadata(post);
  if (slug === "how-much-does-kitchen-cabinet-refacing-cost") {
    return {
      ...metadata,
      title: "Cabinet Refacing vs Replacement Cost | King and Pierce",
      description: "Compare cabinet refacing and replacement costs for kitchens in King and Pierce Counties, with a guide to options; book a free estimate from Tubro Construction.",
    };
  }
  if (slug === "preparing-for-remodel-estimate") {
    return {
      ...metadata,
      title: "How to Estimate a Remodeling Job: Home Renovation Checklist",
      description: "Prepare for a remodeling estimate with a renovation checklist for scope, photos, budget, and site access in King and Pierce Counties. Book a free estimate.",
    };
  }
  return metadata;

}

export default async function Page({ params }: Props): Promise<ReactElement> {
  const { slug } = await params;
  const post = blogPosts.find((article) => article.slug === slug);
  if (!post) notFound();
  return <BlogArticle post={post} />;
}
