import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { loadModule } from "./module-loader.mjs";

const customer = "b002784f-9543-4362-8814-b7da19078f23";
const site = "f28d515e-437b-4f9b-96c4-bc1a79a3357c";
const host = "tubro-construction-website-test-mega-websites.vercel.app";
const sentinel = "recaptcha-staging-bypass-key";
const env = { VERCEL_ENV: "preview", VERCEL_URL: host, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: sentinel, LEAD_UPLOAD_SIGNING_SECRET: "local-upload-test-secret" };
const file = new File(["Marked local résumé bytes\n"], "resume.txt", { type: "text/plain" });
const descriptor = { fileName: file.name, contentType: file.type, sizeBytes: file.size };
const key = `lead-uploads/pending/${customer}/local-upload/resume.txt`;
const signed = { s3Key: key, uploadUrl: `https://local-test.s3.us-west-2.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=${"a".repeat(64)}`, contentType: file.type, sizeBytes: file.size };
const binding = token => createHash("sha256").update(token).digest("hex");
const signBody = { captchaToken: sentinel, submissionBinding: binding(sentinel), files: [descriptor] };
const leadBody = { form_key: "careers_application", captchaToken: sentinel, form_data: { name: "Local Test", email: "test@example.com", phone: "2532162633", projectDetails: "Marked local test", projectType: "Carpentry", consent: true, resumeFileName: file.name } };

function boundary(overrides = {}, signResult = { uploads: [signed] }, assess) {
  const calls = []; const cache = new Map();
  const globals = { process: { env: { ...env, ...overrides } }, fetch: async (url, options) => {
    const body = JSON.parse(options.body); calls.push({ url, body });
    if (url.includes("recaptchaenterprise")) return Response.json(assess?.(body.event) ?? {});
    if (url.endsWith("upload-url")) return signResult instanceof Response ? signResult : Response.json(signResult);
    assert.equal(url, "https://analytics.gomega.ai/submission/submit");
    return Response.json({ ok: true });
  } };
  const sign = loadModule("app/api/lead/upload-url/route.ts", globals, cache);
  const lead = loadModule("app/api/lead/route.ts", globals, cache);
  const post = (route, body, hostname = host, headers = {}) => route.POST(new Request(`https://${hostname}/api/lead`, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }));
  return { calls, sign: (body = signBody, hostname, headers) => post(sign, body, hostname, headers), lead: (body, hostname) => post(lead, body, hostname), get: hostname => lead.GET(new Request(`https://${hostname}/api/lead`)), globals, cache };
}

async function claim(api, body = signBody) {
  const response = await api.sign(body);
  assert.equal(response.status, 200);
  const result = await response.json();
  return { uploadKeys: [result.uploads[0].s3Key], uploadSignedKeys: result.signedKeys, uploadCapability: result.capability };
}

test("signing verifies exact staging sentinel before upstream, fixes identity and binds capabilities", async () => {
  const api = boundary();
  for (const token of [undefined, "", "invalid"]) assert.equal((await api.sign({ ...signBody, captchaToken: token })).status, 403);
  assert.equal((await api.sign(signBody, "attacker.vercel.app")).status, 403);
  assert.equal((await api.sign(signBody, host, { Origin: "https://attacker.test" })).status, 403);
  assert.equal(api.calls.length, 0);
  const attachment = await claim(api, { ...signBody, customer_id: "spoof", site_id: "spoof" });
  assert.deepEqual(api.calls[0].body, { customer_id: customer, site_id: site, files: [descriptor] });
  assert.equal((await api.lead({ ...leadBody, ...attachment })).status, 200);
  assert.deepEqual(api.calls.at(-1).body.form_data._mega_uploads, [key]);
  assert.equal(api.calls.at(-1).body.form_data.resumeUploadStatus, "Uploaded with application; attachment scanning may delay email availability.");
});

test("signing bounds JSON, permits one valid resume up to 25 MiB and rejects invalid declarations", async () => {
  const api = boundary();
  for (const body of ["{", "null", "[]", "x".repeat(4100)]) assert.equal((await api.sign(body)).status, 400);
  const invalid = [[], [descriptor, descriptor], [{ ...descriptor, fileName: "resume.rtf" }], [{ ...descriptor, contentType: "application/x-msdownload" }], [{ ...descriptor, sizeBytes: 0 }], [{ ...descriptor, sizeBytes: 25 * 1024 * 1024 + 1 }], [{ ...descriptor, sizeBytes: 1.1 }], [{ ...descriptor, fileName: "x.exe" }]];
  for (const files of invalid) assert.equal((await api.sign({ ...signBody, files })).status, 400);
  assert.equal((await api.sign({ ...signBody, submissionBinding: "bad" })).status, 400);
  assert.equal(api.calls.length, 0);
  const max = 25 * 1024 * 1024;
  const accepted = boundary({}, { uploads: [{ ...signed, sizeBytes: max }] });
  assert.equal((await accepted.sign({ ...signBody, files: [{ ...descriptor, sizeBytes: max }] })).status, 200);
  assert.equal((await api.lead({ ...leadBody, captchaToken: undefined })).status, 403, "filename-only synthetic probe reaches verification");
});

test("malformed, short, wrong-owner and unsafe signing responses never mint usable claims", async () => {
  const malformed = [null, {}, { uploads: [] }, { uploads: [signed, signed] }, { uploads: [{ ...signed, sizeBytes: 1 }] }, { uploads: [{ ...signed, contentType: "text/html" }] }, { uploads: [{ ...signed, s3Key: "lead-uploads/pending/another/uuid/resume.txt" }] }, { uploads: [{ ...signed, uploadUrl: "https://attacker.test/upload" }] }, { uploads: [{ ...signed, uploadUrl: signed.uploadUrl.replace("https:", "http:") }] }, { uploads: [{ ...signed, uploadUrl: signed.uploadUrl.split("?")[0] }] }];
  for (const result of malformed) {
    const response = await boundary({}, result).sign();
    assert.equal(response.status, 502, JSON.stringify(result));
    assert.equal((await response.json()).capability, undefined);
  }
  assert.equal((await boundary({ LEAD_UPLOAD_SIGNING_SECRET: undefined }).sign()).status, 503);
});

test("production signing demands lead_upload assessment, rejecting submit tokens, invalid host and sentinel", async () => {
  const productionHost = "www.tubroconstruction.com";
  const production = { VERCEL_ENV: "production", RECAPTCHA_HOSTNAMES: productionHost, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "local-site-key", RECAPTCHA_PROJECT_ID: "local", RECAPTCHA_API_KEY: "local" };
  const assess = event => ({ tokenProperties: { valid: true, action: event.token === "upload-token" ? "lead_upload" : "lead_submit", hostname: productionHost }, riskAnalysis: { score: 0.9 } });
  const api = boundary(production, { uploads: [signed] }, assess);
  for (const captchaToken of [sentinel, "submit-token"]) assert.equal((await api.sign({ ...signBody, captchaToken }, productionHost)).status, 403);
  assert.equal((await api.sign({ ...signBody, captchaToken: "upload-token" }, host)).status, 403);
  assert.equal((await api.sign({ ...signBody, captchaToken: "upload-token" }, productionHost)).status, 200);
  const assessments = api.calls.filter(call => call.url.includes("recaptchaenterprise"));
  assert.ok(assessments.every(call => call.body.event.expectedAction === "lead_upload"));
  assert.equal(api.calls.filter(call => call.url.endsWith("upload-url")).length, 1);
});

test("tampering, other-token binding, unsigned keys and replay are refused; failed PUT subset can deliver", async () => {
  const api = boundary(); const attachment = await claim(api);
  for (const changed of [{ uploadCapability: attachment.uploadCapability + "x" }, { uploadKeys: [key + "other"] }, { uploadSignedKeys: [key + "other"] }, { uploadCapability: undefined }, { captchaToken: "other-token" }]) {
    assert.equal((await api.lead({ ...leadBody, ...attachment, ...changed })).status, 403);
  }
  assert.equal((await api.lead({ ...leadBody, form_data: { ...leadBody.form_data, _mega_uploads: [key] } })).status, 422);
  const responses = await Promise.all([api.lead({ ...leadBody, ...attachment }), api.lead({ ...leadBody, ...attachment })]);
  assert.deepEqual(responses.map(r => r.status).sort(), [200, 403]);
  assert.equal((await api.lead({ ...leadBody, ...attachment, uploadKeys: [] })).status, 200);
  assert.equal(api.calls.at(-1).body.form_data._mega_uploads, undefined);
  assert.match(api.calls.at(-1).body.form_data.resumeUploadStatus, /not sent/);
});

test("proof fallback keeps owned claims bound to the actual submit token and cannot replay them", async () => {
  const hostname = "www.tubroconstruction.com";
  const api = boundary({ VERCEL_ENV: "production", RECAPTCHA_HOSTNAMES: hostname, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "local-key", RECAPTCHA_PROJECT_ID: "local", RECAPTCHA_API_KEY: "local" }, { uploads: [signed] }, event => ({ tokenProperties: { valid: event.token === "upload-token", action: "lead_upload", hostname }, riskAnalysis: { score: 0.9 } }));
  const response = await api.sign({ ...signBody, captchaToken: "upload-token", submissionBinding: binding("submit-token") }, hostname);
  const result = await response.json(); assert.equal(response.status, 200);
  const body = { ...leadBody, captchaToken: "submit-token", uploadKeys: [key], uploadSignedKeys: result.signedKeys, uploadCapability: result.capability };
  const { solveLeadProof } = loadModule("src/lib/leadProof.ts");
  const prove = async value => {
    const challenge = await (await api.get(hostname)).json();
    const payload = { ...value, powIssuedAt: challenge.issuedAt, powChallenge: challenge.powChallenge, powSignature: challenge.powSignature };
    return { ...payload, powNonce: await solveLeadProof(payload, challenge.issuedAt) };
  };
  assert.equal((await api.lead(body, hostname)).status, 403);
  for (const change of [{ uploadCapability: undefined }, { captchaToken: "different-token" }, { uploadKeys: [key + "other"] }]) {
    assert.equal((await api.lead(await prove({ ...body, ...change }), hostname)).status, 403);
  }
  assert.equal((await api.lead(await prove(body), hostname)).status, 200);
  assert.deepEqual(api.calls.at(-1).body.form_data._mega_uploads, [key]);
  assert.match(api.calls.at(-1).body.form_data.spamCheck, /Unverified/);
  assert.equal((await api.lead(await prove(body), hostname)).status, 403, "new proof cannot replay an already claimed attachment");
  assert.equal((await api.lead(await prove({ ...leadBody, captchaToken: "invalid-token" }), hostname)).status, 200);
  assert.equal(api.calls.at(-1).body.form_data._mega_uploads, undefined);
  assert.match(api.calls.at(-1).body.form_data.resumeUploadStatus, /not sent/);
});

test("capability expiration and wrong token fail closed, including at the retention boundary", () => {
  const api = loadModule("src/lib/upload-capability.ts", { process: { env } });
  const now = Date.now();
  const cap = api.issueUploadCapability([key], binding("submit-token"), now);
  const body = { uploadKeys: [key], uploadSignedKeys: [key], uploadCapability: cap, captchaToken: "submit-token" };
  assert.deepEqual(Array.from(api.authorizedUploadKeys(body, now)), [key]);
  assert.equal(api.authorizedUploadKeys({ ...body, captchaToken: "other-token" }, now), null);
  assert.equal(api.authorizedUploadKeys(body, now - 5001), null);
  assert.equal(api.authorizedUploadKeys(body, now + api.UPLOAD_CAPABILITY_LIFETIME + 1), null);
  assert.equal(api.consumeUploadClaim(body, now), true);
  assert.equal(api.consumeUploadClaim(body, now + api.UPLOAD_CAPABILITY_LIFETIME), false);
});

test("supported extensions map empty browser MIME safely; unknown/executable MIME never inferred", () => {
  const api = loadModule("src/lib/lead-uploads.ts");
  for (const [extension, mime] of [["pdf", "application/pdf"], ["doc", "application/msword"], ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], ["txt", "text/plain"]]) {
    const resume = new File(["x"], `My Résumé.${extension.toUpperCase()}`);
    assert.equal(api.resumeFileError(resume), null);
    assert.equal(api.describeResume(resume).contentType, mime);
  }
  for (const name of ["bad.exe", "bad.constructor", "bad.toString", "../bad.pdf"]) assert.ok(api.resumeFileError(new File(["x"], name)));
  assert.ok(api.resumeFileError(new File(["x"], "bad.pdf", { type: "application/x-msdownload" })));
});

test("actual client and handlers carry byte-backed owned keys through to mocked MEGA destination", async () => {
  const api = boundary(); let puts = 0;
  const client = loadModule("src/lib/lead-client.ts", {
    URLSearchParams, window: { location: { search: "" } },
    moduleMocks: { "./recaptcha-client": { requestUploadToken: async () => sentinel } },
    fetch: async (url, options) => {
      if (url === "/api/lead/upload-url") return api.sign(JSON.parse(options.body));
      if (options.method === "PUT") {
        assert.equal(url, signed.uploadUrl); assert.equal(options.body, file);
        assert.equal((await options.body.arrayBuffer()).byteLength, descriptor.sizeBytes);
        assert.equal(options.headers["Content-Type"], descriptor.contentType);
        assert.equal(options.headers["If-None-Match"], "*"); puts++;
        return new Response(null, { status: 200 });
      }
      assert.equal(puts, 1, "PUT must finish before forwarding");
      return api.lead(JSON.parse(options.body));
    },
  });
  const result = await client.postLead("careers_application", leadBody.form_data, "/careers", { getToken: async () => sentinel }, file);
  assert.equal(result.attachment, "uploaded");
  const forwarded = api.calls.at(-1).body;
  assert.deepEqual(forwarded.form_data._mega_uploads, [key]);
  assert.equal(forwarded.form_data.resumeFileName, file.name);
  assert.equal(forwarded.uploadCapability, undefined);
  assert.equal(forwarded.form_data.captchaToken, undefined);
  assert.equal(api.calls.filter(call => call.url.endsWith("/submit")).length, 1);
});

test("attachment claim capacity refuses overflow without evicting a live claim", () => {
  const api = loadModule("src/lib/upload-capability.ts", { process: { env }, moduleMocks: { "./lead-proof-replay": { MAX_REMEMBERED_PROOFS: 1 } } });
  const now = Date.now();
  const body = token => ({ captchaToken: token, uploadKeys: [key], uploadSignedKeys: [key], uploadCapability: api.issueUploadCapability([key], binding(token), now) });
  const first = body("one"); const second = body("two");
  assert.equal(api.consumeUploadClaim(first, now), true);
  assert.equal(api.consumeUploadClaim(second, now), false);
  assert.equal(api.consumeUploadClaim(first, now), false);
  const later = now + api.UPLOAD_CAPABILITY_LIFETIME + 1;
  const fresh = { ...second, uploadCapability: api.issueUploadCapability([key], binding("two"), later) };
  assert.equal(api.consumeUploadClaim(fresh, later), true);
});
