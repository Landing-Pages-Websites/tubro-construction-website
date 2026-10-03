/** One careers résumé, matching MEGA's supported MIME allowlist and 25 MiB limit. */
export const MAX_RESUME_BYTES = 25 * 1024 * 1024;
export const RESUME_ACCEPT = ".pdf,.doc,.docx,.txt";
const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf", doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", txt: "text/plain",
};
export const UPLOAD_CUSTOMER_ID = "b002784f-9543-4362-8814-b7da19078f23";
export const UPLOAD_SITE_ID = "f28d515e-437b-4f9b-96c4-bc1a79a3357c";
const OWNED_PREFIX = `lead-uploads/pending/${UPLOAD_CUSTOMER_ID}/`;
const MAX_FILENAME_LENGTH = 255;
const MAX_KEY_LENGTH = 1024;
export type RequestedUpload = { fileName: string; contentType: string; sizeBytes: number };
export type SignedUpload = RequestedUpload & { s3Key: string; uploadUrl: string };
export type AttachmentStatus = "none" | "uploaded" | "failed";

function mappedType(name: string): string {
  const extension = name.split(".").at(-1)?.toLowerCase() ?? "";
  return Object.hasOwn(MIME_BY_EXTENSION, extension) ? MIME_BY_EXTENSION[extension] : "";
}

export function resumeFileError(file: Pick<File, "name" | "type" | "size">): string | null {
  const type = mappedType(file.name);
  if (!type || (file.type && file.type !== type) || !file.name.trim() || file.name.length > MAX_FILENAME_LENGTH || /[\x00-\x1f\\/]/.test(file.name)) return "Choose a PDF, Word (.doc or .docx), or TXT résumé file. RTF is not supported.";
  if (!Number.isInteger(file.size) || file.size <= 0) return "Choose a résumé file that is not empty.";
  if (file.size > MAX_RESUME_BYTES) return "Choose a résumé file of 25 MB or smaller.";
  return null;
}

export function describeResume(file: File): RequestedUpload {
  return { fileName: file.name, contentType: mappedType(file.name), sizeBytes: file.size };
}

export function parseRequestedResume(value: unknown): RequestedUpload | null {
  if (!Array.isArray(value) || value.length !== 1) return null;
  const file = value[0] as Partial<RequestedUpload> | null;
  if (!file || typeof file.fileName !== "string" || typeof file.contentType !== "string" || typeof file.sizeBytes !== "number") return null;
  if (file.contentType !== mappedType(file.fileName) || resumeFileError({ name: file.fileName, type: file.contentType, size: file.sizeBytes })) return null;
  return { fileName: file.fileName, contentType: file.contentType, sizeBytes: file.sizeBytes };
}

export function ownedUploadKey(value: unknown): value is string {
  if (typeof value !== "string" || !value.startsWith(OWNED_PREFIX) || value.length > MAX_KEY_LENGTH) return false;
  const parts = value.slice(OWNED_PREFIX.length).split("/");
  return parts.length >= 2 && parts.every(part => Boolean(part) && part !== "." && part !== "..") && !/[\x00-\x1f\x7f\\]/.test(value);
}

function safeSignedUrl(value: unknown, key: string): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    const path = decodeURIComponent(url.pathname);
    return url.protocol === "https:" && !url.username && !url.password && !url.port && !url.hash
      && /^(?:[a-z0-9.-]+\.)?s3(?:[.-][a-z0-9-]+)?\.amazonaws\.com$/.test(url.hostname)
      && (path === `/${key}` || path.slice(path.indexOf("/", 1)) === `/${key}`)
      && url.searchParams.get("X-Amz-Algorithm") === "AWS4-HMAC-SHA256"
      && /^[a-f0-9]{64}$/i.test(url.searchParams.get("X-Amz-Signature") ?? "");
  } catch { return false; }
}

/** Refuse the whole response on a missing, mismatched or unsafe upload. */
export function parseSignedResume(value: unknown, requested: RequestedUpload): SignedUpload | null {
  if (!value || typeof value !== "object" || !("uploads" in value)) return null;
  const uploads = value.uploads;
  if (!Array.isArray(uploads) || uploads.length !== 1) return null;
  const upload = uploads[0] as Partial<SignedUpload> | null;
  if (!upload || !ownedUploadKey(upload.s3Key) || !safeSignedUrl(upload.uploadUrl, upload.s3Key)) return null;
  if (upload.contentType !== requested.contentType || upload.sizeBytes !== requested.sizeBytes) return null;
  return { ...requested, s3Key: upload.s3Key, uploadUrl: upload.uploadUrl };
}
