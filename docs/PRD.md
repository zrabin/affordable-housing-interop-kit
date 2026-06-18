# PRD: Affordable Housing Interop Kit

## One-Liner

Affordable Housing Interop Kit is an open-source reference layer for interoperable, auditable, agent-ready affordable housing application workflows.

## Product Thesis

Affordable housing workflows are too important to be trapped inside opaque, brittle, vendor-specific interfaces. Tenants, owners, marketing agents, agencies, and software builders need a shared way to represent application packets, consent, document requests, status events, notices, and audit trails.

The goal is to define an interface layer that modern systems can expose, consume, test against, and audit.

## Target Audiences

### Public Agencies And Technology Teams

They need modernization without losing control, privacy, or procurement integrity.

They care about:

- safety
- transparency
- auditability
- vendor neutrality
- public accountability
- avoiding single-vendor capture

### Housing Operators And Marketing Agents

They need smoother workflows across applicants, documents, agencies, and owners.

They care about:

- fewer manual handoffs
- fewer incomplete packets
- less duplicate entry
- better applicant communication
- compliance confidence
- faster lease-up

### Civic Technology Builders

They need a legible interface for responsible innovation.

They care about:

- schemas
- APIs
- test data
- documentation
- examples
- predictable integration points

### Agent / AI Builders

They need safe, bounded tools for assisting with housing workflows.

They care about:

- MCP tools
- reusable skills
- permissions
- human review
- audit events
- structured outputs
- failure modes

## Core User Needs

### Need 1: Represent A Complete Application Packet

As a system or operator, I need a structured representation of a household's application materials so that I can validate completeness, request missing documents, and track status.

### Need 2: Move Data With Consent

As a tenant or applicant, I need to know what data is being used, by whom, and for what purpose.

### Need 3: Track Status Across Parties

As an operator or applicant, I need status updates that are machine-readable and human-readable.

### Need 4: Request Documents Clearly

As a reviewer, I need a standard way to ask for missing, expired, or invalid documents.

### Need 5: Audit Agent And Human Actions

As an agency, operator, or compliance team, I need to know who did what, when, using what authority.

### Need 6: Reuse Governed Workflow Skills

As a platform builder or reviewer, I need named workflow capabilities that are easy to inspect, reuse, govern, and map to auditable tools.

### Need 7: Build Without Sensitive Data

As a developer, I need synthetic data and a simulator so I can build without touching real applicant data.

## Reference Boundaries

The kit focuses on the reference interface and synthetic test surface:

- synthetic application packets
- synthetic status events
- synthetic document requests
- JSON schemas
- OpenAPI/MCP/CLI surfaces
- civic skill catalog
- audit and consent patterns
- human-review boundaries for agent actions

## Product Experience

The repo should feel like an unusually polished public-good technical standard.

On first view, a policy person should understand:

- this is open
- this is safe to evaluate without live applicant data
- this is designed for public-sector feedback
- this is a serious contribution

A technical person should understand:

- what objects exist
- what actions are possible
- how to test with synthetic data
- how MCP/API/CLI layers relate
- where implementation would begin

An operator should understand:

- how this could reduce workflow friction
- why status/document/audit objects matter
- how this helps without changing everything overnight

## Scope

### Documentation

- README
- PRD
- architecture
- principles
- governance
- security and privacy
- implementation plan

### Interface Artifacts

- JSON Schema for application packet
- JSON Schema for status event
- JSON Schema for document request
- JSON Schema for audit event
- OpenAPI surface
- MCP tool definitions
- civic skill definitions
- CLI command surface

### Synthetic Workflow

- synthetic application packet
- synthetic document request
- synthetic status event
- synthetic data disclaimer

## Core Objects

### Application Packet

Represents a household's application materials and metadata.

Includes:

- applicant
- household members
- income sources
- preferences
- documents
- consent grants
- target opportunity
- completeness status

### Document Request

Represents a request for additional material.

Includes:

- requested document type
- reason
- due date
- acceptable formats
- requesting party
- applicant-facing language

### Status Event

Represents an application lifecycle update.

Includes:

- status
- actor
- reason
- timestamp
- applicant-facing summary
- machine-readable code

### Audit Event

Represents an action taken by a human, system, or agent.

Includes:

- actor type
- actor id
- action
- purpose
- subject
- timestamp
- source system
- privacy classification

## Agent Tool Requirements

Every agent tool must define:

- input schema
- output schema
- approval boundary
- audit behavior
- privacy classification
- allowed side effects
- blocked side effects

High-risk actions require human approval:

- submit application
- change eligibility status
- send formal notice
- share applicant data externally
- mark documents as accepted/rejected

Low-risk actions can be automated:

- validate packet structure
- summarize known status
- draft missing-document request
- generate synthetic test data
- append local audit entry for a completed action

## Civic Skill Requirements

Skills are the capability layer above individual tools. Each skill should describe a repeatable workflow job in plain language and map it to safe executable surfaces.

Every civic skill must define:

- purpose
- primary user
- required inputs
- expected outputs
- allowed tools
- review boundary
- data boundary
- audit behavior
- failure modes
- applicant-facing posture

Initial skills:

- application packet completeness check
- missing-document request draft
- applicant status explanation
- consent grant recorder
- reviewer handoff brief
- audit trail explainer
- formal notice draft
- synthetic lease-up simulator

## Trust Model

Trust is built by making uncertainty and authority visible.

The system should always answer:

- What data is being used?
- Who authorized it?
- What action is being taken?
- Is this a draft or final action?
- Is a human review required?
- Can this be audited later?

## Success Metrics

### Adoption Metrics

- agency and operator stakeholders understand the reference surface
- technical implementers see it as credible
- operators see practical workflow value
- reviewers can evaluate it without private context

### Technical Metrics

- schemas validate examples
- MCP tools map cleanly to workflow actions
- skills make common workflows understandable to non-engineers
- synthetic workflow is understandable
- new developer can run a simple validation in minutes

### Ecosystem Metrics

- external parties can build against the reference surface
- public-sector reviewers see it as vendor-neutral
- implementations can adopt it without exposing implementation-specific logic

## Risks

### Risk: Public Readers Misread The Scope

Mitigation:

- language must be future-facing and neutral
- synthetic implementation scope
- reference-interface language
- emphasize synthetic data and reference architecture

### Risk: Interface Surface Becomes Implementation-Specific

Mitigation:

- keep schemas, examples, and tool definitions implementation-neutral
- avoid vendor-specific naming, workflows, and assumptions
- separate reference interfaces from deployment-specific behavior

### Risk: Technical Artifact Feels Thin

Mitigation:

- define concrete schemas and examples
- include an OpenAPI/MCP/CLI surface
- make synthetic flow coherent end to end

### Risk: Policy Audience Cannot Read It

Mitigation:

- include diagrams and plain-language principles
- make README accessible before technical detail

## Recommended Build

Maintain the public repo as a polished reference implementation:

1. README with cover art and civic framing.
2. PRD and architecture docs.
3. JSON schemas for core objects.
4. MCP tools doc.
5. Civic skill catalog.
6. OpenAPI surface.
7. CLI command surface.
8. Synthetic examples.
9. Security and privacy guidance.
10. Implementation roadmap.
