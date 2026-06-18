# Implementation Plan

## Goal

Maintain a production-grade public reference implementation for interoperable affordable housing application workflows.

The implementation plan focuses on the shared interface surface: schemas, API shapes, MCP tools, civic skills, CLI commands, synthetic data, privacy boundaries, and audit behavior.

## Phase 1: Reference Surface

Define the stable public objects and actions.

Deliverables:

- application packet schema
- document request schema
- status event schema
- audit event schema
- consent grant model
- OpenAPI v1
- MCP tool definitions
- CLI command surface
- civic skill catalog

## Phase 2: Synthetic Workflow Harness

Make the reference surface testable without sensitive data.

Deliverables:

- synthetic applicant household
- synthetic application packet
- synthetic document request
- synthetic status event
- synthetic audit trail
- JSON validation workflow
- repeatable CLI workflow

## Phase 3: Safety And Governance

Define the boundaries that make agent-ready workflows reviewable.

Deliverables:

- privacy classification guidance
- human-review boundaries
- approval requirements for high-risk actions
- audit event requirements
- contribution guidelines
- governance process

## Phase 4: Implementation Guides

Help independent systems adopt the interface consistently.

Deliverables:

- architecture guide
- agent workflow guide
- skill implementation guide
- API/MCP/CLI examples
- conformance checklist

## Release Criteria

The reference implementation is ready for public use when:

- examples validate against schemas
- docs are understandable without private context
- no real applicant data is present
- no implementation-specific vendor assumptions are present
- high-risk agent actions require human review
- synthetic workflows are repeatable
- public language is neutral, direct, and implementation-oriented
