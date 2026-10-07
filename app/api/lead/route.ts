import { NextResponse } from "next/server";
import { captchaMode } from "@/lib/lead-policy";
import { authorizeLead, hasLeadVerification, payloadErrors, readLeadPayload } from "@/lib/lead-server";
import { forwardLead, LeadClaimRefused } from "@/lib/lead-forward";

export const runtime = "nodejs";

function verificationFailed(): NextResponse {
  return NextResponse.json({ code: "verification_failed", error: "Verification failed. Please try again or contact our office." }, { status: 403 });
}

function validRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  return (!origin || origin === url.origin) && captchaMode(url.hostname.toLowerCase(), process.env) !== "denied";
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!validRequest(request)) return NextResponse.json({ error: "Invalid hostname" }, { status: 403 });
  return NextResponse.json({ issuedAt: String(Date.now()) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!validRequest(request)) return NextResponse.json({ error: "Invalid hostname" }, { status: 403 });
  let body;
  try { body = await readLeadPayload(request); }
  catch { return NextResponse.json({ error: "Unable to read this form. Check its size and format, then try again." }, { status: 400 }); }
  if (!hasLeadVerification(body)) return verificationFailed();
  const errors = payloadErrors(body);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please check the highlighted fields.", errors }, { status: 422 });
  const authorization = await authorizeLead(body, new URL(request.url).hostname.toLowerCase());
  if (!authorization) return verificationFailed();
  try { return NextResponse.json(await forwardLead(body, authorization)); }
  catch (error) {
    if (error instanceof LeadClaimRefused) return NextResponse.json({ error: "This verification could not be accepted. Please verify again or call 253-216-2633." }, { status: 403 });
    return NextResponse.json({ error: "We couldn't confirm delivery. Please try again or call 253-216-2633." }, { status: 502 });
  }
}
