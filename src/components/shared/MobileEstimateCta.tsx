"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function MobileEstimateCta(): ReactElement | null {
  const pathname = usePathname();
  const search = useSearchParams();
  if (search.get("embed") === "realwork") return null;
  return <nav aria-label="Book an estimate" className="mobile-estimate-bar"><Link prefetch={false} href={pathname === "/schedule-an-estimate" ? "#form" : "/schedule-an-estimate"}>Book Your Free Estimate <ArrowRight aria-hidden="true" /></Link></nav>;
}
