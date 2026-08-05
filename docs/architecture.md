# Architecture

## Overview

The Open Housing Data Standard defines an interface layer between housing workflow participants.

```text
Tenant / Applicant
      |
      v
Application Packet + Consent Grant
      |
      v
Interop Layer
      |-------- OpenAPI
      |-------- MCP Tools
      |-------- CLI
      |-------- Event Stream
      |
      v
Implementations
  - agency systems
  - operator systems
  - software vendors
  - tenant support tools
  - synthetic simulator
```

The interop layer is the shared contract between systems of record, workflow tools, agents, and review surfaces.

## Layers

### 1. Schema Layer

Defines canonical object shapes:

- application packet
- document request
- status event
- audit event
- consent grant

### 2. API Layer

Defines conventional HTTP integration:

- create packet
- validate packet
- list document requests
- append status event
- retrieve audit trail

### 3. MCP Layer

Defines safe agent tools:

- summarize status
- draft document request
- validate application packet
- record consent
- append audit event

### 4. CLI Layer

Defines developer and operator commands:

- validate examples
- generate synthetic applicant
- replay synthetic workflow
- inspect audit trail

### 5. Synthetic Harness

Provides synthetic data and synthetic lifecycle events.

This keeps development, tests, and public docs safe and repeatable.

## Data Flow: Synthetic Application Workflow

```text
Synthetic applicant created
      |
      v
Application packet generated
      |
      v
Packet validation
      |
      v
Missing document request created
      |
      v
Applicant-facing status summary generated
      |
      v
Audit events appended
```

## Data Flow: Future Live Implementation

```text
Tenant grants consent
      |
      v
Operator or agent creates application packet
      |
      v
System validates packet
      |
      v
Human reviewer resolves exceptions
      |
      v
Status events emitted
      |
      v
Applicant and operator receive updates
      |
      v
Audit trail persists
```

## Agent Safety Boundary

Agents can:

- read consented data
- summarize application status
- validate schema completeness
- draft document requests
- explain next steps
- prepare review packets

Require approval for:

- submit final applications
- reject documents
- mark eligibility final
- send formal notices
- share data with new parties
- mutate source-of-truth records

## Implementation Pattern

An implementation should expose the same conceptual surface through multiple interfaces:

```text
Core service
  ├── HTTP API
  ├── MCP server
  ├── CLI wrapper
  └── event/audit log
```

This lets humans, conventional software, and AI agents work from the same contract.
