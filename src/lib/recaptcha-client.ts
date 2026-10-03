import { STAGING_SENTINEL } from "./lead-policy";
import { loadRecaptcha, RECAPTCHA_SITE_KEY, type Enterprise } from "./recaptcha-loader";

export type RecaptchaHandle = { getToken: () => Promise<string | null>; reset: () => void };
type Widget = RecaptchaHandle & { prepare: () => Promise<void>; dispose: () => void };
type WidgetState = {
  container: HTMLElement; action: "lead_submit" | "lead_upload"; id: number | null; api?: Enterprise; disposed: boolean;
  onReady: (ready: boolean) => void; preparing?: Promise<void>; reject?: () => void;
};
const EXECUTE_TIMEOUT = 30_000;

function unavailable(state: WidgetState): void {
  state.reject?.();
  if (!state.disposed) state.onReady(false);
}

async function renderWidget(state: WidgetState): Promise<void> {
  try {
    if (RECAPTCHA_SITE_KEY === STAGING_SENTINEL) { state.onReady(true); return; }
    const api = await loadRecaptcha();
    if (state.disposed || !state.container.isConnected) return;
    state.api = api;
    let failed = false;
    const fail = (): void => { failed = true; unavailable(state); };
    state.id = api.render(state.container, { sitekey: RECAPTCHA_SITE_KEY, size: "invisible", action: state.action, "error-callback": fail, "expired-callback": fail });
    state.onReady(!failed);
  } catch { unavailable(state); }
}

async function prepareWidget(state: WidgetState): Promise<void> {
  if (state.disposed || state.id !== null) return;
  try { state.preparing ??= renderWidget(state); await state.preparing; }
  catch { unavailable(state); }
  finally { state.preparing = undefined; }
}

function resetWidget(state: WidgetState): void {
  try { if (state.id !== null) state.api?.reset(state.id); }
  catch { unavailable(state); }
}

async function getToken(state: WidgetState): Promise<string | null> {
  if (state.disposed) return null;
  if (RECAPTCHA_SITE_KEY === STAGING_SENTINEL) return STAGING_SENTINEL;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await prepareWidget(state);
    if (state.disposed || !state.container.isConnected || state.id === null || !state.api) return null;
    state.api.reset(state.id);
    const failed = new Promise<never>((_, reject) => {
      state.reject = () => reject(new Error("Verification couldn't finish."));
      timer = setTimeout(state.reject, EXECUTE_TIMEOUT);
    });
    const token = await Promise.race([state.api.execute(state.id, { action: state.action }), failed]);
    if (!token || state.disposed) return null;
    state.onReady(true);
    return token;
  } catch { unavailable(state); return null; }
  finally { clearTimeout(timer); state.reject = undefined; }
}

/** One explicit invisible widget per mounted form; preparation never mints a token. */
export function createRecaptchaWidget(container: HTMLElement, onReady: (ready: boolean) => void = () => {}, action: "lead_submit" | "lead_upload" = "lead_submit"): Widget {
  const state: WidgetState = { container, action, id: null, disposed: false, onReady };
  return {
    prepare: () => prepareWidget(state),
    getToken: () => getToken(state),
    reset: () => resetWidget(state),
    dispose: () => { state.disposed = true; state.reject?.(); resetWidget(state); state.id = null; },
  };
}

/** A clean invisible signing widget leaves the form's lead_submit token untouched. */
export async function requestUploadToken(): Promise<string | null> {
  if (RECAPTCHA_SITE_KEY === STAGING_SENTINEL) return STAGING_SENTINEL;
  const container = document.createElement("div");
  container.dataset.recaptchaUploadContainer = "";
  const widget = createRecaptchaWidget(container, () => {}, "lead_upload");
  try {
    document.body.appendChild(container);
    return await widget.getToken();
  } catch { return null; }
  finally { widget.dispose(); container.remove(); }
}
