import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(".next/static");
// Public production configuration, never a server credential or shape-only fixture.
const publicSiteKey = "6Lez5tstAAAAAD5rZmsQj-68Gl_De9ZNvnC8XWC6";
const files = readdirSync(root, { recursive: true }).filter(file => file.endsWith(".js"));
assert.ok(files.length > 0, "Run a production build with the public Enterprise key first");
let enterpriseClient = false;
for (const file of files) {
  const source = readFileSync(path.join(root, file), "utf8");
  assert.doesNotMatch(source, /STAGING_SENTINEL|recaptcha-staging-bypass-key|RECAPTCHA_STAGING_HOSTNAMES|LEAD_PROOF_CLAIM_TOKEN/, file);
  if (source.includes("recaptcha/enterprise.js")) {
    assert.ok(source.includes("https://www.google.com/recaptcha/enterprise.js?render="), "Google Enterprise loader must remain intact");
    assert.ok(source.includes(publicSiteKey), "Build with the actual production public Enterprise key");
    assert.match(source, /6L[A-Za-z0-9_-]{38}/, "Public Enterprise key must be built into the client");
    assert.match(source, /\.execute\([^,]+,\{action:"lead_submit"\}/);
    enterpriseClient = true;
  }
}
assert.ok(enterpriseClient, "Production bundle must retain the real Enterprise loader and execution");
process.stdout.write(`PASS: ${files.length} public JS files contain no server bypass; Google Enterprise loader, exact production public key and lead_submit retained.\n`);
