import { NextResponse } from "next/server";
import { captchaMode } from "@/lib/lead-policy";
import { authorizeLead, hasLeadVerification, payloadErrors, readLeadPayload } from "@/lib/lead-server";
import { forwardLead } from "@/lib/lead-forward";

export const runtime = "nodejs";

function verificationFailed(): NextResponse {
  return NextResponse.json({ code: "verification_failed", error: "We couldn't verify this request. Please refresh the page and try again." }, { status: 403 });
}

function validRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  return (!origin || origin === url.origin) && captchaMode(url.hostname.toLowerCase(), process.env) !== "denied";
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!validRequest(request)) return NextResponse.json({ error: "Invalid hostname" }, { status: 403 });
  let body;
  try { body = await readLeadPayload(request); }
  catch { return NextResponse.json({ error: "Unable to read this form. Check its size and format, then try again." }, { status: 400 }); }
  if (!hasLeadVerification(body)) return verificationFailed();
  const errors = payloadErrors(body);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please check the highlighted fields.", errors }, { status: 422 });
  if (!await authorizeLead(body, new URL(request.url).hostname.toLowerCase())) return verificationFailed();
  try { return NextResponse.json(await forwardLead(body)); }
  catch { return NextResponse.json({ error: "We couldn't confirm delivery. Please try again or call 253-216-2633." }, { status: 502 }); }
}
