import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import type { EstimateStatus } from "@/hooks/useEstimateForm";

interface EstimateStatusNoteProps {
  status: EstimateStatus;
  /** What was submitted, e.g. "estimate request" or "application". */
  topic?: string;
  /** Reassurance line shown before submission. */
  idleNote?: string;
  /** Full success sentence override (must stay honest about what was sent). */
  successNote?: string;
}

export function EstimateStatusNote({
  status,
  topic = "estimate request",
  idleNote = "Free estimate. No spam — your details go straight to the Tubro team.",
  successNote,
}: EstimateStatusNoteProps): ReactElement {
  return (
    <div aria-live="polite" className="mt-4 font-poppins text-sm">
      {status === "success" && (
        <p role="status" className="rounded-md border border-action/40 bg-sage px-4 py-3 text-action-deep">
          {successNote ??
            `Thanks — your ${topic} is in. The team follows up during business hours, ${BRAND.hours}.`}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">
          Something went wrong sending your request. Please try again, or call{" "}
          <a href={BRAND.phoneHref} className="font-semibold underline underline-offset-2">
            {BRAND.phoneDisplay}
          </a>
          .
        </p>
      )}
      {status === "idle" && <p className="text-center text-xs text-ink/70">{idleNote}</p>}
    </div>
  );
}
