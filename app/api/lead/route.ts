import { NextResponse } from "next/server";
import { verifyLeadProof } from "@/lib/leadProof";

const STAGING_BYPASS = "recaptcha-staging-bypass-key";
const HOSTNAMES = (process.env.RECAPTCHA_HOSTNAMES ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);

function validHost(request: Request): boolean {
  const host = new URL(request.url).hostname.toLowerCase();
  return HOSTNAMES.length === 0 || HOSTNAMES.includes(host);
}

async function verifyRecaptcha(token: string, hostname: string): Promise<boolean> {
  const project = process.env.RECAPTCHA_PROJECT_ID;
  const apiKey = process.env.RECAPTCHA_API_KEY;
  if (!project || !apiKey) return false;
  const response = await fetch(`https://recaptchaenterprise.googleapis.com/v1/projects/${project}/assessments?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: { token, siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, expectedAction: "lead_submit", userAgent: "", userIpAddress: "", } }),
  });
  if (!response.ok) return false;
  const assessment = await response.json() as { tokenProperties?: { valid?: boolean; action?: string; hostname?: string }; riskAnalysis?: { reasons?: string[] } };
  const properties = assessment.tokenProperties;
  return Boolean(properties?.valid && properties.action === "lead_submit" && properties.hostname?.toLowerCase() === hostname && !assessment.riskAnalysis?.reasons?.length);
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ issuedAt: String(Date.now()) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!validHost(request)) return NextResponse.json({ error: "Invalid hostname" }, { status: 403 });
  const body = await request.json() as { captchaToken?: string; form_data?: Record<string, unknown>; [key: string]: unknown };
  const hostname = new URL(request.url).hostname.toLowerCase();
  const staging = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === STAGING_BYPASS;
  const proofAuthorized = await verifyLeadProof(body);
  const authorized = proofAuthorized || (staging ? Boolean(body.captchaToken) : await verifyRecaptcha(String(body.captchaToken ?? ""), hostname));
  if (!authorized) return NextResponse.json({ error: "Captcha verification failed" }, { status: 403 });
  const response = await fetch("https://analytics.gomega.ai/submission/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_id: "b002784f-9543-4362-8814-b7da19078f23", site_id: "f28d515e-437b-4f9b-96c4-bc1a79a3357c", source_provider: "website-tubroconstruction", ...body }) });
  if (!response.ok) return NextResponse.json({ error: "Submission failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}

