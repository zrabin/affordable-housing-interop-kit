import { test } from "node:test";
import assert from "node:assert/strict";
import { runDemo } from "../lib/demo.mjs";
import { validate } from "../lib/validate.mjs";

test("demo produces three schema-valid artifacts", () => {
  const { packet, statusEvent, auditEvent } = runDemo();
  assert.equal(validate("application-packet", packet).valid, true);
  assert.equal(validate("status-event", statusEvent).valid, true);
  assert.equal(validate("audit-event", auditEvent).valid, true);
});

test("demo's negative path catches an invalid packet and audits the rejection", () => {
  const { rejection } = runDemo();
  assert.ok(rejection.errors.length > 0, "expected validation errors");
  assert.equal(validate("audit-event", rejection.auditEvent).valid, true);
  assert.equal(rejection.auditEvent.action, "reject_invalid_packet");
});
