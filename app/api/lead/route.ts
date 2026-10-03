import { NextResponse } from "next/server";
import { captchaMode } from "@/lib/lead-policy";
import { issueChallenge, proofAvailable } from "@/lib/lead-challenge";
import { authorizeLeadUploads, payloadErrors, readLeadPayload, upstreamPayload, verifyLead } from "@/lib/lead-server";

export const runtime = "nodejs";

function validOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function verificationFailed(): NextResponse {
  return NextResponse.json({ error: "Verification failed. Please try again or contact our office.", code: "verification_failed" }, { status: 403 });
}

export async function GET(request: Request): Promise<NextResponse> {
  const host = new URL(request.url).hostname.toLowerCase();
  if (!validOrigin(request) || captchaMode(host, process.env) === "denied") return NextResponse.json({ error: "Invalid hostname" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  if (!proofAvailable()) return NextResponse.json({ error: "Verification fallback is unavailable. Please retry verification or contact our office." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  try {
    const challenge = issueChallenge(host);
    if (!challenge) throw new Error("Verification signing is unavailable.");
    return NextResponse.json({ issuedAt: challenge.powIssuedAt, powChallenge: challenge.powChallenge, powSignature: challenge.powSignature }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Verification couldn't load. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}

export async function POST(request: Request): Promise<NextResponse> {
  const host = new URL(request.url).hostname.toLowerCase();
  if (!validOrigin(request) || captchaMode(host, process.env) === "denied") return NextResponse.json({ error: "Invalid hostname" }, { status: 403 });
  let body;
  try { body = await readLeadPayload(request); }
  catch { return NextResponse.json({ error: "Unable to read this form. Check its size and format, then try again." }, { status: 400 }); }
  const authorization = await verifyLead(body, host);
  if (!authorization.ok) return verificationFailed();
  const errors = payloadErrors(body);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please check the highlighted fields.", errors }, { status: 422 });
  if (!authorizeLeadUploads(body)) return verificationFailed();
  try {
    const response = await fetch("https://analytics.gomega.ai/submission/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(upstreamPayload(body, authorization.spamCheck)), signal: AbortSignal.timeout(15000) });
    if (!response.ok) return NextResponse.json({ error: "We couldn't send your request. Please try again." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "The office connection is unavailable. Please try again or call 253-216-2633." }, { status: 502 }); }
}
