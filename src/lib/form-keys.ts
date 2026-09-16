/** Distinct submission form key per route (single source for QA and analytics). */
export function formKeyForSlug(slug: string): string {
  if (slug === "careers") return "careers_application";
  if (slug === "contact") return "contact_message";
  if (slug === "schedule-an-estimate") return "schedule_estimate";
  return `estimate_${slug.replace(/^service-area--/, "").replace(/-/g, "_")}`;
}

/** Contextually correct pre-selected project type for a route's estimate form. */
export function defaultProjectType(pagePath: string, options: string[]): string | undefined {
  if (pagePath === "/custom-home-services") {
    return options.find((option) => /custom home|construction/i.test(option));
  }
  if (pagePath === "/interior-exterior-painting") {
    return options.find((option) => /paint/i.test(option));
  }
  return options[0];
}
