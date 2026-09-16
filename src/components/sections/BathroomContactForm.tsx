"use client";

import type { ReactElement } from "react";
import { HomepageEstimateForm } from "@/components/shared/HomepageEstimateForm";
import { useEstimateForm } from "@/hooks/useEstimateForm";
import { formKeyForSlug } from "@/lib/form-keys";

export function BathroomContactForm({ pagePath, idPrefix }: { pagePath: string; idPrefix: string }): ReactElement {
  const form = useEstimateForm(pagePath, { formKey: formKeyForSlug("bathroom-remodeling") });
  return <HomepageEstimateForm form={form} idPrefix={idPrefix} />;
}
