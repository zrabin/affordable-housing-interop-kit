# Diagrams

## Architecture

```mermaid
flowchart LR
  A[Synthetic Data Generator] --> B[Application Packet]
  B --> C[Schema Validator]
  C --> D[Agent Skills via MCP Tools]
  D -->|human review| E[Status Events]
  D --> F[Audit Trail]
  E --> G[Applicant-facing Summary]
  F --> H[Auditable Record]
```

## Civic Interop Layer

```mermaid
flowchart LR
  A[Tenant / Applicant] --> B[Consent Grant]
  B --> C[Application Packet]
  C --> D[Affordable Housing Interop Layer]
  D --> E[OpenAPI]
  D --> F[MCP Tools]
  D --> G[CLI]
  D --> H[Audit Events]
  E --> I[Compliant Vendor Implementation]
  E --> J[Agency Systems]
  E --> K[Operator Systems]
  F --> L[Human-Reviewed Agents]
```

## Human-In-The-Loop Agent Flow

```mermaid
sequenceDiagram
  participant Applicant
  participant Agent
  participant Reviewer
  participant Interop as Interop Layer
  participant Audit

  Applicant->>Agent: asks for application status
  Agent->>Interop: check_application_status
  Interop->>Audit: append read event
  Interop-->>Agent: structured status events
  Agent-->>Applicant: plain-language summary

  Agent->>Interop: create_document_request_draft
  Interop-->>Agent: draft request
  Agent->>Reviewer: request approval before sending
  Reviewer-->>Agent: approve
  Agent->>Interop: send approved request
  Interop->>Audit: append approved action event
```

## Reference Layer vs Implementation Layer

```text
Reference layer
  - schemas
  - synthetic examples
  - reference API
  - MCP tool definitions
  - CLI workflow
  - principles

Implementation layer
  - live integrations
  - operator workflows
  - compliance automation configuration
  - product UX
  - deployment playbooks
  - production data handling
```
