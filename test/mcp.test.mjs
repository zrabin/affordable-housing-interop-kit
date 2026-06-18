import { test } from "node:test";
import assert from "node:assert/strict";
import { TOOLS, handleCall } from "../mcp/server.mjs";
import { generateApplicationPacket } from "../synthetic-data/generate.mjs";

test("exposes the six documented tools", () => {
  assert.equal(TOOLS.length, 6);
  assert.ok(TOOLS.every((t) => typeof t.name === "string" && t.inputSchema));
  const names = TOOLS.map((t) => t.name);
  assert.ok(names.includes("validate_application_packet"));
  assert.ok(names.includes("append_audit_event"));
});

test("validate tool accepts a generated packet and returns an audit event", () => {
  const packet = generateApplicationPacket();
  const { result, audit } = handleCall("validate_application_packet", { packet });
  assert.equal(result.valid, true);
  assert.equal(audit.action, "validate_application_packet");
});
