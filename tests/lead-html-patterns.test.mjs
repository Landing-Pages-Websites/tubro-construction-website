import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { Parser } from "htmlparser2";
import { loadModule } from "./module-loader.mjs";
import { validateLeadFields } from "../src/lib/lead-validation.ts";

const { EstimateField } = loadModule("src/components/shared/EstimateField.tsx");
function field(name, type) {
  const html = renderToStaticMarkup(createElement(EstimateField, { id: `qa-${name}`, name, type, label: name, errorId: `${name}-error`, fieldClassName: "", labelClassName: "" }));
  let attributes;
  new Parser({ onopentag: (tag, attrs) => { if (tag === "input") attributes = attrs; } }).end(html);
  return attributes;
}
const valid = { name: "Local Test", phone: "2532162633", email: "local@example.com", projectDetails: "Local test" };

test("actual SSR email and tel controls expose the same strict patterns as application validation", () => {
  const phone = field("phone", "tel"); const email = field("email", "email");
  assert.equal(phone.name, "phone"); assert.equal(phone.type, "tel"); assert.ok("required" in phone);
  assert.equal(email.name, "email"); assert.equal(email.type, "email"); assert.ok("required" in email);
  for (const [attributes, cases] of [
    [phone, [["2532162633", true], ["(253) 216-2633", true], ["253.216.2633", true], ["253 216 2633", true], ["17576855050", false], ["+1 (253) 216-2633", false], ["123456789", false], ["123456789012", false], ["253-abc-2633", false]]],
    [email, [["local@example.com", true], ["name+tag@sub.example.co.uk", true], ["me@x", false], ["me@x.c", false], ["me@x.123", false], ["me@@x.com", false], ["me@-x.com", false]]],
  ]) {
    const pattern = new RegExp(`^(?:${attributes.pattern})$`, "v");
    for (const [value, expected] of cases) {
      assert.equal(pattern.test(value), expected, `HTML ${attributes.name}: ${value}`);
      assert.equal(!validateLeadFields({ ...valid, [attributes.name]: value })[attributes.name], expected, `app ${attributes.name}: ${value}`);
    }
  }
});
