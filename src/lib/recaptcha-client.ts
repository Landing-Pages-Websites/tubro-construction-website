type Enterprise = { ready: (callback: () => void) => void; execute: (key: string, options: { action: string }) => Promise<string> };
declare global { interface Window { grecaptcha?: { enterprise?: Enterprise }; } }
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
const ENTERPRISE_SITE_KEY_LENGTH = 40;
const LOAD_TIMEOUT = 10_000;
let loading: Promise<Enterprise> | undefined;

/** Format guard only; Google and the server still verify the key and token. */
export function isEnterpriseSiteKey(siteKey: string): boolean {
  return siteKey.length === ENTERPRISE_SITE_KEY_LENGTH && /^6L[A-Za-z0-9_-]+$/.test(siteKey);
}

function enterpriseLoader(): Promise<Enterprise> {
  return new Promise((resolve, reject) => {
    if (!isEnterpriseSiteKey(SITE_KEY)) { reject(new Error("Enterprise verification is not configured.")); return; }
    const timeout = window.setTimeout(() => reject(new Error("Verification timed out. Please try again.")), LOAD_TIMEOUT);
    const ready = (): void => {
      const enterprise = window.grecaptcha?.enterprise;
      if (!enterprise) return;
      enterprise.ready(() => { window.clearTimeout(timeout); resolve(enterprise); });
    };
    if (window.grecaptcha?.enterprise) { ready(); return; }
    const script = document.createElement("script");
    script.id = "tubro-recaptcha-enterprise";
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(SITE_KEY)}`;
    script.async = true;
    script.onload = ready;
    script.onerror = () => { window.clearTimeout(timeout); script.remove(); reject(new Error("Verification couldn't load.")); };
    document.head.appendChild(script);
  });
}

export async function loadRecaptcha(): Promise<Enterprise> {
  try { loading ??= enterpriseLoader(); return await loading; }
  catch (error) { loading = undefined; document.getElementById("tubro-recaptcha-enterprise")?.remove(); throw error; }
}

export async function mintCaptchaToken(): Promise<string> {
  try {
    const enterprise = await loadRecaptcha();
    const token = await Promise.race([enterprise.execute(SITE_KEY, { action: "lead_submit" }), new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("Verification timed out.")), LOAD_TIMEOUT))]);
    if (!token) throw new Error("Verification returned no token.");
    return token;
  } catch { throw new Error("Verification is unavailable. Trying the secure fallback."); }
}
