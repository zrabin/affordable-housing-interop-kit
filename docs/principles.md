# Principles

## Public Good First

This kit exists to improve the affordable housing technology ecosystem.

The standard should make it easier for responsible participants to build, audit, and improve housing workflows.

## Vendor-Neutral By Design

The interface should be useful across independent implementations.

The interface should be useful to:

- city systems
- housing operators
- marketing agents
- tenant support organizations
- civic tech teams
- software vendors
- AI agents operating under guardrails

## No Private Data In The Standard

Examples, tests, and documentation must use synthetic data.

Keep out of the public standard:

- real applicant data
- live credentials
- non-public system endpoints
- screenshots of private systems
- proprietary implementation details of any specific system

## Consent Is The Center

Affordable housing data can be deeply sensitive. Data movement should be explicit, bounded, and explainable.

Every data-sharing flow should be able to answer:

- who consented
- what they consented to
- when consent was granted
- what data is covered
- who can use it
- for what purpose
- how it can be revoked

## Auditability Is Non-Negotiable

Every meaningful action should leave an audit trail:

- human actions
- system actions
- agent actions
- data access
- status changes
- formal notices
- document decisions

The audit layer should be append-only in spirit, with clear event shapes and durable retention expectations.

## Human Review For Sensitive Decisions

Agents can help assemble packets, summarize statuses, draft notices, and identify missing documents.

Require explicit human review for:

- determine eligibility
- reject applicants
- submit formal applications
- send formal notices
- share sensitive data
- override human reviewers

## Synthetic First

Reference implementations should work against synthetic data and a simulator before handling live applicant data.

This lets teams:

- test safely
- test workflows
- refine object models
- support public-sector review
- prevent premature live-system claims

## Modern But Legible

The project should support modern integration patterns:

- OpenAPI
- MCP
- CLI
- JSON Schema
- event streams
- audit logs

But the repository must remain understandable to non-engineers.

## Open Interface, Specific Implementations

Publish the shared interface surface. Keep implementation-specific behavior in the adopting system.

Good to open:

- schemas
- synthetic examples
- tool definitions
- API shape
- synthetic workflow harness
- public principles

Keep implementation-specific:

- customer relationships
- product UX
- compliance automation details
- ranking/prioritization logic
- operational playbooks
- production integrations
- live data handling
