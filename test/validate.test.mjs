import { test } from "node:test";
import assert from "node:assert/strict";
import { validate, schemaNames } from "../lib/validate.mjs";

test("loads all five schemas", () => {
  assert.deepEqual(
    schemaNames().sort(),
    ["application-packet", "audit-event", "document-request", "notice", "status-event"],
  );
});

test("validates the notice example shape", () => {
  const { valid } = validate("notice", {
    notice_id: "ntc_x",
    application_id: "pkt_x",
    notice_type: "appointment",
    subject: "s",
    body: "b",
    created_at: "2026-06-16T16:05:00Z",
    issuing_party: "Synthetic Marketing Agent",
  });
  assert.equal(valid, true);
});

test("rejects a notice with an unknown notice_type", () => {
  const { valid } = validate("notice", {
    notice_id: "ntc_x",
    application_id: "pkt_x",
    notice_type: "eviction_threat",
    subject: "s",
    body: "b",
    created_at: "2026-06-16T16:05:00Z",
    issuing_party: "Synthetic Marketing Agent",
  });
  assert.equal(valid, false);
});

test("rejects an invalid status event", () => {
  const { valid } = validate("status-event", { event_id: "x" });
  assert.equal(valid, false);
});
