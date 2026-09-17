import type { ReactElement } from "react";
import { EstimateField } from "@/components/shared/EstimateField";
import type { EstimateErrors } from "@/hooks/useEstimateForm";
import s from "./estimate.module.css";

export default function EstimateContactFields({ errors }: { errors: EstimateErrors }): ReactElement {
  const field = { fieldClassName: s.input, labelClassName: s.label };
  return <fieldset className={s.formSection}>
    <legend><span>02</span>A little about you</legend>
    <div className={s.fields}>
      <EstimateField {...field} id="estimate-name" name="name" label="Your name" autoComplete="name" errorId="estimate-name-error" error={errors.name} />
      <EstimateField {...field} id="estimate-city" name="projectCity" label="Project city (optional)" autoComplete="address-level2" errorId="estimate-city-error" />
      <EstimateField {...field} id="estimate-email" name="email" type="email" label="Email address" autoComplete="email" errorId="estimate-email-error" error={errors.email ?? errors.contact} />
      <EstimateField {...field} id="estimate-phone" name="phone" type="tel" label="Phone number" autoComplete="tel" errorId="estimate-email-error" invalid={Boolean(errors.contact)} />
    </div>
    <p className={s.fieldHint}>Share an email address or phone number so we can follow up.</p>
  </fieldset>;
}
