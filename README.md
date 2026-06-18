<p align="center">
  <img src="assets/cover.png" alt="Affordable Housing Interop Kit cover art" width="100%" />
</p>

# Affordable Housing Interop Kit

An open reference architecture for modern, auditable, agent-ready affordable housing application workflows.

This repository defines a public interoperability layer: a neutral set of schemas, APIs, MCP tools, civic skill definitions, CLI commands, synthetic data, and implementation patterns that housing operators, software vendors, civic technology teams, and public agencies can build against.

It uses synthetic data for safety and repeatability. The focus is the shared interface surface for privacy-preserving, inspectable, interoperable affordable housing infrastructure.

## Why This Exists

Affordable housing workflows sit between tenants, marketing agents, owners, compliance teams, and public agencies. The current ecosystem often depends on brittle handoffs, manual status checks, duplicated data entry, opaque eligibility steps, and vendor-specific workflows.

The next generation should be different:

- tenant-consented data flows
- clear audit trails
- standardized application packets
- machine-readable eligibility and document requirements
- secure status updates
- reusable civic skills
- public-facing integration patterns
- agent-ready workflows with human oversight
- enough openness that multiple vendors can participate fairly

This kit is a reference point for that future.

## Scope

This repo defines a reference interoperability layer for affordable housing workflows:

- **Schemas** for applicants, households, applications, document requests, status events, notices, and audit records.
- **OpenAPI spec** for conventional software integrations.
- **MCP tools** for agentic workflows.
- **Civic skill catalog** for repeatable, reviewable housing capabilities.
- **CLI command surface** for developer and operator workflows.
- **Synthetic data harness** so teams can test without private or regulated data.
- **Principles and governance docs** to keep the effort public-spirited, transparent, and safe.

## Reference Boundaries

The reference layer is designed for standards discussion, synthetic workflow testing, and implementation planning. It covers:

- interface design
- synthetic examples
- reference API/MCP/CLI surfaces
- privacy and consent patterns
- audit event modeling
- human-reviewed agent actions

## Guiding Posture

The guiding posture is simple:

> Make the gate legible, documented, auditable, and usable by everyone.

An affordable housing platform should have a clear, trustworthy way to participate in a modern workflow. If a city, agency, owner, marketing agent, or technology provider wants to build a better application experience, the interface should be clear enough to reason about and safe enough to trust.

## Core Concepts

### Application Packet

A structured, tenant-consented bundle of household, income, preference, document, and eligibility information.

### Consent Grant

A bounded permission from a tenant or applicant allowing a specific party or system to use specific data for a specific purpose.

### Status Event

A machine-readable update in the application lifecycle: submitted, missing documents, under review, eligible, ineligible, selected, waitlisted, withdrawn, or closed.

### Document Request

A structured request for missing or expired documents, including reason, due date, acceptable formats, and responsible party.

### Audit Trail

An append-only log of actions taken by humans, systems, or agents, with timestamps, actor identity, purpose, and source.

### Agent Tool

A carefully scoped action an AI agent can take through MCP or another tool interface, with explicit guardrails and review boundaries.

### Civic Skill

A repeatable housing workflow capability, such as packet validation, missing-document drafting, or applicant status explanation, described in plain language and mapped to auditable tools, approval boundaries, and expected outputs.

## Repository Map

```text
.
├── README.md
├── assets/
│   └── cover.png
├── docs/
│   ├── PRD.md
│   ├── agent-workflows.md
│   ├── architecture.md
│   ├── diagrams.md
│   ├── governance.md
│   ├── implementation-plan.md
│   ├── positioning.md
│   ├── principles.md
│   ├── skill-catalog.md
│   └── security-and-privacy.md
├── schemas/
│   ├── application-packet.schema.json
│   ├── status-event.schema.json
│   ├── document-request.schema.json
│   └── audit-event.schema.json
├── examples/
│   ├── application-packet.example.json
│   ├── status-event.example.json
│   └── document-request.example.json
├── mcp/
│   └── tools.md
├── cli/
│   └── ahik.md
└── synthetic-data/
    └── README.md
```

## Example Agent Actions

An AI agent should never have unlimited access to sensitive housing workflows. It should operate through narrow, auditable tools:

- `create_application_packet`
- `validate_application_packet`
- `request_missing_documents`
- `check_application_status`
- `summarize_status_for_applicant`
- `generate_notice_draft`
- `record_consent_grant`
- `append_audit_event`

Each tool should specify:

- required inputs
- allowed outputs
- human approval boundary
- privacy classification
- audit behavior
- failure modes

See [mcp/tools.md](mcp/tools.md).

## Civic Skill Catalog

Skills make the platform story easier to understand. A skill is the product-level capability; an MCP tool is one way that capability can be executed safely.

Examples:

- application packet completeness check
- missing-document request draft
- applicant status explanation
- eligibility evidence organizer
- consent grant recorder
- audit trail explainer
- synthetic lease-up simulator

Each skill should define the user it serves, the inputs it needs, the tools it may call, the review boundary, the audit events it creates, and the failure modes it must disclose.

See [docs/skill-catalog.md](docs/skill-catalog.md).

## Quickstart

The first useful workflow is a synthetic flow:

1. Create a synthetic applicant household.
2. Generate an application packet.
3. Validate the packet.
4. Request a missing document.
5. Append a status event.
6. Produce an applicant-friendly summary.
7. Show the audit trail.

Target command shape:

```bash
ahik workflow synthetic-application
ahik validate examples/application-packet.example.json
ahik status examples/status-event.example.json
```

## Design Principles

- **Public good first**: the standard should help the ecosystem, not only one vendor.
- **No private data in the standard**: examples must be synthetic.
- **Tenant consent is central**: data movement must be intentional and bounded.
- **Audit everything**: every meaningful action should be reconstructable.
- **Human-in-the-loop by default**: agents can assist, but sensitive decisions need review.
- **Vendor-neutral by posture**: any compliant system can implement the interface.
- **Modern but legible**: OpenAPI, MCP, CLI, and clear docs should serve both technical and policy audiences.

See [docs/principles.md](docs/principles.md).

## Project Status

Status: public reference implementation.

This repository is suitable for:

- technical alignment
- public-sector review
- implementation planning
- synthetic workflow testing
- production-grade governance, privacy, and review-boundary design

## License

Code is licensed under the MIT License. Documentation and examples are available under CC BY 4.0.
