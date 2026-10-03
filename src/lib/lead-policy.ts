export const STAGING_SENTINEL = "recaptcha-staging-bypass-key";
export type CaptchaMode = "denied" | "staging" | "enterprise";
type Environment = Record<string, string | undefined>;

function exactHosts(value: string | undefined): string[] {
  return (value || "").split(",").map((host) => host.trim().toLowerCase()).filter((host) => /^[a-z0-9.-]+$/.test(host));
}

export function captchaMode(hostname: string, env: Environment): CaptchaMode {
  const host = hostname.toLowerCase();
  const stagingEnv = env.VERCEL_ENV === "preview" || env.VERCEL_ENV === "development";
  const previews = [env.VERCEL_URL, env.VERCEL_BRANCH_URL, ...exactHosts(env.RECAPTCHA_STAGING_HOSTNAMES)]
    .filter((value): value is string => Boolean(value && /^tubro-construction-website-[a-z0-9-]+-mega-websites\.vercel\.app$/.test(value)));
  const development = env.VERCEL_ENV === "development" && ["localhost", "127.0.0.1"].includes(host);
  if (stagingEnv && (previews.includes(host) || development)) {
    return env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === STAGING_SENTINEL ? "staging" : "enterprise";
  }
  const productionHost = exactHosts(env.RECAPTCHA_HOSTNAMES).includes(host) && !host.endsWith(".vercel.app");
  if (!productionHost || !env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === STAGING_SENTINEL) return "denied";
  return "enterprise";
}

export function stagingTokenAccepted(mode: CaptchaMode, token: unknown): boolean {
  return mode === "staging" && token === STAGING_SENTINEL;
}
