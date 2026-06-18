/**
 * Skill: Applicant Status Explanation
 *
 * Orchestrates the completeness check and produces a plain-language
 * applicant status event. Fully deterministic, audited, human-review-gated.
 *
 * Does NOT determine eligibility, approve, deny, or qualify applicants.
 * Every output requires human review before applicant-facing delivery.
 */

import { randomUUID } from "node:crypto";
import { checkCompleteness } from "./completeness.mjs";
import { makeAuditEvent } from "../audit.mjs";

/**
 * Humanize a document_type slug: replace underscores with spaces.
 * e.g. "identity_document" → "identity document"
 */
function humanizeType(docType) {
  return docType.replace(/_/g, " ");
}

/**
 * Derive a deterministic status from the completeness result.
 * Only uses statuses safe for this advisory skill:
 *   draft | missing_documents | under_review
 */
function deriveStatus(completeness) {
  if (!completeness.schema_valid) return "draft";
  if (completeness.outstanding.length > 0) return "missing_documents";
  return "under_review";
}

/**
 * Build a plain-language applicant summary. Never says approved/denied/eligible/qualified.
 */
function buildSummary(status, completeness) {
  if (status === "missing_documents") {
    const humanized = completeness.outstanding
      .map((o) => humanizeType(o.document_type))
      .join(", ");
    return `Your application is missing the following: ${humanized}. Please provide these so your application can continue.`;
  }
  if (status === "under_review") {
    return "Your application is complete and under review. No action is needed from you right now.";
  }
  // draft
  return "Your application isn't ready yet — some required information is still needed.";
}

/**
 * Produce a plain-language applicant status DRAFT for human review.
 *
 * @param {object} packet - An application-packet object (may be synthetic or real).
 * @param {object} [opts={}] - Reserved for future options.
 * @returns {{ result: object, audit: object, reviewBoundary: string }}
 *
 * result shape:
 *   statusEvent           {object}  — valid against status-event.schema.json
 *   summary               {string}  — plain-language summary (same as statusEvent.applicant_summary)
 *   human_review_required {true}    — always true; this is a draft only
 *   completeness          {object}  — the completeness.result from checkCompleteness
 *
 * Compliance: statuses limited to draft/missing_documents/under_review.
 * Never implies eligibility, approval, denial, or qualification.
 * Human review is required before any applicant-facing delivery.
 */
export function explainStatus(packet, opts = {}) {
  // 1. Orchestrate completeness check
  const { result: completeness } = checkCompleteness(packet);

  // 2. Derive status deterministically
  const status = deriveStatus(completeness);

  // 3. Build summary
  const applicant_summary = buildSummary(status, completeness);

  // 4. Build statusEvent — valid against status-event.schema.json
  const statusEvent = {
    event_id: `evt_${randomUUID().slice(0, 8)}`,
    application_id: packet?.packet_id ?? "synthetic",
    status,
    occurred_at: new Date().toISOString(),
    actor: { actor_type: "agent", actor_id: "ahik_skill" },
    applicant_summary,
    internal_notes:
      "Synthetic reference output; requires human review before applicant-facing.",
  };

  // 5. Build result
  const result = {
    statusEvent,
    summary: applicant_summary,
    human_review_required: true,
    completeness,
  };

  // 6. Audit event
  const audit = makeAuditEvent({
    actor: { actor_type: "agent", actor_id: "ahik_skill" },
    action: "explain_application_status",
    subject: packet?.packet_id ?? "synthetic",
    purpose: "status_explanation",
    privacy_classification: "internal",
  });

  // 7. Review boundary — hard compliance statement
  const reviewBoundary =
    "applicant-facing draft: a human must review this status before it is sent to the applicant; this skill does not determine eligibility";

  return { result, audit, reviewBoundary };
}
