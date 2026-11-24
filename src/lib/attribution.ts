/**
 * First-touch ad attribution for lead forms.
 *
 * Ads land visitors on a page (often one with no form, like /aging-in-place)
 * whose calls to action are plain internal links, so the UTMs and click ids are
 * gone from the URL by the time the visitor submits a form. This keeps the
 * values from the first tagged page view of the session in sessionStorage and
 * hands them to every lead submission. Browser-only, and it never throws: an
 * unattributed lead beats no lead.
 */

/** URL query parameter -> lead form_data key. */
const URL_PARAMS = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
  utm_platform: "utmPlatform",
  gclid: "gclid",
  fbclid: "fbclid",
} as const;

const STORAGE_KEY = "tubro_first_touch";
const MAX_VALUE_LENGTH = 500;
const FBCLID_KEY = "fbclid";
const FBC_KEY = "fbc";
const FBC_COOKIE = "_fbc";

export type AttributionFields = Record<string, string>;

function clip(value: string): string {
  return value.slice(0, MAX_VALUE_LENGTH);
}

function fromUrl(search: string): AttributionFields {
  const params = new URLSearchParams(search);
  return Object.fromEntries(Object.entries(URL_PARAMS).flatMap(([param, key]) => {
    const value = params.get(param)?.trim();
    return value ? [[key, clip(value)]] : [];
  }));
}

function readCookie(name: string): string | null {
  try {
    const match = document.cookie.split("; ").find((part) => part.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.slice(name.length + 1)) || null : null;
  } catch {
    return null;
  }
}

function readStored(): AttributionFields | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  } catch {
    return null;
  }
}

function writeStored(fields: AttributionFields): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
  } catch {
    // Storage denied: this page view can still send what its own URL carries.
  }
}

/**
 * True when an _fbc value (fb.<subdomain>.<ms>.<fbclid>[.<appendix>]) is for
 * exactly this click id. Meta may append a dotted suffix after the click id,
 * so the click id must be the whole remainder or end at a dot.
 */
function isFbcForClick(fbc: string, fbclid: string): boolean {
  const click = fbc.split(".").slice(3).join(".");
  return click === fbclid || click.startsWith(`${fbclid}.`);
}

/**
 * The session's fbc. Meta's own _fbc cookie for the first-touch click replaces
 * a derived value (the pixel often writes it after the first capture). Any
 * other cookie never replaces an fbc already kept for the session; with no
 * fbc yet, a UTM-only landing takes the cookie it first sees, and a click id
 * alone gets the documented fb.1.<ms>.<fbclid> form.
 */
function withFbc(fields: AttributionFields): AttributionFields {
  const fbclid = fields[FBCLID_KEY];
  const cookie = readCookie(FBC_COOKIE);
  if (cookie && fbclid && isFbcForClick(cookie, fbclid)) return { ...fields, [FBC_KEY]: clip(cookie) };
  if (fields[FBC_KEY]) return fields;
  if (cookie && !fbclid) return { ...fields, [FBC_KEY]: clip(cookie) };
  return fbclid ? { ...fields, [FBC_KEY]: clip(`fb.1.${Date.now()}.${fbclid}`) } : fields;
}

/**
 * Store the first tagged page view of the session. A later tagged view in the
 * same session does not replace it (first touch). Safe to call on every page.
 */
export function rememberAttribution(): void {
  try {
    if (readStored()) return;
    const landing = fromUrl(window.location.search);
    if (Object.keys(landing).length > 0) writeStored(withFbc(landing));
  } catch {
    // Never let attribution break a page.
  }
}

/**
 * The values a lead should carry: the session's first touch, else this page's
 * own URL. An fbc first observed now is kept for the rest of the session, so a
 * later click's cookie cannot replace it.
 */
export function leadAttribution(): AttributionFields {
  try {
    rememberAttribution();
    const stored = readStored();
    const fields = withFbc(stored ?? fromUrl(window.location.search));
    if (stored && fields[FBC_KEY] !== stored[FBC_KEY]) writeStored(fields);
    return Object.keys(fields).length > 0 ? fields : {};
  } catch {
    return {};
  }
}
