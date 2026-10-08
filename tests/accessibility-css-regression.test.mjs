import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import postcss from "postcss";

// Source regressions only. Native footer focus and rendered motion/contrast
// acceptance remain separate browser checks, including the final Preview.
const css = file => postcss.parse(readFileSync(file, "utf8"));

function rule(root, selector) {
  const matches = [];
  root.walkRules(selector, node => matches.push(node));
  assert.equal(matches.length, 1, selector);
  return matches[0];
}

function assertOpaqueMotion(root, names) {
  for (const name of names) {
    const frames = [];
    root.walkAtRules("keyframes", node => { if (node.params === name) frames.push(node); });
    assert.equal(frames.length, 1, name);
    const transforms = [];
    frames[0].walkDecls(declaration => {
      if (declaration.prop === "opacity") assert.equal(Number(declaration.value), 1, name);
      if (declaration.prop === "transform") transforms.push(declaration.value);
      assert.notEqual(declaration.prop, "filter", `${name}: preserve reading contrast`);
    });
    assert.ok(transforms.length >= 2, `${name}: retain transform motion`);
  }
}

test("mobile focus keeps both header and fixed booking bar scroll clearance", () => {
  const mobile = css("app/globals.css").nodes.find(node => node.name === "media" && node.params.replaceAll(" ", "") === "(max-width:767px)");
  assert.ok(mobile, "mobile viewport rule exists");
  const html = rule(mobile, "html");
  const declarations = Object.fromEntries(html.nodes.map(node => [node.prop, node.value]));
  assert.equal(declarations["scroll-padding-top"], "73px");
  assert.equal(declarations["scroll-padding-bottom"], "90px");
});

test("about reading motion stays opaque and the photo keeps its separate animation", () => {
  const root = css("app/about-us/about.module.css");
  assertOpaqueMotion(root, ["riseIn", "rowIn"]);
  const photo = rule(root, ".storyPhoto[data-about-entered]");
  assert.ok(photo.nodes.some(node => node.prop === "animation" && node.value.startsWith("photoRiseIn ")));
});

test("estimate text motion and disabled submit retain full reading opacity", () => {
  const root = css("app/schedule-an-estimate/estimate.module.css");
  assertOpaqueMotion(root, ["estimate-enter", "estimate-answer"]);
  const reveal = rule(root, ".page [data-estimate-enter]");
  assert.ok(reveal.nodes.some(node => node.prop === "opacity" && node.value === "1" && node.important));
  rule(root, ".submit:disabled").walkDecls("opacity", declaration => assert.equal(Number(declaration.value), 1));
  root.walkDecls("animation", declaration => assert.doesNotMatch(declaration.value, /estimate-fade/));
});
