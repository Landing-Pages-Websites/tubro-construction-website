import type { ReactElement } from "react";

/** Hidden from visitors and assistive technology; a populated value never forwards. */
export function LeadHoneypot(): ReactElement {
  return <div hidden aria-hidden="true"><label>Leave this field empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>;
}
