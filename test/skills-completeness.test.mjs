import { test } from "node:test";
import assert from "node:assert/strict";
import { generateApplicationPacket } from "../synthetic-data/generate.mjs";
import { validate } from "../lib/validate.mjs";
import {
  REQUIRED_DOCUMENT_TYPES,
  checkCompleteness,
} from "../lib/skills/completeness.mjs";

// --- COMPLETE packet: one accepted doc per required type ---
test("complete packet → complete===true, outstanding empty, all three types present", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification",  status: "accepted" },
    { document_id: "d2", document_type: "identity_document",    status: "accepted" },
    { document_id: "d3", document_type: "proof_of_residence",   status: "accepted" },
  ];
  const { result } = checkCompleteness(packet);
  assert.equal(result.schema_valid, true);
  assert.equal(result.complete, true);
  assert.deepEqual(result.outstanding, []);
  assert.ok(REQUIRED_DOCUMENT_TYPES.every((t) => result.present.includes(t)),
    `expected all three types in present; got ${JSON.stringify(result.present)}`);
});

// --- INCOMPLETE packet: only income_verification present, others absent ---
test("incomplete packet → complete===false, identity_document and proof_of_residence outstanding as absent", () => {
  const packet = generateApplicationPacket();
  // Explicitly set to only income_verification doc
  packet.documents = [{ document_id: "d_inc", document_type: "income_verification", status: "accepted" }];
  const { result } = checkCompleteness(packet);
  assert.equal(result.complete, false);
  assert.deepEqual(result.present, ["income_verification"],
    `expected present to be ["income_verification"]; got ${JSON.stringify(result.present)}`);
  const outstandingTypes = result.outstanding.map((o) => o.document_type);
  assert.ok(outstandingTypes.includes("identity_document"),
    `expected identity_document outstanding; got ${JSON.stringify(outstandingTypes)}`);
  assert.ok(outstandingTypes.includes("proof_of_residence"),
    `expected proof_of_residence outstanding; got ${JSON.stringify(outstandingTypes)}`);
  const id = result.outstanding.find((o) => o.document_type === "identity_document");
  const por = result.outstanding.find((o) => o.document_type === "proof_of_residence");
  assert.equal(id.reason, "absent");
  assert.equal(por.reason, "absent");
});

// --- audit event is schema-valid and has correct action ---
test("audit event validates against audit-event schema and has correct action", () => {
  const packet = generateApplicationPacket();
  const { audit } = checkCompleteness(packet);
  const { valid, errors } = validate("audit-event", audit);
  assert.equal(valid, true, `audit-event schema invalid: ${JSON.stringify(errors)}`);
  assert.equal(audit.action, "check_packet_completeness");
});

// --- reviewBoundary contains the required phrase ---
test("reviewBoundary contains 'does not determine eligibility'", () => {
  const packet = generateApplicationPacket();
  const { reviewBoundary } = checkCompleteness(packet);
  assert.ok(
    reviewBoundary.includes("does not determine eligibility"),
    `reviewBoundary was: ${reviewBoundary}`
  );
});

// --- blocking statuses produce meaningful reasons ---
test("doc with status 'expired' produces reason 'expired', not 'absent'", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification",  status: "accepted" },
    { document_id: "d2", document_type: "identity_document",    status: "expired" },
    { document_id: "d3", document_type: "proof_of_residence",   status: "rejected" },
  ];
  const { result } = checkCompleteness(packet);
  assert.equal(result.complete, false);
  const id = result.outstanding.find((o) => o.document_type === "identity_document");
  const por = result.outstanding.find((o) => o.document_type === "proof_of_residence");
  assert.equal(id.reason, "expired");
  assert.equal(por.reason, "rejected");
});

// --- 'provided' status also counts as present ---
test("doc with status 'provided' marks type as present", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification",  status: "provided" },
    { document_id: "d2", document_type: "identity_document",    status: "provided" },
    { document_id: "d3", document_type: "proof_of_residence",   status: "provided" },
  ];
  const { result } = checkCompleteness(packet);
  assert.equal(result.complete, true);
  assert.equal(result.outstanding.length, 0);
});

// --- schema_valid=false when packet is malformed, complete=false ---
test("schema-invalid packet → schema_valid===false, complete===false, errors populated", () => {
  const packet = generateApplicationPacket();
  delete packet.applicant.full_name; // required field
  const { result } = checkCompleteness(packet);
  assert.equal(result.schema_valid, false);
  assert.equal(result.complete, false);
  assert.ok(Array.isArray(result.errors) && result.errors.length > 0,
    "expected errors array to be non-empty");
});
