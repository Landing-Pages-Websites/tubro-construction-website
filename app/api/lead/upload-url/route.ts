import { NextResponse } from "next/server";
import { captchaMode } from "@/lib/lead-policy";
import { authorizeUpload, readLeadPayload } from "@/lib/lead-server";
import { issueUploadCapability } from "@/lib/upload-capability";
import { parseRequestedResume, parseSignedResume, UPLOAD_CUSTOMER_ID, UPLOAD_SITE_ID, type RequestedUpload } from "@/lib/lead-uploads";

export const runtime = "nodejs";
const MAX_SIGNING_BODY_BYTES = 4096;
const UPLOAD_URL_ENDPOINT = "https://analytics.gomega.ai/submission/upload-url";
const UPSTREAM_TIMEOUT = 15_000;

function error(message: string, status: number): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

async function signResume(file: RequestedUpload, binding: string): Promise<NextResponse> {
  try {
    const response = await fetch(UPLOAD_URL_ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(UPSTREAM_TIMEOUT),
      body: JSON.stringify({ customer_id: UPLOAD_CUSTOMER_ID, site_id: UPLOAD_SITE_ID, files: [file] }),
    });
    if (!response.ok) return error("Your résumé cannot be uploaded right now. Your application can still be sent without it.", 502);
    const upload = parseSignedResume(await response.json(), file);
    if (!upload) return error("The résumé upload service returned an invalid response.", 502);
    const signedKeys = [upload.s3Key];
    const capability = issueUploadCapability(signedKeys, binding);
    if (!capability) return error("Résumé upload authorization is unavailable.", 503);
    return NextResponse.json({ ok: true, uploads: [upload], signedKeys, capability }, { headers: { "Cache-Control": "no-store" } });
  } catch { return error("The résumé upload service is unavailable. Your application can still be sent without it.", 502); }
}

export async function POST(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const origin = request.headers.get("origin");
  if ((origin && origin !== url.origin) || captchaMode(host, process.env) === "denied") return error("Invalid hostname.", 403);
  try {
    const body = await readLeadPayload(request, MAX_SIGNING_BODY_BYTES);
    const file = parseRequestedResume(body.files);
    const binding = body.submissionBinding;
    if (!file || typeof binding !== "string" || !/^[0-9a-f]{64}$/.test(binding)) return error("Choose one PDF, Word or TXT résumé of 25 MB or smaller.", 400);
    if (!await authorizeUpload(body.captchaToken, host)) return error("Résumé verification failed. Your application can still be sent without it.", 403);
    if (!process.env.LEAD_UPLOAD_SIGNING_SECRET) return error("Résumé upload authorization is unavailable.", 503);
    return await signResume(file, binding);
  } catch { return error("Unable to read the résumé upload request. Check its size and format.", 400); }
}
