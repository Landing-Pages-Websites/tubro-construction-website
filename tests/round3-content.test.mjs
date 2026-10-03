import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import sanitizeHtml from "sanitize-html";

const BASELINE = "2f21f130fd37d4b8013713ea1b6451b3e97c5bf6";
const KENT = "content/blog/Bathroom-Remodels-Kent-WA.md";
const MAX_BUFFER = 16 * 1024 * 1024;
const read = file => readFileSync(file, "utf8");
const git = args => execFileSync("git", args, { encoding: "utf8", maxBuffer: MAX_BUFFER });
const original = file => git(["show", `${BASELINE}:${file}`]);
const source = read(KENT);
const before = original(KENT);
const text = html => sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
const matches = (value, pattern) => [...value.matchAll(pattern)].map(match => match[1]);
const DIRECTION_BEFORE = "fill out the contact form below";
const DIRECTION_AFTER = "follow the quote link below";
const SERVICES = [
  ["/general-contractor", "/images/blog/legacy-581fe1b531787c17.jpg", /workers.*measuring.*wall/i],
  ["/kitchen-remodeling", "/images/design/kitchen-remodeling/02-project-gallery-0125047-kitchen-01-jpg.jpg", /kitchen.*cabinetry.*island/i],
  ["/bathroom-remodeling", "/images/design/bathroom-remodeling/02-project-gallery-0925012-bathroom-01-jpg.jpg", /bathroom.*shower.*tub.*vanity/i],
  ["/interior-exterior-painting", "/images/design/interior-exterior-painting/01-hero-0825017-ext-stain-01-jpeg.jpeg", /stained.*entry.*door/i],
  ["/custom-home-services", "/images/design/custom-home-services/01-hero-img-3136-jpg.webp", /completed.*home.*porch/i],
];

function between(value, start, end) {
  const startIndex = value.indexOf(start);
  const endIndex = value.indexOf(end, startIndex);
  assert.ok(startIndex >= 0 && endIndex > startIndex, `${start} → ${end}`);
  return value.slice(startIndex, endIndex);
}

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = `${directory}/${entry.name}`;
    return entry.isDirectory() ? filesUnder(file) : [file];
  }).sort();
}

test("Kent retains every frontmatter byte and its source identity", () => {
  const header = value => /^---\n[\s\S]*?\n---\n/.exec(value)?.[0];
  assert.equal(header(source), header(before));
  assert.match(header(source), /id: "item_ptnrv0nzhbtdxx73yr7pde8z9w"/);
  assert.match(header(source), /canonicalPath: "\/Bathroom-Remodels-Kent-WA"/);
});

test("Kent displays the current phone and has two valid telephone destinations", () => {
  assert.equal(source.includes("253-352-4578"), false);
  assert.deepEqual(matches(source, /href="(tel:[^"]*)"/g), ["tel:253-216-2633", "tel:253-216-2633"]);
  assert.equal(source.match(/253-216-2633/g)?.length, 4);
});

test("all five service photographs have distinct existing local sources and subject-specific alt text", () => {
  const images = between(source, '<h2><span>HOME REMODELING', '<h3><span>UNMATCHED ADVANTAGES');
  assert.equal(matches(images, /(<img\b[^>]*>)/g).length, 5);
  for (const [route, image, alt] of SERVICES) {
    const tag = images.match(new RegExp(`<a href="${route}">(<img[^>]*>)</a>`))?.[1];
    assert.ok(tag, route);
    assert.ok(tag.includes(`src="${image}"`), route);
    assert.match(tag.match(/alt="([^"]+)"/)?.[1] || "", alt);
    assert.ok(readFileSync(`public${image}`).length > 0, image);
    assert.deepEqual(readFileSync(`public${image}`), execFileSync("git", ["show", `${BASELINE}:public${image}`], { maxBuffer: MAX_BUFFER }));
  }
  assert.equal(new Set(SERVICES.map(([, image]) => image)).size, 5);
});

test("both obsolete quote widgets link to scheduling without inert success or error states", () => {
  const quoteLinks = matches(source, /<p><a href="\/schedule-an-estimate">([^<]+)<\/a><\/p>/g);
  assert.deepEqual(quoteLinks, ["REQUEST A FREE QUOTE", "REQUEST A FREE QUOTE"]);
  assert.doesNotMatch(source, /Thank you for contacting|We will get back|Oops, there was|Please try again later|<form\b/i);
  assert.match(source, /href="\/schedule-an-estimate"[\s\S]*?REQUEST A QUOTE/);
});

test("Get in Touch retains its full paragraph with only the obsolete interaction direction repaired", () => {
  const paragraph = value => matches(value, /(<p>[\s\S]*?<\/p>)/g).find(item => item.includes("We are eager"));
  assert.ok(paragraph(before));
  assert.equal(paragraph(source), paragraph(before).replace(DIRECTION_BEFORE, DIRECTION_AFTER));
  assert.doesNotMatch(source, /contact form below/);
});

test("every service has a named Learn more link and no empty anchors remain", () => {
  const services = between(source, '<h2><span>HOME REMODELING', '<h3><span>UNMATCHED ADVANTAGES');
  assert.equal(text(services).match(/Learn more/g)?.length, 5, "Each service has one useful Learn more control");
  const links = [...source.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
  for (const [, attributes, body] of links) {
    assert.match(attributes, /href="(?:\/(?!\/)[^"\s]*|tel:253-216-2633)"/);
    assert.ok(text(body) || /<img\b[^>]*alt="[^"]+"/.test(body), `${attributes}: empty accessible name`);
  }
  for (const [route] of SERVICES) {
    assert.equal(links.filter(([, attributes, body]) => attributes === ` href="${route}"` && text(body) === "Learn more").length, 1, route);
  }
});

test("review and location widgets lead to working routes and retain all nine location strings", () => {
  assert.doesNotMatch(source, /<svg|<circle|Google Logo|>Rating<|>LIST<|>MAP<|<a>/);
  assert.match(source, /href="\/recent-projects#realwork-portfolio">Read client reviews<\/a>/);
  assert.match(read("app/recent-projects/RealWorkPortfolio.tsx"), /id="realwork-portfolio"/);
  assert.match(source, /href="\/service-area\/home-remodeling-kent">Go to location page<\/a>/);
  assert.match(source, /href="\/service-areas">See all locations<\/a>/);
  assert.match(source, /href="\/service-areas">View our service areas<\/a>/);
  const locations = value => matches(value, /<li>([\s\S]*?)<\/li>/g).map(text);
  assert.equal(locations(before).length, 9);
  assert.deepEqual(locations(source), locations(before));
});

test("nonwidget prose, headings, citations and unaffected imagery remain unchanged", () => {
  const start = '<img alt="A white background';
  const services = '<a href="/general-contractor"><img';
  assert.equal(between(source, start, services), between(before, start, services));
  const benefits = '<h3><span>UNMATCHED ADVANTAGES';
  const reviews = '<h2><span>What our CLIENTS';
  assert.equal(between(source, benefits, reviews), between(before, benefits, reviews).replace(DIRECTION_BEFORE, DIRECTION_AFTER));
  const headings = value => matches(value, /(<h[23]>[\s\S]*?<\/h[23]>)/g).filter(item => text(item) !== "REQUEST A FREE QUOTE");
  assert.deepEqual(headings(source), headings(before));
  assert.deepEqual(matches(source, /href="(https?:[^\"]+)"/g), matches(before, /href="(https?:[^\"]+)"/g));
});

test("all useful visible text survives; only enumerated widget states and the form direction change", () => {
  const body = value => value.replace(/^---\n[\s\S]*?\n---\n/, "");
  const normalize = value => text(body(value)).replaceAll(DIRECTION_BEFORE, DIRECTION_AFTER)
    .replaceAll(/REQUEST A FREE QUOTE|Learn more|Thank you for contacting us\.|We will get back to you as soon as possible\.|Oops, there was an error sending your message\.|Please try again later\.|Read client reviews|View our service areas|\bRating\b|\bLIST\b|\bMAP\b/g, "")
    .replace(/\s+/g, " ").trim();
  assert.equal(normalize(source), normalize(before));
});

test("inventory and every other content file match the immutable baseline byte for byte", () => {
  const directories = ["content", "src/lib/blog-content"];
  const baselineFiles = git(["ls-tree", "-r", "--name-only", BASELINE, "--", ...directories]).trim().split("\n").sort();
  assert.deepEqual(directories.flatMap(filesUnder).sort(), baselineFiles);
  for (const file of baselineFiles.filter(file => file !== KENT)) {
    assert.deepEqual(readFileSync(file), execFileSync("git", ["show", `${BASELINE}:${file}`]), file);
  }
  const inventory = JSON.parse(read("content/blog/_inventory.json"));
  assert.equal(inventory.posts.length, 67);
  assert.equal(inventory.posts.filter(row => row.status === "migrated").length, 54);
  assert.equal(inventory.posts.filter(row => row.status === "authored").length, 13);
});
