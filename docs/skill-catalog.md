# Civic Skill Catalog

Skills are reusable, reviewable housing workflow capabilities.

They sit above raw API endpoints and MCP tools. A skill describes the useful thing a human, agency, operator, or agent is trying to accomplish. The underlying implementation can use schemas, APIs, MCP tools, CLI commands, or conventional software.

## Why Skills Matter

Affordable housing workflows are full of repeated tasks:

- checking whether an application packet is complete
- explaining status to an applicant
- drafting a missing-document request
- preparing a reviewer handoff
- recording consent
- producing an audit trail

Skills give those tasks names, boundaries, and review rules. That makes the platform easier to explain, easier to govern, and easier for responsible third parties to build against.

## Skill Definition Template

Each skill should define:

- **Purpose**: what workflow job the skill performs.
- **Primary user**: applicant, reviewer, operator, agency, developer, or agent.
- **Inputs**: schemas, records, files, or prior status events required.
- **Outputs**: structured objects, drafts, summaries, alerts, or audit events produced.
- **Allowed tools**: MCP tools, API endpoints, or CLI commands the skill may use.
- **Review boundary**: what can run automatically and what requires human approval.
- **Data boundary**: privacy class, consent requirements, and retention expectations.
- **Audit behavior**: events the skill must append or expose.
- **Failure modes**: uncertainty, missing data, conflicts, stale records, or blocked actions.
- **Applicant-facing posture**: whether the output can be shown directly or must be reviewed.

## Initial Skill Index

### 1. Application Packet Completeness Check

Purpose: determine whether a packet has the required structure and expected supporting documents.

Primary users:

- reviewer
- operator
- developer
- applicant support agent

Typical inputs:

- application packet
- document requirements
- consent grant

Typical outputs:

- completeness result
- missing fields
- missing or expired documents
- applicant-facing next-step summary

Allowed tools:

- `validate_application_packet`
- `append_audit_event`

Review boundary:

- automated for validation and draft summary
- human review before communicating formal consequences

### 2. Missing-Document Request Draft

Purpose: create a clear request for missing, expired, or invalid documents.

Primary users:

- reviewer
- marketing agent
- applicant support agent

Typical inputs:

- application id
- missing document type
- reason
- due date
- language preference

Typical outputs:

- structured document request
- applicant-facing draft language
- reviewer checklist

Allowed tools:

- `create_document_request_draft`
- `generate_notice_draft`
- `append_audit_event`

Review boundary:

- human approval required before applicant delivery

### 3. Applicant Status Explanation

Purpose: turn structured status events into a plain-language explanation of where an application stands.

Primary users:

- applicant
- applicant support agent
- operator

Typical inputs:

- status events
- document requests
- application packet metadata

Typical outputs:

- current status
- next step
- unresolved blockers
- applicant-friendly explanation

Allowed tools:

- `summarize_application_status`
- `append_audit_event`

Review boundary:

- automated for informal status readouts when identity and consent are verified
- human review for formal determination language

### 4. Consent Grant Recorder

Purpose: record a bounded permission for a person or system to use applicant data for a specific purpose.

Primary users:

- applicant
- reviewer
- operator
- agency system

Typical inputs:

- subject
- grantee
- data categories
- purpose
- expiration

Typical outputs:

- consent grant id
- consent summary
- audit event

Allowed tools:

- `record_consent_grant`
- `append_audit_event`

Review boundary:

- explicit applicant or authorized representative action required

### 5. Reviewer Handoff Brief

Purpose: summarize an application packet for a human reviewer without making a determination.

Primary users:

- reviewer
- compliance team
- operator

Typical inputs:

- application packet
- status events
- document requests
- audit events

Typical outputs:

- packet summary
- open issues
- document checklist
- recent activity timeline

Allowed tools:

- `validate_application_packet`
- `summarize_application_status`
- `append_audit_event`

Review boundary:

- automated for reviewer-facing draft briefs
- human decision remains outside the skill

### 6. Audit Trail Explainer

Purpose: produce a readable explanation of what happened in a workflow and which actors or systems took each action.

Primary users:

- agency
- operator
- compliance reviewer
- applicant support team

Typical inputs:

- audit events
- actor metadata
- related status events

Typical outputs:

- timeline
- action summary
- authority and purpose notes
- unresolved gaps

Allowed tools:

- `append_audit_event`
- read-only audit query tools in future versions

Review boundary:

- automated for reviewer-facing summaries
- human review before external disclosure

### 7. Formal Notice Draft

Purpose: draft formal applicant notices from structured status and document information while preserving human control.

Primary users:

- reviewer
- compliance team
- operator

Typical inputs:

- notice type
- application id
- status
- reason codes
- recipient language preference

Typical outputs:

- draft notice
- required review checklist
- audit event draft

Allowed tools:

- `generate_notice_draft`
- `append_audit_event`

Review boundary:

- human approval always required before sending

### 8. Synthetic Lease-Up Simulator

Purpose: run an end-to-end workflow using synthetic applicants, packets, requests, status events, and audit trails.

Primary users:

- developer
- public-sector technology reviewer
- product team
- evaluator

Typical inputs:

- synthetic household profile
- synthetic opportunity
- scenario options

Typical outputs:

- synthetic application packet
- synthetic document request
- synthetic status event
- audit trail
- workflow transcript

Allowed tools:

- `validate_application_packet`
- `create_document_request_draft`
- `summarize_application_status`
- `append_audit_event`

Review boundary:

- no human approval required because the workflow uses synthetic data and has no external side effects

## Skill-To-Tool Relationship

Skills are the public, human-readable capability layer. Tools are the executable interface.

For example:

- The **Applicant Status Explanation** skill may call `summarize_application_status`.
- The **Missing-Document Request Draft** skill may call `create_document_request_draft`.
- The **Synthetic Lease-Up Simulator** skill may call several tools in sequence.

This distinction keeps the platform legible to policy, operations, and technical audiences at the same time.

## Governance Expectations

New skills should be reviewed for:

- tenant consent
- data minimization
- human approval boundaries
- audit coverage
- applicant-facing clarity
- compatibility with public-sector oversight

Skills that can affect applicant rights, eligibility, formal notices, or external data sharing should require explicit human approval before action.
