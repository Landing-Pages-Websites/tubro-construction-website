import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { loadModule } from "./module-loader.mjs";

const file = new File(["Marked local test résumé\n"], "resume.txt", { type: "text/plain" });
const key = "lead-uploads/pending/b002784f-9543-4362-8814-b7da19078f23/local-test/resume.txt";
const upload = { s3Key: key, uploadUrl: `https://local-test.s3.us-west-2.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=${"b".repeat(64)}`, contentType: file.type, sizeBytes: file.size };
const signResult = { ok: true, uploads: [upload], signedKeys: [key], capability: `v1.${Date.now()}.${"a".repeat(43)}` };
const fields = { name: "Local Test", email: "test@example.com", phone: "2532162633", projectDetails: "Local test", projectType: "Carpentry", consent: true, resumeFileName: file.name };

function client({ signing = signResult, putStatus = 200, submitStatus = 200, signingToken = "upload-token", submitToken = "submit-token" } = {}) {
  const calls = []; const tokens = [];
  const api = loadModule("src/lib/lead-client.ts", {
    URLSearchParams, window: { location: { search: "?utm_source=local" } },
    moduleMocks: { "./recaptcha-client": { requestUploadToken: async () => { tokens.push("lead_upload"); return signingToken; } }, "./leadProof": { solveLeadProof: async () => "123" } },
    fetch: async (url, options = {}) => {
      calls.push({ url, options });
      if (url === "/api/lead/upload-url") return signing instanceof Response ? signing : Response.json(signing);
      if (options.method === "PUT") return new Response(null, { status: putStatus });
      if (!options.method) return Response.json({ issuedAt: String(Date.now()), powChallenge: "local", powSignature: "local" });
      assert.equal(url, "/api/lead");
      return Response.json({ ok: submitStatus === 200, error: "Destination unavailable" }, { status: submitStatus });
    },
  });
  const widget = { getToken: async () => { tokens.push("lead_submit"); return submitToken; } };
  return { calls, tokens, submit: (resume = file) => api.postLead("careers_application", fields, "/careers", widget, resume) };
}

test("client mints submit token first, separately signs, PUTs actual bytes and declares only after 2xx", async () => {
  const api = client();
  assert.equal((await api.submit()).attachment, "uploaded");
  assert.deepEqual(api.tokens, ["lead_submit", "lead_upload"]);
  assert.deepEqual(api.calls.map(call => call.options.method), ["POST", "PUT", "POST"]);
  const signing = JSON.parse(api.calls[0].options.body);
  assert.equal(signing.captchaToken, "upload-token");
  assert.equal(signing.submissionBinding, createHash("sha256").update("submit-token").digest("hex"));
  assert.equal(signing.files[0].sizeBytes, file.size);
  assert.equal(JSON.stringify(signing).includes("submit-token"), false);
  const put = api.calls[1].options;
  assert.equal(put.body, file);
  assert.equal((await put.body.arrayBuffer()).byteLength, file.size);
  assert.equal(await put.body.text(), await file.text());
  assert.equal(put.headers["Content-Type"], "text/plain");
  assert.equal(put.headers["If-None-Match"], "*");
  assert.equal(put.headers["Content-Length"], undefined);
  const lead = JSON.parse(api.calls[2].options.body);
  assert.deepEqual(lead.uploadKeys, [key]);
  assert.deepEqual(lead.uploadSignedKeys, [key]);
  assert.equal(lead.captchaToken, "submit-token");
  assert.equal(lead.form_data.utmSource, "local");
  assert.equal(lead.form_data.resumeFileName, file.name);
  assert.equal(lead.form_data._mega_uploads, undefined);
});

test("malformed/short signing and failed PUT deliver enquiry with failed status and no attachment keys", async () => {
  for (const options of [{ signing: {} }, { signing: { ...signResult, uploads: [] } }, { signing: { ...signResult, uploads: [upload, upload] } }, { signing: { ...signResult, capability: undefined } }, { signing: new Response(null, { status: 403 }) }, { putStatus: 403 }, { putStatus: 500 }, { signingToken: null }, { signingToken: "submit-token" }, { submitToken: null }]) {
    const api = client(options);
    assert.equal((await api.submit()).attachment, "failed", JSON.stringify(options));
    const body = JSON.parse(api.calls.at(-1).options.body);
    assert.equal(body.uploadKeys, undefined);
    assert.equal(body.uploadCapability, undefined);
    assert.equal(body.form_data.resumeFileName, file.name);
  }
});

test("empty, oversized, RTF, executable and mismatched MIME files cannot sign, PUT or submit", async () => {
  const oversized = new File(["x"], "large.pdf", { type: "application/pdf" });
  Object.defineProperty(oversized, "size", { value: 25 * 1024 * 1024 + 1 });
  for (const resume of [new File([], "empty.txt", { type: "text/plain" }), oversized, new File(["x"], "resume.rtf", { type: "application/rtf" }), new File(["x"], "resume.exe", { type: "application/x-msdownload" }), new File(["x"], "resume.pdf", { type: "text/html" })]) {
    const api = client();
    await assert.rejects(api.submit(resume), /Choose/);
    assert.equal(api.calls.length, 0); assert.equal(api.tokens.length, 0);
  }
});

test("byte delivery does not turn a rejected lead into successful submission", async () => {
  const api = client({ submitStatus: 502 });
  await assert.rejects(api.submit(), /Destination unavailable/);
  assert.equal(api.calls.length, 3);
  assert.equal(await file.text(), "Marked local test résumé\n");
});
