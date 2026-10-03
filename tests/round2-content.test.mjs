import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const read = file => readFileSync(file, "utf8");
const hash = value => createHash("sha256").update(value).digest("hex");
const BROKEN = [
  "http://www.travelful.net/location/5346104/united-states/tubro-construction",
  "https://about.me/Tubro-Construction",
  "https://companylistingnyc.com/listings/tubro-construction/",
  "https://ebusinesspages.com/Tubro-Construction_eggk8.co",
  "https://globalcatalog.com/tubroconstruction.us",
  "https://teleadreson.com/tubro-construction,26828-maple-valley-black-diamond-rd-se-pmb,-maple-valley,wa-98038-ovKRAKLykQA.html",
  "https://www.announceamerica.com/maple-valley/home-and-garden/tubro-construction",
  "https://www.bizmaker.org/business-services/tubro-construction",
  "https://www.cgmimm.com/maple-valley/custom-home-builder/tubro-construction",
];

test("historical round2 Kent phone repair changed only the three obsolete phone occurrences", () => {
  const source = execFileSync("git", ["show",
    "2f21f130fd37d4b8013713ea1b6451b3e97c5bf6:content/blog/Bathroom-Remodels-Kent-WA.md"], { encoding: "utf8" });
  assert.equal(source.includes("253-352-4578"), false);
  assert.equal(source.match(/253-216-2633/g)?.length, 3);
  assert.equal(hash(source.replaceAll("253-216-2633", "253-352-4578")),
    "cfd8e880d8bc7919f23643f2ae87bafac4dcd632e855c18c969bc70072a26deb");
});

test("nine broken destinations become exact plain text; every other backlink byte is preserved", () => {
  let source = read("content/blog/backlinks.md");
  for (const url of BROKEN) {
    assert.equal(source.includes(`href="${url}"`), false, url);
    assert.equal(source.split(url).length - 1, 1, url);
    source = source.replace(url, `<a href="${url}">${url}</a>`);
  }
  assert.equal(hash(source), "8590cbafad00a653dc5fe4432c24fba6eda6c9c265464b1bd19ef76aa3544ca6");
});

test("migration provenance and every other article remain byte-for-byte unchanged", () => {
  assert.equal(hash(read("content/blog/_inventory.json")), "229ad1ee459cd5a1e347e9d52002961016b79aee3c9c7698726915c72cbe57af");
  const files = readdirSync("content/blog").filter(file => file.endsWith(".md") &&
    !["Bathroom-Remodels-Kent-WA.md", "backlinks.md"].includes(file)).sort();
  assert.equal(hash(files.map(file => `${file}\0${read(`content/blog/${file}`)}`).join("")),
    "09b619309a8d57f7c8113d2f756b028347c0e68fd9f7da54b0cdc38776b64cba");
});

test("the labelled painting palette is exposed as a single meaningful graphic", () => {
  const source = read("src/components/sections/PaintingHero.tsx");
  assert.match(source, /<span\b[^>]*role="img"[^>]*aria-label="Project palette: green siding, light trim, dark shingles"/);
});

test("scoped contact typography has no remaining font-size below fourteen pixels", () => {
  for (const file of ["src/components/sections/painting-quote.module.css",
    "src/components/sections/compositions/general-contractor-estimate.module.css"]) {
    const sizes = [...read(file).matchAll(/font-size:\s*([.\d]+)(rem|px)/g)];
    assert.ok(sizes.length > 0);
    for (const [, value, unit] of sizes) assert.ok(Number(value) * (unit === "rem" ? 16 : 1) >= 14, `${file}: ${value}${unit}`);
  }
});
