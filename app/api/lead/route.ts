import { NextResponse } from "next/server";
import { captchaMode } from "@/lib/lead-policy";
import { issueChallenge, proofAvailable } from "@/lib/lead-challenge";
import { authorizeLead, payloadErrors, readLeadPayload, upstreamPayload } from "@/lib/lead-server";

export const runtime = "nodejs";

function validOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function GET(request: Request): Promise<NextResponse> {
  const host = new URL(request.url).hostname.toLowerCase();
  if (!validOrigin(request) || captchaMode(host, process.env) === "denied") return NextResponse.json({ error: "Invalid hostname" }, { status: 403 });
  if (!proofAvailable()) return NextResponse.json({ error: "Verification fallback is unavailable. Please retry verification or contact our office." }, { status: 503 });
  return NextResponse.json(issueChallenge(host), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request): Promise<NextResponse> {
  const host = new URL(request.url).hostname.toLowerCase();
  if (!validOrigin(request) || captchaMode(host, process.env) === "denied") return NextResponse.json({ error: "Invalid hostname" }, { status: 403 });
  let body;
  try { body = await readLeadPayload(request); }
  catch { return NextResponse.json({ error: "Unable to read this form. Check its size and format, then try again." }, { status: 400 }); }
  const errors = payloadErrors(body);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please check the highlighted fields.", errors }, { status: 422 });
  if (!await authorizeLead(body, host)) return NextResponse.json({ error: "Verification failed. Please try again or contact our office." }, { status: 403 });
  try {
    const response = await fetch("https://analytics.gomega.ai/submission/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(upstreamPayload(body)), signal: AbortSignal.timeout(15000) });
    if (!response.ok) return NextResponse.json({ error: "We couldn't send your request. Please try again." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "The office connection is unavailable. Please try again or call 253-216-2633." }, { status: 502 }); }
}
