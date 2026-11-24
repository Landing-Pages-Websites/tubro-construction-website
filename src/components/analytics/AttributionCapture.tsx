"use client";

import { useEffect } from "react";
import { rememberAttribution } from "@/lib/attribution";

/** Stores the session's first-touch UTMs and click ids on the landing page, before internal links drop them. */
export function AttributionCapture(): null {
  useEffect(() => {
    rememberAttribution();
  }, []);
  return null;
}
