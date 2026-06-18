import { test } from "node:test";
import assert from "node:assert/strict";
import { validate, schemaNames } from "../lib/validate.mjs";

test("loads all four schemas", () => {
  assert.deepEqual(
    schemaNames().sort(),
    ["application-packet", "audit-event", "document-request", "status-event"],
  );
});

test("rejects an invalid status event", () => {
  const { valid } = validate("status-event", { event_id: "x" });
  assert.equal(valid, false);
});
