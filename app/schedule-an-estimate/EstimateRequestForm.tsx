"use client";

import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import type { ReactElement } from "react";
import { useEstimateForm } from "@/hooks/useEstimateForm";
import { formKeyForSlug } from "@/lib/form-keys";
import { EstimateField } from "@/components/shared/EstimateField";
import { EstimateStatusNote } from "@/components/shared/EstimateStatusNote";
import EstimateProjectChoices from "./EstimateProjectChoices";
import EstimateContactFields from "./EstimateContactFields";
import s from "./estimate.module.css";

export default function EstimateRequestForm(): ReactElement {
  const form = useEstimateForm("/schedule-an-estimate", { formKey: formKeyForSlug("schedule-an-estimate"), requireConsent: true });
  const busy = form.status === "submitting";
  return <section id="form" className={s.formPanel} aria-labelledby="request-heading">
    <header className={s.formHeading}><h2 id="request-heading">Tell us what you’re planning.</h2><p>A few details are all we need to start the conversation.</p></header>
    <form ref={form.formRef} onSubmit={form.handleSubmit} noValidate aria-label="Request a free estimate" aria-busy={busy}>
      <fieldset className={s.formContents} disabled={busy}>
        <EstimateProjectChoices />
        <EstimateContactFields errors={form.errors} />
        <fieldset className={s.formSection}>
          <legend><span>03</span>Your vision for the space</legend>
          <EstimateField id="estimate-details" name="projectDetails" label="What would you like to change?" errorId="estimate-details-error" fieldClassName={s.input} labelClassName={s.label} multiline error={form.errors.projectDetails} />
          <p className={s.fieldHint}>Tell us about the room, the work you’re considering, and anything we should know. Early ideas are welcome.</p>
        </fieldset>
        <label className={s.consent}><input type="checkbox" name="consent" aria-invalid={Boolean(form.errors.consent)} aria-describedby={form.errors.consent ? "estimate-consent-error" : undefined} /><span>Tubro Construction may contact me about this request by phone or email.</span></label>
        {form.errors.consent && <p id="estimate-consent-error" className={s.error}>{form.errors.consent}</p>}
        <button type="button" className={s.submit} onClick={form.validateAndSubmit} disabled={busy}>{busy ? <>Sending your request <Loader2 className={s.spinner} size={19} /></> : <>Request my free estimate <ArrowUpRight size={21} /></>}</button>
      </fieldset>
      <EstimateStatusNote status={form.status} idleNote="Your request goes to our office team. We’ll follow up during business hours." />
      <p className={s.privacy}>Learn how we handle your information. <Link href="/privacy">Privacy policy</Link></p>
    </form>
  </section>;
}
