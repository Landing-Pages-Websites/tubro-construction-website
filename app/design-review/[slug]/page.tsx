import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { loadManifest } from "@/lib/manifest";
import { DESIGNED_ROUTES, routeForSlug } from "@/lib/routes";

interface ReviewParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return DESIGNED_ROUTES.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({ params }: ReviewParams): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Design review — ${slug}`,
    robots: { index: false, follow: false },
  };
}

/** Internal asset-review sheet: approved stitch, native frames, and the built route. */
export default async function DesignReviewPage({ params }: ReviewParams): Promise<ReactElement> {
  const { slug } = await params;
  if (!DESIGNED_ROUTES.some((route) => route.slug === slug)) notFound();
  const route = routeForSlug(slug);
  const manifest = loadManifest(slug);
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="font-fjalla text-xs uppercase tracking-[0.12em] text-action-deep">
        Internal design review — not customer-facing
      </p>
      <h1 className="mt-2 font-poppins text-3xl font-bold tracking-tight text-ink">{route.title}</h1>
      <p className="mt-2 font-poppins text-sm text-ink/70">
        Built route:{" "}
        <Link href={route.path} className="font-semibold text-action-deep underline underline-offset-2">
          {route.path}
        </Link>{" "}
        · Manifest:{" "}
        <a
          href={`/design/pages/${slug}/section_manifest.json`}
          className="font-semibold text-action-deep underline underline-offset-2"
        >
          section_manifest.json
        </a>{" "}
        ·{" "}
        <a
          href={`/design/pages/${slug}/composition_map.json`}
          className="font-semibold text-action-deep underline underline-offset-2"
        >
          composition_map.json
        </a>
      </p>
      <h2 className="mt-10 font-poppins text-xl font-semibold text-ink">Approved page stitch</h2>
      <Image
        src={`/design/pages/${slug}/page.png`}
        alt={`Approved full-page design stitch for ${route.path}`}
        width={1536}
        height={4000}
        className="mt-4 h-auto w-full border border-ink/10"
        unoptimized
      />
      <h2 className="mt-10 font-poppins text-xl font-semibold text-ink">Native section frames</h2>
      <ul className="mt-4 space-y-8">
        {manifest.ordered_sections.map((section) => (
          <li key={section.id}>
            <h3 className="font-poppins text-sm font-semibold text-ink">
              {section.id} · {section.composition}
            </h3>
            <Image
              src={`/design/pages/${slug}/${section.frame}`}
              alt={`Approved frame for ${section.id}`}
              width={1536}
              height={864}
              className="mt-2 h-auto w-full border border-ink/10"
              unoptimized
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
