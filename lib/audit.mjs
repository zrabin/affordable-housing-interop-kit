import { randomUUID } from "node:crypto";

export function makeAuditEvent({
  actor,
  action,
  subject,
  purpose,
  privacy_classification = "internal",
  source_system = "ahik-reference",
}) {
  return {
    audit_id: `aud_${randomUUID().slice(0, 8)}`,
    occurred_at: new Date().toISOString(),
    actor,
    action,
    subject,
    purpose,
    source_system,
    privacy_classification,
    human_approval_required: false,
  };
}
