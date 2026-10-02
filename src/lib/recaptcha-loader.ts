import { STAGING_SENTINEL } from "./lead-policy";

export type RenderOptions = { sitekey: string; size: "invisible"; action: string; "error-callback": () => void; "expired-callback": () => void };
export type Enterprise = { ready: (callback: () => void) => void; render: (container: HTMLElement, options: RenderOptions) => number; execute: (id: number, options: { action: string }) => Promise<string>; reset: (id: number) => void };
declare global { interface Window { grecaptcha?: { enterprise?: Enterprise }; } }
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
const SCRIPT_ID = "tubro-recaptcha-enterprise";
const LOAD_TIMEOUT = 10_000;
let loading: Promise<Enterprise> | undefined;

function enterpriseLoader(): Promise<Enterprise> {
  return new Promise((resolve, reject) => {
    if (!RECAPTCHA_SITE_KEY || RECAPTCHA_SITE_KEY === STAGING_SENTINEL) { reject(new Error("Enterprise verification is not configured.")); return; }
    const fail = (): void => { window.clearTimeout(timeout); reject(new Error("Verification couldn't load. Please try again.")); };
    const timeout = window.setTimeout(fail, LOAD_TIMEOUT);
    const ready = (): void => {
      const enterprise = window.grecaptcha?.enterprise;
      if (!enterprise) { fail(); return; }
      try { enterprise.ready(() => { window.clearTimeout(timeout); resolve(enterprise); }); }
      catch { fail(); }
    };
    if (window.grecaptcha?.enterprise) { ready(); return; }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://www.google.com/recaptcha/enterprise.js?render=explicit";
    script.async = true; script.defer = true;
    script.onload = ready; script.onerror = fail;
    document.head.appendChild(script);
  });
}

export async function loadRecaptcha(): Promise<Enterprise> {
  try { loading ??= enterpriseLoader(); return await loading; }
  catch (error) { loading = undefined; document.getElementById(SCRIPT_ID)?.remove(); throw error; }
}
