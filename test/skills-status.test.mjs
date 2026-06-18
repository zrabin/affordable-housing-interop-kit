import { test } from "node:test";
import assert from "node:assert/strict";
import { generateApplicationPacket } from "../synthetic-data/generate.mjs";
import { validate } from "../lib/validate.mjs";
import { explainStatus } from "../lib/skills/status-explanation.mjs";

// --- INCOMPLETE packet: only income_verification ---
test("incomplete packet → status===missing_documents, summary lists outstanding docs, human_review_required===true", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification", status: "accepted" },
  ];
  const { result, audit, reviewBoundary } = explainStatus(packet);
  assert.equal(result.statusEvent.status, "missing_documents");
  assert.ok(
    result.summary.includes("identity document"),
    `expected "identity document" in summary; got: ${result.summary}`
  );
  assert.ok(
    result.summary.includes("proof of residence"),
    `expected "proof of residence" in summary; got: ${result.summary}`
  );
  assert.equal(result.human_review_required, true);
  const seCheck = validate("status-event", result.statusEvent);
  assert.equal(seCheck.valid, true, `statusEvent schema invalid: ${JSON.stringify(seCheck.errors)}`);
  const auditCheck = validate("audit-event", audit);
  assert.equal(auditCheck.valid, true, `audit-event schema invalid: ${JSON.stringify(auditCheck.errors)}`);
  assert.equal(audit.action, "explain_application_status");
});

// --- COMPLETE packet: all three required docs present ---
test("complete packet → status===under_review, summary says complete and under review, statusEvent validates", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification",  status: "accepted" },
    { document_id: "d2", document_type: "identity_document",    status: "accepted" },
    { document_id: "d3", document_type: "proof_of_residence",   status: "accepted" },
  ];
  const { result } = explainStatus(packet);
  assert.equal(result.statusEvent.status, "under_review");
  assert.ok(
    result.summary.includes("complete and under review"),
    `expected "complete and under review" in summary; got: ${result.summary}`
  );
  const seCheck = validate("status-event", result.statusEvent);
  assert.equal(seCheck.valid, true, `statusEvent schema invalid: ${JSON.stringify(seCheck.errors)}`);
});

// --- SCHEMA-INVALID packet → draft ---
test("schema-invalid packet → status===draft", () => {
  const packet = generateApplicationPacket();
  delete packet.applicant.full_name; // violates required field
  const { result } = explainStatus(packet);
  assert.equal(result.statusEvent.status, "draft");
});

// --- reviewBoundary compliance ---
test("reviewBoundary contains 'human' and 'does not determine eligibility'", () => {
  const packet = generateApplicationPacket();
  const { reviewBoundary } = explainStatus(packet);
  assert.ok(reviewBoundary.includes("human"), `reviewBoundary was: ${reviewBoundary}`);
  assert.ok(
    reviewBoundary.includes("does not determine eligibility"),
    `reviewBoundary was: ${reviewBoundary}`
  );
});

// --- result.completeness is propagated ---
test("result.completeness mirrors checkCompleteness result shape", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification",  status: "accepted" },
    { document_id: "d2", document_type: "identity_document",    status: "accepted" },
    { document_id: "d3", document_type: "proof_of_residence",   status: "accepted" },
  ];
  const { result } = explainStatus(packet);
  assert.ok("schema_valid" in result.completeness, "completeness.schema_valid missing");
  assert.ok("complete" in result.completeness, "completeness.complete missing");
  assert.ok(Array.isArray(result.completeness.present), "completeness.present not array");
  assert.ok(Array.isArray(result.completeness.outstanding), "completeness.outstanding not array");
});

// --- statusEvent has required fields (event_id, application_id, actor, occurred_at, applicant_summary) ---
test("statusEvent has all required fields and application_id matches packet_id", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification",  status: "accepted" },
    { document_id: "d2", document_type: "identity_document",    status: "accepted" },
    { document_id: "d3", document_type: "proof_of_residence",   status: "accepted" },
  ];
  const { result } = explainStatus(packet);
  const se = result.statusEvent;
  assert.ok(typeof se.event_id === "string" && se.event_id.startsWith("evt_"), `event_id: ${se.event_id}`);
  assert.equal(se.application_id, packet.packet_id);
  assert.ok(typeof se.occurred_at === "string");
  assert.deepEqual(se.actor, { actor_type: "agent", actor_id: "ahik_skill" });
  assert.ok(typeof se.applicant_summary === "string" && se.applicant_summary.length > 0);
});
