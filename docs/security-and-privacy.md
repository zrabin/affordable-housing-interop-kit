# Security And Privacy

Affordable housing data can include income, household composition, identity documents, disability status, immigration-sensitive context, contact information, and other personal details.

This kit is designed with a high privacy bar.

## Data Classes

### Public

Safe to publish:

- schemas
- documentation
- synthetic examples
- API shape
- MCP tool names
- CLI command names

### Internal

Not for public docs without review:

- implementation notes
- deployment-specific workflows
- deployment diagrams
- non-public stakeholder names
- non-public planning notes

### Restricted

Keep restricted materials out of the public standard:

- real applicant records
- real documents
- credentials
- private endpoint URLs
- production API responses
- screenshots of private systems
- authentication tokens

## Consent Model

Every real data flow should be backed by a consent grant.

Minimum fields:

- subject
- grantee
- data categories
- purpose
- effective time
- expiration
- revocation status

## Agentic Safety

Agents must operate through tools with bounded authority.

Require approval for:

- external data sharing
- formal submissions
- formal notices
- eligibility decisions
- document acceptance/rejection
- irreversible writes

Allow automation for:

- schema validation
- synthetic data generation
- draft summaries
- local audit preparation
- non-binding completeness checks

## Audit Requirements

Every action should produce an audit event with:

- actor type
- actor id
- action
- subject
- purpose
- timestamp
- source system
- privacy classification
- whether human approval was required

## Public Repo Safety Checklist

Before publishing:

- synthetic data clearly labeled
- reference interfaces only
- credentials excluded
- public claims reviewed
- compliance language reviewed
- reference-interface status clearly labeled
