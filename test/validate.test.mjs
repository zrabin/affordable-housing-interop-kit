import { test } from "node:test";
import assert from "node:assert/strict";
import { validate, schemaNames } from "../lib/validate.mjs";

test("loads all six schemas", () => {
  assert.deepEqual(
    schemaNames().sort(),
    ["application-packet", "audit-event", "document-request", "form", "notice", "status-event"],
  );
});

test("validates the form example shape", () => {
  const { valid } = validate("form", {
    form_id: "frm_x",
    application_id: "pkt_x",
    form_type: "student_status_certification",
    status: "pending",
    created_at: "2026-06-16T16:20:00Z",
  });
  assert.equal(valid, true);
});

test("rejects a form with an unknown status", () => {
  const { valid } = validate("form", {
    form_id: "frm_x",
    application_id: "pkt_x",
    form_type: "tenant_income_certification",
    status: "notarized",
    created_at: "2026-06-16T16:20:00Z",
  });
  assert.equal(valid, false);
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
