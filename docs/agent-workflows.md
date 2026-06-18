# Agent Workflows

These workflows can also be packaged as civic skills. A skill names the reusable capability, while the workflow shows the operational sequence and the MCP tools provide the executable surface.

## Workflow 1: Applicant Status Summary

Related skill: Applicant Status Explanation.

Goal: help an applicant understand where their application stands.

Steps:

1. Agent receives applicant question.
2. Agent verifies consent and identity context.
3. Agent calls `summarize_application_status`.
4. Tool returns structured status and applicant-facing summary.
5. Agent answers in plain language.
6. Audit event records the status read.

Human approval:

- Not required for reviewer-facing or applicant-owned status summaries if identity and consent are verified.
- Required if summary includes formal determination language.

## Workflow 2: Missing Document Request

Related skill: Missing-Document Request Draft.

Goal: prepare a clear document request without sending it automatically.

Steps:

1. Agent validates packet.
2. Missing document is detected.
3. Agent calls `create_document_request_draft`.
4. Tool returns draft request.
5. Human reviewer approves or edits.
6. Approved request is sent.
7. Audit event records draft and send.

Human approval:

- Required before applicant delivery.

## Workflow 3: Synthetic Workflow

Related skill: Synthetic Lease-Up Simulator.

Goal: show the workflow without private data.

Steps:

1. Generate synthetic household.
2. Generate application packet.
3. Validate packet.
4. Create document request.
5. Add status event.
6. Produce audit trail.

Human approval:

- Not required because no real data or external action is involved.

## Workflow 4: Formal Notice Draft

Related skill: Formal Notice Draft.

Goal: draft a formal notice while preserving human control.

Steps:

1. Reviewer asks agent to draft notice.
2. Agent calls `generate_notice_draft`.
3. Tool returns draft plus review checklist.
4. Human reviewer edits and approves.
5. System sends notice only after approval.
6. Audit trail records approval and send.

Human approval:

- Always required.
