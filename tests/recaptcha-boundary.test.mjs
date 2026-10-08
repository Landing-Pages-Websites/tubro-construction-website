import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";
import { prove } from "./lead-proof-fixture.mjs";
import { verifyLeadProof } from "../src/lib/leadProof.ts";

// Shape-only fixture, not a provisioned Google key.
const siteKey = "6L0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
const publicSiteKey = "6Lez5tstAAAAAD5rZmsQj-68Gl_De9ZNvnC8XWC6";
const disallowedCharacters = ["\n", "\r", "\u2028", "\u2029", " ", "\t", "\0", "!", "+", "/", "=", "é", "Ａ", "\ud800"];
const replacedKeys = disallowedCharacters.flatMap(character => [
  `${siteKey.slice(0, 20)}${character}${siteKey.slice(21)}`,
  `${siteKey.slice(0, -1)}${character}`,
]);
const invalidKeys = [undefined, "", "recaptcha-staging-bypass-key", "unconfigured-key", siteKey.slice(1), `${siteKey}A`, `5L${siteKey.slice(2)}`, `${siteKey.slice(0, -1)}!`, ` ${siteKey}`, `${siteKey}\n`, ...["\n", "\r", "\u2028", "\u2029"].map(ending => `${siteKey.slice(0, -1)}${ending}`),
  ...replacedKeys, ...disallowedCharacters.map(character => `${siteKey}${character}`)];
const fields = { name: "Local Test", email: "local@example.com", phone: "2532162633", projectDetails: "Intercepted only", projectType: "Kitchen or bathroom remodel", consent: true };

test("direct key guard accepts both exact-length valid fixtures and rejects exact-length replacements", () => {
  const { isEnterpriseSiteKey } = clientBrowser(siteKey).load("src/lib/recaptcha-client.ts");
  for (const key of [siteKey, publicSiteKey]) {
    assert.equal(key.length, 40);
    assert.equal(isEnterpriseSiteKey(key), true);
  }
  for (const key of replacedKeys) {
    assert.equal(key.length, 40, "replacement must reach character validation, not just length validation");
    assert.equal(isEnterpriseSiteKey(key), false, JSON.stringify(key));
  }
  for (const key of invalidKeys) assert.equal(isEnterpriseSiteKey(key ?? ""), false, JSON.stringify(key));
});

test("direct key guard enforces the ASCII alphabet for every UTF-16 code unit, embedded and trailing", () => {
  const { isEnterpriseSiteKey } = clientBrowser(siteKey).load("src/lib/recaptcha-client.ts");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  for (let code = 0; code <= 0xffff; code++) {
    const character = String.fromCharCode(code);
    for (const position of [2, 39]) {
      const key = siteKey.slice(0, position) + character + siteKey.slice(position + 1);
      assert.equal(isEnterpriseSiteKey(key), alphabet.includes(character), `U+${code.toString(16)} at ${position}`);
    }
  }
});

test("direct key guard checks every position without trimming or normalizing", () => {
  const { isEnterpriseSiteKey } = clientBrowser(siteKey).load("src/lib/recaptcha-client.ts");
  for (const character of disallowedCharacters) {
    for (let position = 0; position < siteKey.length; position++) {
      const key = siteKey.slice(0, position) + character + siteKey.slice(position + 1);
      assert.equal(key.length, 40);
      assert.equal(isEnterpriseSiteKey(key), false, `${JSON.stringify(character)} at ${position}`);
    }
  }
  for (const prefix of ["6l", "5L", "L6", "AL", "66"]) {
    assert.equal(isEnterpriseSiteKey(prefix + siteKey.slice(2)), false, prefix);
  }
});

function clientBrowser(key, { loaded = true, executeFails = false, emptyToken = false, loadFails = false, timesOut = false } = {}) {
  const scripts = []; const executions = []; const listeners = new Map(); const cache = new Map(); let effect;
  const enterprise = { ready: (callback) => callback(), execute: async (...args) => {
    executions.push(args);
    if (executeFails) throw new Error("Google unavailable");
    if (timesOut) return new Promise(() => {});
    return emptyToken ? "" : "minted-test-token";
  } };
  const window = { location: { search: "?utm_source=local-test" }, grecaptcha: loaded ? { enterprise } : undefined,
    setTimeout: (callback, delay) => { const timer = setTimeout(callback, timesOut ? 0 : delay); if (!timesOut) timer.unref(); return timer; }, clearTimeout };
  class Element { constructor(inForm = true) { this.inForm = inForm; } closest(selector) { return selector === "form" && this.inForm; } }
  const document = { documentElement: { dataset: {} }, createElement: () => ({ remove() { this.removed = true; } }),
    getElementById: (id) => scripts.find(script => script.id === id && !script.removed),
    head: { appendChild: (script) => { scripts.push(script); if (loadFails) queueMicrotask(() => script.onerror()); } },
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name, callback) => { assert.equal(listeners.get(name), callback); listeners.delete(name); } };
  const globals = { window, document, Element, URLSearchParams, process: { env: { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: key } },
    moduleMocks: { react: { useEffect: (callback) => { effect = callback; } } } };
  const load = (file) => loadModule(file, globals, cache);
  return { load, globals, cache, scripts, executions, listeners, enterprise, window, document, Element, runEffect: () => effect() };
}

test("invalid public keys never execute even a preloaded Enterprise or mint an always-pass token", async () => {
  for (const key of invalidKeys) {
    for (const loaded of [false, true]) {
      const h = clientBrowser(key, { loaded });
      const api = h.load("src/lib/recaptcha-client.ts");
      await assert.rejects(api.loadRecaptcha(), /not configured/, String(key));
      await assert.rejects(api.mintCaptchaToken(), /secure fallback/, String(key));
      assert.equal(h.executions.length, 0);
      assert.equal(h.scripts.length, 0);
    }
  }
});

test("invalid public keys never register the Bootstrap Enterprise loader", () => {
  for (const key of invalidKeys) {
    const h = clientBrowser(key, { loaded: false });
    h.load("src/components/analytics/RecaptchaBootstrap.tsx").RecaptchaBootstrap();
    h.runEffect();
    assert.equal(h.listeners.size, 0, String(key));
    assert.equal(h.scripts.length, 0);
  }
});

test("valid key Bootstrap defers until form focus, shares one loader and cleans up", async () => {
  const h = clientBrowser(siteKey, { loaded: false });
  h.load("src/components/analytics/RecaptchaBootstrap.tsx").RecaptchaBootstrap();
  const cleanup = h.runEffect();
  const prepare = h.listeners.get("focusin");
  prepare({ target: {} });
  prepare({ target: new h.Element(false) });
  assert.equal(h.scripts.length, 0);
  prepare({ target: new h.Element() }); prepare({ target: new h.Element() });
  assert.equal(h.scripts.length, 1);
  assert.equal(h.scripts[0].async, true);
  assert.equal(h.document.documentElement.dataset.recaptchaSitekey, siteKey);
  assert.equal(h.scripts[0].src, `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`);
  h.window.grecaptcha = { enterprise: h.enterprise }; h.scripts[0].onload();
  assert.equal(await h.load("src/lib/recaptcha-client.ts").mintCaptchaToken(), "minted-test-token");
  assert.equal(h.executions[0][0], siteKey);
  assert.equal(h.executions[0][1].action, "lead_submit");
  cleanup(); assert.equal(h.listeners.size, 0);
});

test("Bootstrap loader failure is handled, removes the script and permits one shared retry", async () => {
  const h = clientBrowser(siteKey, { loaded: false });
  h.load("src/components/analytics/RecaptchaBootstrap.tsx").RecaptchaBootstrap();
  const cleanup = h.runEffect(); const prepare = h.listeners.get("focusin");
  const api = h.load("src/lib/recaptcha-client.ts");
  prepare({ target: new h.Element() });
  const failed = assert.rejects(api.loadRecaptcha(), /couldn't load/);
  h.scripts[0].onerror(); await failed;
  assert.equal(h.scripts[0].removed, true);
  prepare({ target: new h.Element() }); prepare({ target: new h.Element() });
  assert.equal(h.scripts.length, 2);
  h.window.grecaptcha = { enterprise: h.enterprise }; h.scripts[1].onload();
  assert.equal(await api.mintCaptchaToken(), "minted-test-token");
  cleanup(); assert.equal(h.listeners.size, 0);
});

test("provider readiness gates execution", async () => {
  const h = clientBrowser(siteKey); let ready;
  h.enterprise.ready = (callback) => { ready = callback; };
  const pending = h.load("src/lib/recaptcha-client.ts").mintCaptchaToken();
  assert.equal(h.executions.length, 0);
  ready(); assert.equal(await pending, "minted-test-token");
  assert.equal(h.executions.length, 1);
});

test("invalid keys and real-key client failures reach the existing payload-bound proof fallback", async () => {
  const cases = [...invalidKeys.map(key => [key, {}]), [siteKey, { executeFails: true }], [siteKey, { emptyToken: true }],
    [siteKey, { loaded: false, loadFails: true }], [siteKey, { loaded: false, timesOut: true }], [siteKey, { timesOut: true }]];
  for (const [key, options] of cases) {
    const h = clientBrowser(key, options); const requests = [];
    h.globals.moduleMocks["./leadProof"] = { solveLeadProof: async (payload, issuedAt) => prove(payload, issuedAt).powNonce };
    h.globals.fetch = async (url, options) => {
      assert.equal(url, "/api/lead");
      const body = options.body && JSON.parse(options.body);
      requests.push({ method: options.method || "GET", body });
      return Response.json(body ? { ok: true } : { issuedAt: String(Date.now()) });
    };
    await h.load("src/lib/lead-client.ts").postLead("schedule_estimate", fields, "/schedule-an-estimate");
    assert.deepEqual(requests.map(request => request.method), ["GET", "POST"]);
    const body = requests[1].body;
    assert.equal("captchaToken" in body, false);
    assert.equal(await verifyLeadProof(body), true);
    assert.equal(await verifyLeadProof({ ...body, form_data: { ...body.form_data, email: "changed@example.com" } }), false);
    assert.equal(body.form_data.utmSource, "local-test");
    assert.equal(h.executions.length, key === siteKey && options.loaded !== false ? 1 : 0);
    if (options.loaded === false) assert.equal(h.scripts[0].removed, true);
  }
});

test("client import graph and sources contain no server policy or staging bypass", () => {
  const h = clientBrowser(siteKey);
  for (const file of ["src/lib/recaptcha-client.ts", "src/lib/lead-client.ts", "src/components/analytics/RecaptchaBootstrap.tsx"]) h.load(file);
  for (const file of h.cache.keys()) {
    assert.doesNotMatch(file, /lead-(policy|server|forward)\.ts$/);
    assert.doesNotMatch(readFileSync(file, "utf8"), /STAGING_SENTINEL|recaptcha-staging-bypass-key/);
  }
});

test("staging client fallback reaches the durable claim boundary and requires marked receiver success", async () => {
  const host = "tubro-construction-website-local-test-mega-websites.vercel.app";
  const key = "recaptcha-staging-bypass-key";
  for (const accepted of [true, false]) {
    const h = clientBrowser(key, { loaded: false }); const claims = [];
    const env = { VERCEL_ENV: "preview", VERCEL_URL: host, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: key, LEAD_PROOF_CLAIM_TOKEN: "a".repeat(64) };
    const route = loadModule("app/api/lead/route.ts", { process: { env }, fetch: async (url, options) => {
      assert.equal(url, "https://analytics.gomega.ai/submission/submit");
      claims.push(JSON.parse(options.body));
      return Response.json(accepted ? { ok: true, proof_claim: "claimed", id: "local-only" } : { ok: true });
    } });
    h.globals.moduleMocks["./leadProof"] = { solveLeadProof: async (payload, issuedAt) => prove(payload, issuedAt).powNonce };
    h.globals.fetch = async (url, options) => {
      assert.equal(url, "/api/lead");
      const request = new Request(`https://${host}${url}`, options);
      return options.method === "POST" ? route.POST(request) : route.GET(request);
    };
    const submission = h.load("src/lib/lead-client.ts").postLead("schedule_estimate", fields, "/schedule-an-estimate");
    if (accepted) await submission;
    else await assert.rejects(submission, /confirm|send|delivery/i);
    assert.equal(claims.length, 1);
    assert.match(claims[0].proof_claim.issued_at, /^\d{13}$/);
    assert.match(claims[0].proof_claim.nonce, /^\d+$/);
    assert.equal(claims[0].form_data.spamCheck, "Unverified: reCAPTCHA did not pass; passed fallback check");
    assert.equal("captchaToken" in claims[0], false);
    assert.equal(h.scripts.length, 0); assert.equal(h.executions.length, 0);
  }
});
