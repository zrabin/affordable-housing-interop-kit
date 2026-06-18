import { test } from "node:test";
import assert from "node:assert/strict";
import { TOOLS, handleCall } from "../mcp/server.mjs";
import { generateApplicationPacket } from "../synthetic-data/generate.mjs";

test("exposes seven documented tools", () => {
  assert.equal(TOOLS.length, 7);
  assert.ok(TOOLS.every((t) => typeof t.name === "string" && t.inputSchema));
  const names = TOOLS.map((t) => t.name);
  assert.ok(names.includes("validate_application_packet"));
  assert.ok(names.includes("append_audit_event"));
  assert.ok(names.includes("check_application_packet_completeness"));
});

test("validate tool accepts a generated packet and returns an audit event", () => {
  const packet = generateApplicationPacket();
  const { result, audit } = handleCall("validate_application_packet", { packet });
  assert.equal(result.valid, true);
  assert.equal(audit.action, "validate_application_packet");
});

test("check_application_packet_completeness tool returns a result with boolean complete", () => {
  const packet = generateApplicationPacket();
  const { result, audit } = handleCall("check_application_packet_completeness", { packet });
  assert.equal(typeof result.complete, "boolean",
    `expected result.complete to be boolean, got ${typeof result.complete}`);
  assert.equal(typeof result.schema_valid, "boolean");
  assert.ok(Array.isArray(result.outstanding));
  assert.ok(Array.isArray(result.present));
  assert.equal(audit.action, "check_application_packet_completeness");
});
