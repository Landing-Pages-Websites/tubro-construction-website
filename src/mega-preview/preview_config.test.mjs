import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { describe, it } from "node:test";

import { MEGA_PREVIEW_CSP, withMegaPreview } from "./preview_config.mjs";

const site = () => ({
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Frame-Options", value: "DENY" }, { key: "Content-Security-Policy", value: "frame-ancestors 'none'" }, { key: "X-Site", value: "kept" }] }];
  },
  async rewrites() {
    return [{ source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" }, { source: "/old", destination: "/new" }];
  },
});
const PREVIEW_ENV = { NODE_ENV: "development", MEGA_PREVIEW_MODE: "1" };
const { checkCustomRoutes } = createRequire(import.meta.url)("next/dist/lib/load-custom-routes.js");

/** Next's own header-rule validation, which exits the process on a bad rule; turned into a throw. */
function assertNextAcceptsHeaders(rules) {
  const { exit } = process;
  const { error } = console;
  const errors = [];
  process.exit = (code) => { throw new Error(`next rejected headers() (exit ${code}): ${errors.join(" | ")}`); };
  console.error = (...args) => errors.push(args.join(" "));
  try {
    checkCustomRoutes(rules, "header");
  } finally {
    process.exit = exit;
    console.error = error;
  }
}
const previewHeaders = async (headers) => {
  const rules = await withMegaPreview({ headers }, PREVIEW_ENV).headers();
  assertNextAcceptsHeaders(rules);
  return rules;
};
const siteRules = (rules) => rules.slice(0, -1);
const flat = async (config) => (await config.headers()).flatMap((rule) => rule.headers.map((h) => `${h.key}: ${h.value}`));

describe("withMegaPreview", () => {
  it("returns the same object for a production build without preview mode", () => {
    const config = site();
    assert.equal(withMegaPreview(config, { NODE_ENV: "production" }), config);
  });

  it("adds the megabuild.ai dev origin only in development preview mode, keeping existing entries", () => {
    const dev = withMegaPreview({ ...site(), allowedDevOrigins: ["local.test"] }, { NODE_ENV: "development", MEGA_PREVIEW_MODE: "1" });
    assert.deepEqual(dev.allowedDevOrigins, ["local.test", "*.megabuild.ai"]);
    assert.equal(withMegaPreview(site(), { NODE_ENV: "production", MEGA_PREVIEW_MODE: "1" }).allowedDevOrigins, undefined);
  });

  it("returns the same object in development without preview mode", () => {
    const config = { ...site(), allowedDevOrigins: ["local.test"] };
    assert.equal(withMegaPreview(config, { NODE_ENV: "development" }), config);
    assert.equal(withMegaPreview(config, { NODE_ENV: "development", MEGA_PREVIEW_MODE: " 1" }), config);
  });

  it("sets the preview headers and removes the site's framing headers in preview mode", async () => {
    const lines = await flat(withMegaPreview(site(), { NODE_ENV: "development", MEGA_PREVIEW_MODE: "1" }));
    assert.ok(lines.includes(`Content-Security-Policy: ${MEGA_PREVIEW_CSP}`));
    assert.ok(lines.includes("Cache-Control: no-store"));
    assert.ok(lines.some((line) => line.startsWith("Permissions-Policy: camera=()")));
    assert.ok(lines.includes("X-Site: kept"));
    assert.ok(!lines.some((line) => line.startsWith("X-Frame-Options")));
    assert.equal(lines.filter((line) => line.startsWith("Content-Security-Policy")).length, 1);
    assert.ok(!MEGA_PREVIEW_CSP.includes("frame-ancestors"));
  });

  for (const [name, rewrites] of [
    ["the array form", async () => [{ source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" }, { source: "/old", destination: "/new" }]],
    ["the object form", async () => ({ beforeFiles: [{ source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" }], afterFiles: [{ source: "/old", destination: "/new" }], fallback: [] })],
  ]) {
    it(`drops external rewrites in preview mode (${name})`, async () => {
      const result = await withMegaPreview({ ...site(), rewrites }, { NODE_ENV: "development", MEGA_PREVIEW_MODE: "1" }).rewrites();
      const all = Array.isArray(result) ? result : [...result.beforeFiles, ...result.afterFiles, ...result.fallback];
      assert.deepEqual(all.map((rule) => rule.destination), ["/new"]);
    });
  }

  it("works for a config with no headers or rewrites", async () => {
    const config = withMegaPreview({}, { NODE_ENV: "development", MEGA_PREVIEW_MODE: "1" });
    assert.ok((await flat(config)).includes("Cache-Control: no-store"));
    assert.deepEqual(await config.rewrites(), []);
  });
});

describe("withMegaPreview framing-header removal", () => {
  const csp = (value) => ({ key: "Content-Security-Policy", value });
  const xfo = { key: "X-Frame-Options", value: "SAMEORIGIN" };
  const kept = { key: "X-Site", value: "kept" };
  const has = [{ type: "header", key: "x-flag" }];
  const missing = [{ type: "cookie", key: "session" }];

  for (const [name, input, expected] of [
    ["a rule whose only header is a frame-ancestors CSP", [{ source: "/:path*", headers: [csp("frame-ancestors 'self' https://*.example.com")] }], []],
    ["a rule whose only header is a frame-ancestors CSP in odd case and spacing", [{ source: "/:path*", headers: [{ key: "content-security-policy", value: "  FRAME-ANCESTORS 'none' ;  " }] }], []],
    ["a rule whose only header is X-Frame-Options", [{ source: "/:path*", headers: [xfo] }], []],
    ["a rule with X-Frame-Options and a frame-ancestors CSP", [{ source: "/:path*", headers: [xfo, csp("frame-ancestors 'none'")] }], []],
    ["a rule whose only header is a report-only frame-ancestors CSP", [{ source: "/:path*", headers: [{ key: "Content-Security-Policy-Report-Only", value: "frame-ancestors 'none'" }] }], []],
    ["a CSP with frame-ancestors plus other directives", [{ source: "/:path*", headers: [csp("default-src 'self'; frame-ancestors 'none'; img-src https:")] }], [{ source: "/:path*", headers: [csp("default-src 'self'; img-src https:")] }]],
    ["a CSP policy list where one policy is only frame-ancestors", [{ source: "/a", headers: [csp("frame-ancestors 'none', default-src 'self'")] }], [{ source: "/a", headers: [csp("default-src 'self'")] }]],
    ["a CSP without frame-ancestors", [{ source: "/a", headers: [csp("default-src 'self'")] }], [{ source: "/a", headers: [csp("default-src 'self'")] }]],
    ["a directive that only starts like frame-ancestors", [{ source: "/a", headers: [csp("frame-ancestors-x 'self'; frame-src 'none'")] }], [{ source: "/a", headers: [csp("frame-ancestors-x 'self'; frame-src 'none'")] }]],
    [
      "several rules, some left empty",
      [
        { source: "/:path*", headers: [xfo] },
        { source: "/api/:path*", headers: [kept, csp("frame-ancestors 'none'")] },
        { source: "/embed", headers: [csp("frame-ancestors *")] },
        { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "max-age=1" }] },
      ],
      [{ source: "/api/:path*", headers: [kept] }, { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "max-age=1" }] }],
    ],
    [
      "rules with has and missing",
      [
        { source: "/:path*", has, headers: [xfo] },
        { source: "/:path*", missing, headers: [kept, csp("frame-ancestors 'none'; script-src 'self'")] },
      ],
      [{ source: "/:path*", missing, headers: [kept, csp("script-src 'self'")] }],
    ],
  ]) {
    for (const [kind, headers] of [["sync", () => input], ["async", async () => input]]) {
      it(`${name} (${kind} headers())`, async () => {
        assert.deepEqual(siteRules(await previewHeaders(headers)), expected);
      });
    }
  }

  for (const [name, headers] of [
    ["headers() returning undefined", async () => undefined],
    ["headers() returning []", async () => []],
    ["no headers()", undefined],
  ]) {
    it(`${name} gives only the preview rule`, async () => {
      const rules = await previewHeaders(headers);
      assert.deepEqual(rules.map((rule) => rule.source), ["/:path*"]);
      assert.ok(rules[0].headers.some((h) => h.key === "Content-Security-Policy" && h.value === MEGA_PREVIEW_CSP));
    });
  }

  it("never returns a frame-ancestors directive or X-Frame-Options from the site", async () => {
    const rules = await previewHeaders(async () => [{ source: "/:path*", headers: [xfo, csp("frame-ancestors 'none'; default-src 'self'"), kept] }]);
    const lines = rules.flatMap((rule) => rule.headers.map((h) => `${h.key}: ${h.value}`.toLowerCase()));
    assert.ok(!lines.some((line) => line.startsWith("x-frame-options") || line.includes("frame-ancestors")));
  });

  it("leaves the site's rules untouched outside preview mode", async () => {
    const input = [{ source: "/:path*", headers: [csp("frame-ancestors 'none'")] }];
    const config = { headers: async () => input };
    assert.deepEqual(await withMegaPreview(config, { NODE_ENV: "development" }).headers(), input);
  });
});
