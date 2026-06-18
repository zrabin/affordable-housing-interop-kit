# MCP Tools

These are proposed Model Context Protocol tools for agentic affordable housing workflows.

MCP tools are the executable layer beneath civic skills. A skill may call one tool or orchestrate several tools in sequence while preserving review, consent, and audit boundaries.

All tools should be implemented with strict input schemas, structured outputs, and audit behavior.

## Tool: `validate_application_packet`

Purpose: validate structure and completeness of an application packet.

Risk: low.

Requires human approval: no.

Side effects: none.

Input:

- application packet

Output:

- validity
- missing fields
- warnings
- applicant-facing summary

## Tool: `create_document_request_draft`

Purpose: draft a missing-document request for human review.

Risk: medium.

Requires human approval: yes, before sending.

Side effects: draft only.

Input:

- application id
- missing document type
- reason
- due date

Output:

- structured document request
- applicant-facing language
- reviewer notes

## Tool: `summarize_application_status`

Purpose: produce a plain-language status summary for an applicant, operator, or reviewer.

Risk: low to medium, depending on audience.

Requires human approval: no for reviewer-facing summary; yes before external applicant delivery in regulated contexts.

Input:

- application id
- status events
- document requests

Output:

- summary
- next steps
- unresolved blockers

## Tool: `record_consent_grant`

Purpose: record a tenant/applicant consent grant.

Risk: high.

Requires human approval: yes.

Input:

- subject
- grantee
- data categories
- purpose
- expiration

Output:

- consent grant id
- audit event

## Tool: `append_audit_event`

Purpose: append an audit event for a completed action.

Risk: low if append-only.

Requires human approval: no.

Input:

- actor
- action
- subject
- purpose
- source
- privacy classification

Output:

- audit event id
- timestamp

## Tool: `generate_notice_draft`

Purpose: draft a notice based on structured status and document information.

Risk: high.

Requires human approval: yes, always before sending.

Input:

- notice type
- application id
- status
- reason codes
- recipient language preference

Output:

- draft notice
- required review checklist
- audit event draft
