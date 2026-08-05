# Core Concepts

Plain-language definitions for every term the Open Housing Data Standard uses. Each concept that has a schema links to it.

## Application Packet

A structured, tenant-consented bundle of household, income, preference, document, and eligibility information. One packet represents one household's application. Schema: [application-packet.schema.json](../schemas/application-packet.schema.json).

## Consent Grant

A bounded permission from a tenant or applicant allowing a specific party or system to use specific data for a specific purpose. Consent grants live inside the application packet rather than beside it, so data and permission travel together.

## Status Event

A machine-readable update in the application lifecycle: submitted, missing documents, under review, eligible, ineligible, selected, waitlisted, withdrawn, or closed. Schema: [status-event.schema.json](../schemas/status-event.schema.json).

## Document Request

A structured request for missing or expired documents, including reason, due date, acceptable formats, and responsible party. Schema: [document-request.schema.json](../schemas/document-request.schema.json).

## Notice

A structured, applicant-facing communication tied to an application: an appointment, a document deadline, an eligibility outcome, an appeal outcome, a lease offer, or a general notice. Notices are drafted for human review before they reach an applicant. Schema: [notice.schema.json](../schemas/notice.schema.json).

## Audit Trail

An append-only log of actions taken by humans, systems, or agents, with timestamps, actor identity, purpose, and source. Schema for a single entry: [audit-event.schema.json](../schemas/audit-event.schema.json).

## Agent Tool

A carefully scoped action an AI agent can take through MCP or another tool interface, with explicit guardrails and review boundaries. See [../mcp/tools.md](../mcp/tools.md).

## Civic Skill

A repeatable housing workflow capability, such as packet validation, missing-document drafting, or applicant status explanation, described in plain language and mapped to auditable tools, approval boundaries, and expected outputs. See [skill-catalog.md](skill-catalog.md).
