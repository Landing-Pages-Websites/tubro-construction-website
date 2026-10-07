import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Parser } from "htmlparser2";
import { loadModule } from "./module-loader.mjs";

const moduleMocks = Object.fromEntries([
  "SectionIntro", "DesignImage", "CtaLink", "PhoneCta", "ContextLinks",
].map(name => [`./${name}`, { [name]: () => null }]));
moduleMocks["./SectionShell"] = { SectionShell: ({ children }) => createElement("section", null, children) };
moduleMocks["./PaintingHero.module.css"] = { palette: "palette" };
const { PaintingHero } = loadModule("src/components/sections/PaintingHero.tsx", { moduleMocks });

test("painting palette renders as a named image with its original three swatches", () => {
  const html = renderToStaticMarkup(createElement(PaintingHero, {
    section: { id: "hero", content: {} }, images: [], links: [],
  }));
  const palettes = [];
  new Parser({ onopentag: (tag, attributes) => {
    if (attributes.class === "palette") palettes.push({ tag, attributes });
  } }).end(html);
  assert.equal(palettes.length, 1);
  assert.equal(palettes[0].tag, "span");
  assert.equal(palettes[0].attributes.role, "img", "the palette's accessible name needs an image role");
  assert.equal(palettes[0].attributes["aria-label"], "Project palette: green siding, light trim, dark shingles");
  assert.match(html, /<span\b[^>]*class="palette"[^>]*><i><\/i><i><\/i><i><\/i><\/span>/);
});
