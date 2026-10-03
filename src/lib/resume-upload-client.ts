import { requestUploadToken } from "./recaptcha-client";
import { STAGING_SENTINEL } from "./lead-policy";
import { describeResume, parseSignedResume } from "./lead-uploads";

type AttachmentClaim = { uploadKeys: string[]; uploadSignedKeys: string[]; uploadCapability: string };
const SIGN_TIMEOUT = 25_000;
const PUT_TIMEOUT = 120_000;

async function submissionBinding(token: string): Promise<string> {
  try {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
  } catch { throw new Error("Résumé upload verification is unavailable."); }
}

async function signAndUpload(file: File, token: string, binding: string): Promise<AttachmentClaim | null> {
  try {
    const requested = describeResume(file);
    const response = await fetch("/api/lead/upload-url", {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(SIGN_TIMEOUT),
      body: JSON.stringify({ captchaToken: token, submissionBinding: binding, files: [requested] }),
    });
    if (!response.ok) return null;
    const result: unknown = await response.json();
    const upload = parseSignedResume(result, requested);
    const capability = result && typeof result === "object" && "capability" in result ? result.capability : null;
    if (!upload || typeof capability !== "string" || !/^v1\.\d{13}\.[\w-]{43}$/.test(capability)) return null;
    const put = await fetch(upload.uploadUrl, {
      method: "PUT", signal: AbortSignal.timeout(PUT_TIMEOUT), redirect: "error", credentials: "omit",
      // Both are signed. The browser sets Content-Length from the File body.
      headers: { "Content-Type": upload.contentType, "If-None-Match": "*" }, body: file,
    });
    if (!put.ok) return null;
    return { uploadKeys: [upload.s3Key], uploadSignedKeys: [upload.s3Key], uploadCapability: capability };
  } catch { return null; } // Caller explicitly reports that the résumé was not sent.
}

/** Keep the submission token unconsumed; signing uses its own action and token. */
export async function uploadResume(file: File, submitToken: string): Promise<AttachmentClaim | null> {
  try {
    const binding = await submissionBinding(submitToken);
    const signingToken = await requestUploadToken();
    if (!signingToken || (signingToken === submitToken && signingToken !== STAGING_SENTINEL)) return null;
    return await signAndUpload(file, signingToken, binding);
  } catch { return null; }
}
