/** Identical HTML patterns and application validation on both boundaries. */
export const EMAIL_PATTERN = String.raw`[A-Za-z0-9.!#$%&'*+\/=?^_\x60\{\|\}~\-]+@[A-Za-z0-9](?:[A-Za-z0-9\-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9\-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,63}`;
export const PHONE_PATTERN = String.raw`(?:\([0-9]{3}\)|[0-9]{3})[ .\-]?[0-9]{3}[ .\-]?[0-9]{4}`;
export type LeadFields = Record<string, string | boolean>;
export type LeadErrors = Partial<Record<"name" | "email" | "phone" | "projectDetails" | "projectType" | "consent" | "resume", string>>;
export type FieldRequirements = { consent?: boolean; projectType?: boolean; resume?: boolean; projectTypes?: readonly string[] };
const EMAIL = new RegExp(`^${EMAIL_PATTERN}$`, "v");
const PHONE = new RegExp(`^${PHONE_PATTERN}$`, "v");

export function validateLeadFields(fields: Record<string, unknown>, requirements: FieldRequirements = {}): LeadErrors {
  const errors: LeadErrors = {};
  const text = (key: string): string => typeof fields[key] === "string" ? fields[key].trim() : "";
  if (!text("name") || text("name").length > 150) errors.name = "Please enter your name (up to 150 characters).";
  if (!EMAIL.test(text("email")) || text("email").length > 254) errors.email = "Enter a complete email address, such as name@example.com.";
  if (!PHONE.test(text("phone"))) errors.phone = "Enter exactly 10 US phone digits, without a country code.";
  if (!text("projectDetails") || text("projectDetails").length > 5000) errors.projectDetails = "Please add project details (up to 5,000 characters).";
  if (requirements.projectType && !text("projectType")) errors.projectType = "Please choose a project type.";
  if (requirements.projectTypes && !requirements.projectTypes.includes(text("projectType"))) errors.projectType = "Please choose one of the listed project types.";
  if (requirements.consent && fields.consent !== true) errors.consent = "Please confirm we may contact you about this request.";
  if (requirements.resume && !/\.(pdf|docx?|txt|rtf)$/i.test(text("resumeFileName"))) errors.resume = "Choose a PDF, Word or text résumé file.";
  return errors;
}
