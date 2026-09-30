"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function MobileEstimateCta() {
  const pathname = usePathname();
  const search = useSearchParams();
  if (search.get("embed") === "realwork") return null;
  return <div className="mobile-estimate-bar"><Link href={pathname === "/schedule-an-estimate" ? "#form" : "/schedule-an-estimate"}>Book Your Free Estimate <ArrowRight aria-hidden="true" /></Link></div>;
}
