/**
 * Skill: Application Packet Completeness Check
 *
 * Flags outstanding documents for human review.
 * Does NOT determine eligibility, approve, deny, or qualify applicants.
 */

import { validate } from "../validate.mjs";
import { makeAuditEvent } from "../audit.mjs";

/** The document types required for a complete application packet. */
export const REQUIRED_DOCUMENT_TYPES = [
  "income_verification",
  "identity_document",
  "proof_of_residence",
];

/** Statuses that mean a document of that type is present and acceptable. */
const PRESENT_STATUSES = new Set(["provided", "accepted"]);

/**
 * Check whether an application packet has all required documents present.
 *
 * @param {object} packet - An application-packet object (may be synthetic or real).
 * @param {object} [opts={}] - Reserved for future options.
 * @returns {{ result: object, audit: object, reviewBoundary: string }}
 *
 * result shape:
 *   schema_valid {boolean}
 *   complete     {boolean}
 *   present      {string[]}   — required types that are present/accepted
 *   outstanding  {Array<{ document_type: string, reason: string }>}
 *   errors?      {array}      — AJV errors; only present when schema_valid===false
 *
 * Compliance: this skill FLAGS outstanding documents for human review.
 * It never uses or implies eligible/ineligible/approve/deny/qualify.
 */
export function checkCompleteness(packet, opts = {}) {
  // 1. Schema validation
  const check = validate("application-packet", packet);
  const schema_valid = check.valid;

  // 2. Document inventory
  const docs = Array.isArray(packet?.documents) ? packet.documents : [];

  // 3. Classify each required type
  const present = [];
  const outstanding = [];

  for (const requiredType of REQUIRED_DOCUMENT_TYPES) {
    const docsOfType = docs.filter((d) => d.document_type === requiredType);

    if (docsOfType.some((d) => PRESENT_STATUSES.has(d.status))) {
      // At least one doc of this type is in a present/accepted state
      present.push(requiredType);
    } else if (docsOfType.length === 0) {
      // No doc of this type exists at all
      outstanding.push({ document_type: requiredType, reason: "absent" });
    } else {
      // Doc(s) exist but none are present/accepted — use the blocking status
      const blockingDoc = docsOfType[0];
      outstanding.push({ document_type: requiredType, reason: blockingDoc.status ?? "unknown" });
    }
  }

  // 4. Complete only when schema is valid AND no outstanding types
  const complete = schema_valid && outstanding.length === 0;

  // 5. Build result
  const result = { schema_valid, complete, present, outstanding };
  if (!schema_valid) {
    result.errors = check.errors;
  }

  // 6. Audit event
  const audit = makeAuditEvent({
    actor: { actor_type: "agent", actor_id: "ahik_skill" },
    action: "check_packet_completeness",
    subject: packet?.packet_id ?? "synthetic",
    purpose: "completeness_check",
    privacy_classification: "internal",
  });

  // 7. Review boundary — hard compliance statement
  const reviewBoundary =
    "advisory: flags outstanding documents for human review; does not determine eligibility";

  return { result, audit, reviewBoundary };
}
