import { randomUUID } from "node:crypto";
import { generateApplicationPacket } from "../synthetic-data/generate.mjs";
import { validate } from "./validate.mjs";
import { makeAuditEvent } from "./audit.mjs";

export function runDemo() {
  const packet = generateApplicationPacket();
  const check = validate("application-packet", packet);
  if (!check.valid) {
    throw new Error(`generated packet failed validation: ${JSON.stringify(check.errors)}`);
  }

  const actor = { actor_type: "agent", actor_id: "agent_reference_reviewer" };

  const statusEvent = {
    event_id: `evt_${randomUUID().slice(0, 8)}`,
    application_id: packet.packet_id,
    status: "under_review",
    occurred_at: new Date().toISOString(),
    actor,
    applicant_summary: "Your application is under review. No action is needed from you right now.",
    internal_notes: "Synthetic event; no real applicant data.",
  };

  const auditEvent = makeAuditEvent({
    actor,
    action: "review_application_packet",
    subject: packet.packet_id,
    purpose: "eligibility_review",
    privacy_classification: "internal",
  });

  // Negative path: deliberately break the packet, prove the validator rejects it,
  // and capture the rejection in a real audit event.
  const broken = structuredClone(packet);
  delete broken.applicant.full_name;          // violates a required field
  const badCheck = validate("application-packet", broken);
  const rejection = {
    errors: badCheck.errors,
    auditEvent: makeAuditEvent({
      actor,
      action: "reject_invalid_packet",
      subject: broken.packet_id,
      purpose: "schema_validation",
      privacy_classification: "internal",
    }),
  };

  return { packet, statusEvent, auditEvent, rejection };
}
