import { isMegaPreviewMode } from "./preview_mode.mjs";

/** Phase 1 pinned/preview-csp.txt without frame-ancestors, which Joe's proxy adds (P9-D29). */
export const MEGA_PREVIEW_CSP = "default-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.gomega.ai/review-bridge/; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self' blob:; worker-src 'self' blob:; manifest-src 'self'; frame-src 'none'; child-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'";
export const MEGA_PREVIEW_HEADERS = Object.freeze([
  { key: "Content-Security-Policy", value: MEGA_PREVIEW_CSP },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=()" },
  { key: "Cache-Control", value: "no-store" },
]);
const DEV_ORIGIN = "*.megabuild.ai";
const CSP_HEADERS = new Set(["content-security-policy", "content-security-policy-report-only"]);
const FRAMING_DIRECTIVE = "frame-ancestors";
const EXTERNAL = /^https?:\/\//iu;

/** A CSP value is a comma-separated policy list of `;`-separated directives; keep every directive but frame-ancestors. */
function withoutFrameAncestors(csp) {
  return csp
    .split(",")
    .map((policy) => policy.split(";").map((d) => d.trim()).filter((d) => d && d.split(/\s+/u)[0].toLowerCase() !== FRAMING_DIRECTIVE).join("; "))
    .filter(Boolean)
    .join(", ");
}

/** The site's header with its framing restriction removed, or null when nothing else is left. */
function unframed(header) {
  const key = header.key.toLowerCase();
  if (key === "x-frame-options") return null;
  if (!CSP_HEADERS.has(key)) return header;
  const value = withoutFrameAncestors(header.value);
  return value ? { ...header, value } : null;
}

/** Next rejects a header rule with no headers ("Invalid header found") and exits, so rules left empty are dropped. */
function withoutSiteFraming(rules) {
  return (rules ?? [])
    .map((rule) => ({ ...rule, headers: (rule.headers ?? []).map(unframed).filter(Boolean) }))
    .filter((rule) => rule.headers.length > 0);
}

function withoutExternalRewrites(rewrites) {
  const keep = (rules = []) => rules.filter((rule) => !EXTERNAL.test(rule.destination));
  if (Array.isArray(rewrites)) return keep(rewrites);
  return { beforeFiles: keep(rewrites.beforeFiles), afterFiles: keep(rewrites.afterFiles), fallback: keep(rewrites.fallback) };
}

function previewOverrides(config) {
  return {
    async headers() {
      const site = config.headers ? await config.headers() : [];
      return [...withoutSiteFraming(site), { source: "/:path*", headers: [...MEGA_PREVIEW_HEADERS] }];
    },
    async rewrites() {
      return config.rewrites ? withoutExternalRewrites(await config.rewrites()) : [];
    },
  };
}

/** Without preview mode every build, dev or production, gets the very same object back. */
export function withMegaPreview(config, env = process.env) {
  if (!isMegaPreviewMode(env)) return config;
  const next = { ...config, ...previewOverrides(config) };
  if (env.NODE_ENV === "development") next.allowedDevOrigins = [...new Set([...(config.allowedDevOrigins ?? []), DEV_ORIGIN])];
  return next;
}
