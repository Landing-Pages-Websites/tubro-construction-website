import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./module-loader.mjs";

function browser(siteKey = "configured-policy-key") {
  const calls = []; const scripts = []; let nextId = 0; let options;
  const enterprise = {
    ready: (callback) => callback(),
    render: (container, settings) => { options = settings; calls.push(["render", container, settings]); return nextId++; },
    reset: (id) => calls.push(["reset", id]),
    execute: async (id, settings) => { calls.push(["execute", id, settings]); return `token-${calls.length}`; },
  };
  const window = { setTimeout, clearTimeout };
  const document = { getElementById: () => scripts[0], createElement: () => ({ remove() { scripts.splice(scripts.indexOf(this), 1); } }), head: { appendChild: (script) => { scripts.push(script); window.grecaptcha = { enterprise }; queueMicrotask(() => script.onload()); } } };
  const api = loadModule("src/lib/recaptcha-client.ts", { window, document, process: { env: { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: siteKey } } });
  return { api, calls, scripts, enterprise, getOptions: () => options };
}

test("policy widget renders explicitly and invisibly, executes only on submit, resets before each fresh token", async () => {
  const { api, calls, scripts } = browser();
  const ready = [];
  const container = { isConnected: true };
  const widget = api.createRecaptchaWidget(container, (value) => ready.push(value));
  await widget.prepare();
  assert.equal(scripts.length, 1);
  assert.match(scripts[0].src, /enterprise\.js\?render=explicit$/);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], container);
  assert.equal(calls[0][2].size, "invisible");
  assert.equal(calls[0][2].action, "lead_submit");
  assert.equal(ready.at(-1), true);
  const first = await widget.getToken();
  assert.notEqual(await widget.getToken(), first);
  assert.deepEqual(calls.slice(1).map((call) => call.slice(0, 2)), [["reset", 0], ["execute", 0], ["reset", 0], ["execute", 0]]);
  assert.equal(calls[2][2].action, "lead_submit");
  widget.dispose();
});

test("multiple forms and remounts own independent widgets while sharing one loader", async () => {
  const { api, calls, scripts } = browser();
  const first = api.createRecaptchaWidget({ isConnected: true });
  const second = api.createRecaptchaWidget({ isConnected: true });
  await Promise.all([first.prepare(), second.prepare()]);
  first.dispose();
  assert.equal(await first.getToken(), null);
  const remount = api.createRecaptchaWidget({ isConnected: true });
  await Promise.all([second.getToken(), remount.getToken()]);
  assert.equal(scripts.length, 1);
  assert.deepEqual(calls.filter(([call]) => call === "execute").map(([, id]) => id), [1, 2]);
  second.dispose(); remount.dispose();
});

test("sentinel mode never loads, renders or executes Google", async () => {
  const { api, calls, scripts } = browser("recaptcha-staging-bypass-key");
  const widget = api.createRecaptchaWidget({ isConnected: true });
  await widget.prepare();
  assert.equal(await widget.getToken(), "recaptcha-staging-bypass-key");
  widget.reset(); widget.dispose();
  assert.equal(scripts.length, 0); assert.equal(calls.length, 0);
});

test("widget render/error/expired/execute failures update readiness and permit retry", async () => {
  const { api, enterprise, getOptions } = browser();
  const ready = [];
  const widget = api.createRecaptchaWidget({ isConnected: true }, (value) => ready.push(value));
  await widget.prepare();
  getOptions()["error-callback"](); assert.equal(ready.at(-1), false);
  assert.ok(await widget.getToken()); assert.equal(ready.at(-1), true);
  getOptions()["expired-callback"](); assert.equal(ready.at(-1), false);
  enterprise.execute = async () => { throw new Error("Google unavailable"); };
  assert.equal(await widget.getToken(), null); assert.equal(ready.at(-1), false);
  widget.dispose();
  const failed = browser();
  failed.enterprise.render = () => { throw new Error("render failed"); };
  assert.equal(await failed.api.createRecaptchaWidget({ isConnected: true }).getToken(), null);
});

test("script failures clear the shared loader so a later form interaction can retry", async () => {
  const scripts = []; let attempts = 0;
  const enterprise = { ready: (cb) => cb(), render: () => 7, reset: () => {}, execute: async () => "fresh-token" };
  const window = { setTimeout, clearTimeout };
  const document = { getElementById: () => scripts[0], createElement: () => ({ remove() { scripts.splice(scripts.indexOf(this), 1); } }), head: { appendChild: (script) => {
    scripts.push(script); attempts++;
    queueMicrotask(() => { if (attempts === 1) script.onerror(); else { window.grecaptcha = { enterprise }; script.onload(); } });
  } } };
  const { createRecaptchaWidget } = loadModule("src/lib/recaptcha-client.ts", { window, document, process: { env: { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "policy-key" } } });
  const widget = createRecaptchaWidget({ isConnected: true });
  assert.equal(await widget.getToken(), null);
  assert.equal(scripts.length, 0);
  assert.equal(await widget.getToken(), "fresh-token");
  assert.equal(scripts.length, 1);
  widget.dispose();
});

test("disposing during prepare never renders into a removed container", async () => {
  let release; let renders = 0;
  const enterprise = { ready: (callback) => { release = callback; }, render: () => { renders++; return 1; }, reset: () => {}, execute: async () => "token" };
  const { createRecaptchaWidget } = loadModule("src/lib/recaptcha-client.ts", { window: { grecaptcha: { enterprise }, setTimeout, clearTimeout }, document: {}, process: { env: { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "policy-key" } } });
  const widget = createRecaptchaWidget({ isConnected: true });
  const pending = widget.prepare();
  widget.dispose(); release(); await pending;
  assert.equal(renders, 0);
  assert.equal(await widget.getToken(), null);
});
