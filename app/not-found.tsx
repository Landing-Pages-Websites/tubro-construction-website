import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactElement } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";

export default function NotFound(): ReactElement {
  return (
    <div data-motion-variant="a">
      <SiteHeader />
      <main className="bg-plaster">
        <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-start justify-center px-5 py-20 sm:px-8">
          <p className="flex items-center gap-2.5 font-fjalla text-xs uppercase tracking-[0.12em] text-action-deep">
            <span aria-hidden="true" className="h-0.5 w-6 bg-action" />
            Page not found
          </p>
          <h1 className="mt-4 max-w-xl font-poppins text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            That page isn’t on the plan.
          </h1>
          <p className="mt-5 max-w-md font-fjalla text-lg leading-relaxed text-ink/80">
            The address may have changed. Head back to the homepage or start a free estimate.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
            <Link
              href="/"
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-md bg-action px-6 py-3 font-poppins text-[15px] font-semibold text-white shadow-md shadow-action/25 transition-colors hover:bg-action-deep"
            >
              Back to homepage
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/schedule-an-estimate"
              className="inline-flex min-h-11 items-center font-poppins text-base font-semibold text-action-deep underline-offset-4 hover:underline"
            >
              Schedule a Free Estimate
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
