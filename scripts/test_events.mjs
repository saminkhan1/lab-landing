#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../functions/api/events.js", import.meta.url), "utf8");
const encoded = Buffer.from(source).toString("base64");
const { onRequest } = await import(`data:text/javascript;base64,${encoded}`);

const writes = [];
const env = { SEO_FUNNEL: { writeDataPoint: (point) => writes.push(point) } };
const payload = {
  event: "page_view",
  page_path: "/workflow-automation/?private=value",
  session_id: "test-session",
  attribution: {
    utm_source: "search",
    landing_path: "/workflow-automation/?private=value",
    referrer_host: "www.google.com",
    unexpected_field: "must-not-be-written",
  },
};

const request = (url, body = payload, origin = "https://wexprolabs.com") => new Request(url, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...(origin ? { Origin: origin } : {}) },
  body: JSON.stringify(body),
});

let result = await onRequest({ request: request("https://wexprolabs.com/api/events"), env });
assert.equal(result.status, 204);
assert.equal(writes.length, 1);
assert.deepEqual(writes[0].indexes, ["test-session"]);
assert.deepEqual(writes[0].blobs.slice(0, 2), ["page_view", "/workflow-automation/"]);
assert.equal(writes[0].blobs[9], "/workflow-automation/");
assert.equal(JSON.stringify(writes[0]).includes("private=value"), false);
assert.equal(JSON.stringify(writes[0]).includes("must-not-be-written"), false);

result = await onRequest({ request: request("https://preview.wexpro-labs.pages.dev/api/events", payload, "https://preview.wexpro-labs.pages.dev"), env });
assert.equal(result.status, 403);
result = await onRequest({ request: request("https://wexprolabs.com/api/events", payload, "https://example.com"), env });
assert.equal(result.status, 403);
result = await onRequest({ request: request("https://wexprolabs.com/api/events", payload, ""), env });
assert.equal(result.status, 403);
result = await onRequest({ request: request("https://wexprolabs.com/api/events", { ...payload, event: "invented" }), env });
assert.equal(result.status, 400);
result = await onRequest({ request: new Request("https://wexprolabs.com/api/events"), env });
assert.equal(result.status, 405);
assert.equal(writes.length, 1);

console.log("Validated production-host, same-origin, event allowlist, and Analytics Engine write contracts.");
