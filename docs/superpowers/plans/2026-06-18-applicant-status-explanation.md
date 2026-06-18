# Applicant Status Explanation Skill — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a second real AHIK skill — `explainStatus` — that orchestrates `checkCompleteness` and produces a deterministic, audited, human-review-gated plain-language applicant status event.

**Architecture:** `explainStatus(packet, opts)` lives in `lib/skills/status-explanation.mjs`. It calls `checkCompleteness` internally (the completeness skill), maps its result to one of three safe statuses (`draft`/`missing_documents`/`under_review`), builds a validated `statusEvent` object, appends an audit event, and returns `{ result, audit, reviewBoundary }` — the same three-key shape every AHIK skill returns. The MCP `summarize_application_status` tool is upgraded from echo-stub to call this skill. The CLI gets a new `status [file]` command.

**Tech Stack:** Node 22 ESM; `node:crypto` randomUUID; AJV 8 for schema validation; `@modelcontextprotocol/sdk`; `node:test` + `assert/strict`; no new dependencies.

## Global Constraints

- Node 22, ESM (`"type": "module"`), `.mjs` extension for all new files.
- No new npm dependencies.
- All exports named, no default exports (follow `completeness.mjs` pattern).
- TOOLS.length must remain 7 — upgrade `summarize_application_status`, do not add a new tool.
- Status values used by this skill: `draft`, `missing_documents`, `under_review` only — never `eligible`, `ineligible`, `selected`, `qualified`, `approved`, `denied`.
- `human_review_required: true` always in result.
- `reviewBoundary` string must contain both "human" (or "human must review") and "does not determine eligibility".
- Commit message: `feat: real Applicant Status Explanation skill (orchestrates completeness) + CLI + MCP`
- Tests run via `npm test` (`node --test`); target ~25 passing tests (19 baseline + ~6 new).
- Report file: `/Users/zachrabin/Documents/github/interop-kit-publish-play/.git/sdd/skill2-report.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `lib/skills/status-explanation.mjs` | `explainStatus` skill — orchestrates completeness, maps to status, builds statusEvent + audit |
| Modify | `cli/ahik.mjs` | Add `status [file]` command; update help text |
| Modify | `mcp/server.mjs` | Upgrade `summarize_application_status` inputSchema + handleCall case |
| Modify | `mcp/tools.md` | Update `summarize_application_status` entry to reflect real behavior |
| Create | `test/skills-status.test.mjs` | TDD tests for the new skill (6 tests) |
| Modify | `test/mcp.test.mjs` | Update `summarize_application_status` assertion to expect real result shape |

---

### Task 1: Write failing tests for `explainStatus`

**Files:**
- Create: `test/skills-status.test.mjs`

**Interfaces:**
- Consumes: `explainStatus` from `../lib/skills/status-explanation.mjs` (does not exist yet — tests will fail to import)
- Consumes: `generateApplicationPacket` from `../synthetic-data/generate.mjs`
- Consumes: `validate` from `../lib/validate.mjs`

- [ ] **Step 1: Write the failing test file**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { generateApplicationPacket } from "../synthetic-data/generate.mjs";
import { validate } from "../lib/validate.mjs";
import { explainStatus } from "../lib/skills/status-explanation.mjs";

// --- INCOMPLETE packet: only income_verification ---
test("incomplete packet → status===missing_documents, summary lists outstanding docs, human_review_required===true", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification", status: "accepted" },
  ];
  const { result, audit, reviewBoundary } = explainStatus(packet);
  assert.equal(result.statusEvent.status, "missing_documents");
  assert.ok(
    result.summary.includes("identity document"),
    `expected "identity document" in summary; got: ${result.summary}`
  );
  assert.ok(
    result.summary.includes("proof of residence"),
    `expected "proof of residence" in summary; got: ${result.summary}`
  );
  assert.equal(result.human_review_required, true);
  const seCheck = validate("status-event", result.statusEvent);
  assert.equal(seCheck.valid, true, `statusEvent schema invalid: ${JSON.stringify(seCheck.errors)}`);
  const auditCheck = validate("audit-event", audit);
  assert.equal(auditCheck.valid, true, `audit-event schema invalid: ${JSON.stringify(auditCheck.errors)}`);
  assert.equal(audit.action, "explain_application_status");
});

// --- COMPLETE packet: all three required docs present ---
test("complete packet → status===under_review, summary says complete and under review, statusEvent validates", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification",  status: "accepted" },
    { document_id: "d2", document_type: "identity_document",    status: "accepted" },
    { document_id: "d3", document_type: "proof_of_residence",   status: "accepted" },
  ];
  const { result } = explainStatus(packet);
  assert.equal(result.statusEvent.status, "under_review");
  assert.ok(
    result.summary.includes("complete and under review"),
    `expected "complete and under review" in summary; got: ${result.summary}`
  );
  const seCheck = validate("status-event", result.statusEvent);
  assert.equal(seCheck.valid, true, `statusEvent schema invalid: ${JSON.stringify(seCheck.errors)}`);
});

// --- SCHEMA-INVALID packet → draft ---
test("schema-invalid packet → status===draft", () => {
  const packet = generateApplicationPacket();
  delete packet.applicant.full_name; // violates required field
  const { result } = explainStatus(packet);
  assert.equal(result.statusEvent.status, "draft");
});

// --- reviewBoundary compliance ---
test("reviewBoundary contains 'human' and 'does not determine eligibility'", () => {
  const packet = generateApplicationPacket();
  const { reviewBoundary } = explainStatus(packet);
  assert.ok(reviewBoundary.includes("human"), `reviewBoundary was: ${reviewBoundary}`);
  assert.ok(
    reviewBoundary.includes("does not determine eligibility"),
    `reviewBoundary was: ${reviewBoundary}`
  );
});

// --- result.completeness is propagated ---
test("result.completeness mirrors checkCompleteness result shape", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification",  status: "accepted" },
    { document_id: "d2", document_type: "identity_document",    status: "accepted" },
    { document_id: "d3", document_type: "proof_of_residence",   status: "accepted" },
  ];
  const { result } = explainStatus(packet);
  assert.ok("schema_valid" in result.completeness, "completeness.schema_valid missing");
  assert.ok("complete" in result.completeness, "completeness.complete missing");
  assert.ok(Array.isArray(result.completeness.present), "completeness.present not array");
  assert.ok(Array.isArray(result.completeness.outstanding), "completeness.outstanding not array");
});

// --- statusEvent has required fields (event_id, application_id, actor, occurred_at, applicant_summary) ---
test("statusEvent has all required fields and application_id matches packet_id", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification",  status: "accepted" },
    { document_id: "d2", document_type: "identity_document",    status: "accepted" },
    { document_id: "d3", document_type: "proof_of_residence",   status: "accepted" },
  ];
  const { result } = explainStatus(packet);
  const se = result.statusEvent;
  assert.ok(typeof se.event_id === "string" && se.event_id.startsWith("evt_"), `event_id: ${se.event_id}`);
  assert.equal(se.application_id, packet.packet_id);
  assert.ok(typeof se.occurred_at === "string");
  assert.deepEqual(se.actor, { actor_type: "agent", actor_id: "ahik_skill" });
  assert.ok(typeof se.applicant_summary === "string" && se.applicant_summary.length > 0);
});
```

- [ ] **Step 2: Run tests to verify they fail (import error expected)**

```bash
node --test test/skills-status.test.mjs 2>&1 | head -20
```

Expected: `ERR_MODULE_NOT_FOUND` or similar — the file does not exist yet.

---

### Task 2: Implement `lib/skills/status-explanation.mjs`

**Files:**
- Create: `lib/skills/status-explanation.mjs`

**Interfaces:**
- Consumes: `checkCompleteness(packet)` from `./completeness.mjs` → `{ result: { schema_valid, complete, outstanding, present }, audit, reviewBoundary }`
- Consumes: `makeAuditEvent({ actor, action, subject, purpose, privacy_classification })` from `../audit.mjs`
- Consumes: `randomUUID` from `node:crypto`
- Produces: `explainStatus(packet, opts = {}) → { result, audit, reviewBoundary }`
  - `result.statusEvent` — valid against `status-event.schema.json`
  - `result.summary` — string
  - `result.human_review_required` — `true` always
  - `result.completeness` — the `completeness.result` object

- [ ] **Step 1: Write the skill**

```js
/**
 * Skill: Applicant Status Explanation
 *
 * Orchestrates the completeness check and produces a plain-language
 * applicant status event. Fully deterministic, audited, human-review-gated.
 *
 * Does NOT determine eligibility, approve, deny, or qualify applicants.
 * Every output requires human review before applicant-facing delivery.
 */

import { randomUUID } from "node:crypto";
import { checkCompleteness } from "./completeness.mjs";
import { makeAuditEvent } from "../audit.mjs";

/**
 * Humanize a document_type slug: replace underscores with spaces.
 * e.g. "identity_document" → "identity document"
 */
function humanizeType(docType) {
  return docType.replace(/_/g, " ");
}

/**
 * Derive a deterministic status from the completeness result.
 * Only uses statuses safe for this advisory skill:
 *   draft | missing_documents | under_review
 */
function deriveStatus(completeness) {
  if (!completeness.schema_valid) return "draft";
  if (completeness.outstanding.length > 0) return "missing_documents";
  return "under_review";
}

/**
 * Build a plain-language applicant summary. Never says approved/denied/eligible/qualified.
 */
function buildSummary(status, completeness) {
  if (status === "missing_documents") {
    const humanized = completeness.outstanding
      .map((o) => humanizeType(o.document_type))
      .join(", ");
    return `Your application is missing the following: ${humanized}. Please provide these so your application can continue.`;
  }
  if (status === "under_review") {
    return "Your application is complete and under review. No action is needed from you right now.";
  }
  // draft
  return "Your application isn't ready yet — some required information is still needed.";
}

/**
 * Produce a plain-language applicant status DRAFT for human review.
 *
 * @param {object} packet - An application-packet object (may be synthetic or real).
 * @param {object} [opts={}] - Reserved for future options.
 * @returns {{ result: object, audit: object, reviewBoundary: string }}
 *
 * result shape:
 *   statusEvent           {object}  — valid against status-event.schema.json
 *   summary               {string}  — plain-language summary (same as statusEvent.applicant_summary)
 *   human_review_required {true}    — always true; this is a draft only
 *   completeness          {object}  — the completeness.result from checkCompleteness
 *
 * Compliance: statuses limited to draft/missing_documents/under_review.
 * Never implies eligibility, approval, denial, or qualification.
 * Human review is required before any applicant-facing delivery.
 */
export function explainStatus(packet, opts = {}) {
  // 1. Orchestrate completeness check
  const { result: completeness } = checkCompleteness(packet);

  // 2. Derive status deterministically
  const status = deriveStatus(completeness);

  // 3. Build summary
  const applicant_summary = buildSummary(status, completeness);

  // 4. Build statusEvent — valid against status-event.schema.json
  const statusEvent = {
    event_id: `evt_${randomUUID().slice(0, 8)}`,
    application_id: packet?.packet_id ?? "synthetic",
    status,
    occurred_at: new Date().toISOString(),
    actor: { actor_type: "agent", actor_id: "ahik_skill" },
    applicant_summary,
    internal_notes:
      "Synthetic reference output; requires human review before applicant-facing.",
  };

  // 5. Build result
  const result = {
    statusEvent,
    summary: applicant_summary,
    human_review_required: true,
    completeness,
  };

  // 6. Audit event
  const audit = makeAuditEvent({
    actor: { actor_type: "agent", actor_id: "ahik_skill" },
    action: "explain_application_status",
    subject: packet?.packet_id ?? "synthetic",
    purpose: "status_explanation",
    privacy_classification: "internal",
  });

  // 7. Review boundary — hard compliance statement
  const reviewBoundary =
    "applicant-facing draft: a human must review this status before it is sent to the applicant; this skill does not determine eligibility";

  return { result, audit, reviewBoundary };
}
```

- [ ] **Step 2: Run the new skill tests**

```bash
node --test test/skills-status.test.mjs 2>&1
```

Expected: all 6 tests pass.

- [ ] **Step 3: Run the full test suite to confirm no regressions**

```bash
npm test 2>&1
```

Expected: 25 tests, 0 failures.

---

### Task 3: Add `status` command to the CLI

**Files:**
- Modify: `cli/ahik.mjs`

**Interfaces:**
- Consumes: `explainStatus(packet)` from `../lib/skills/status-explanation.mjs`
- Produces: CLI command `node cli/ahik.mjs status [file]`

The `status` command mirrors the existing `completeness` command pattern exactly: optional file arg or `generateApplicationPacket()`, calls the skill, pretty-prints `{ statusEvent, summary, audit, reviewBoundary }`, then prints a one-line human note.

- [ ] **Step 1: Modify `cli/ahik.mjs`**

Add the import at the top (after existing imports):

```js
import { explainStatus } from "../lib/skills/status-explanation.mjs";
```

Add the `status` case in the switch block (after the `completeness` case, before `mcp`):

```js
  case "status": {
    let packet;
    if (arg) {
      try {
        packet = JSON.parse(readFileSync(arg, "utf8"));
      } catch (err) {
        console.error(`Error reading packet file: ${err.message}`);
        process.exit(1);
      }
    } else {
      packet = generateApplicationPacket();
    }
    const output = explainStatus(packet);
    const { result, audit, reviewBoundary } = output;
    console.log(JSON.stringify({ statusEvent: result.statusEvent, summary: result.summary, audit, reviewBoundary }, null, 2));
    console.log(`\nDRAFT STATUS: "${result.statusEvent.status}" — human review required before applicant-facing delivery.`);
    break;
  }
```

Update the help text default case to include `status` and remove it from the "Planned" line:

```js
    console.log(
      [
        "ahik — affordable housing interop kit (reference)",
        "",
        "Commands:",
        "  demo                run a synthetic end-to-end flow (generate -> validate -> status + audit, plus a rejected-packet example)",
        "  completeness [file] check a packet for document completeness (flags outstanding docs for human review; uses synthetic packet if no file given)",
        "  status [file]       explain applicant status as a plain-language draft (human review required before delivery; uses synthetic packet if no file given)",
        "  mcp                 start the reference MCP server (stdio)",
        "",
        "Planned (roadmap): submit, request-docs, review",
      ].join("\n"),
    );
```

- [ ] **Step 2: Smoke-test the CLI**

```bash
node /Users/zachrabin/Documents/github/affordable-housing-interop-kit/cli/ahik.mjs status 2>&1
```

Expected: JSON with `statusEvent`, `summary`, `audit`, `reviewBoundary` fields, then a one-line DRAFT STATUS note.

---

### Task 4: Upgrade MCP `summarize_application_status` tool

**Files:**
- Modify: `mcp/server.mjs`
- Modify: `mcp/tools.md`
- Modify: `test/mcp.test.mjs`

**Interfaces:**
- Consumes: `explainStatus(packet)` from `../lib/skills/status-explanation.mjs`
- The tool's `inputSchema` changes from `{ application_id: string }` to `{ packet: object }`
- `handleCall("summarize_application_status", { packet })` now returns `result = explainStatus(args.packet ?? {}).result`

- [ ] **Step 1: Update `mcp/server.mjs`**

Add import at the top:

```js
import { explainStatus } from "../lib/skills/status-explanation.mjs";
```

Replace the `summarize_application_status` tool definition in TOOLS array (change inputSchema and description):

Old:
```js
  {
    name: "summarize_application_status",
    description: "Produce an applicant-friendly status summary for a synthetic application.",
    inputSchema: { type: "object", properties: { application_id: { type: "string" } }, required: ["application_id"] },
  },
```

New:
```js
  {
    name: "summarize_application_status",
    description:
      "Produce an applicant-facing status DRAFT for a synthetic application packet. " +
      "Orchestrates completeness check and maps result to a status event. " +
      "Requires human review before applicant delivery. " +
      "Does NOT determine eligibility, approve, deny, or qualify applicants.",
    inputSchema: { type: "object", properties: { packet: { type: "object" } }, required: ["packet"] },
  },
```

Replace the `summarize_application_status` case in `handleCall`:

Old:
```js
    case "summarize_application_status":
      result = { application_id: args.application_id, applicant_summary: "Your application is under review." };
      break;
```

New:
```js
    case "summarize_application_status":
      result = explainStatus(args.packet ?? {}).result;
      break;
```

- [ ] **Step 2: Update `mcp/tools.md`**

Replace the `summarize_application_status` section with:

```md
## Tool: `summarize_application_status`

Purpose: produce an applicant-facing status DRAFT by orchestrating a completeness check and mapping the result to a plain-language status event.

Risk: medium — applicant-facing draft; must not be sent to applicants without human review.

Requires human approval: yes, always before applicant delivery.

Does NOT determine eligibility, approve, deny, or qualify applicants.

Side effects: draft only.

Input:

- application packet (full packet object)

Output:

- statusEvent (validated against status-event schema; status is one of: draft, missing_documents, under_review)
- summary (plain-language string)
- human_review_required (always true)
- completeness (completeness check result)
```

- [ ] **Step 3: Update `test/mcp.test.mjs`** to add a real assertion for `summarize_application_status`

Add a new test after the existing `check_application_packet_completeness` test:

```js
test("summarize_application_status tool returns a real statusEvent with human_review_required===true", () => {
  const packet = generateApplicationPacket();
  packet.documents = [
    { document_id: "d1", document_type: "income_verification",  status: "accepted" },
    { document_id: "d2", document_type: "identity_document",    status: "accepted" },
    { document_id: "d3", document_type: "proof_of_residence",   status: "accepted" },
  ];
  const { result } = handleCall("summarize_application_status", { packet });
  assert.ok(result.statusEvent, "expected result.statusEvent");
  assert.equal(result.human_review_required, true);
  assert.equal(result.statusEvent.status, "under_review");
  assert.ok(typeof result.summary === "string" && result.summary.length > 0);
});
```

- [ ] **Step 4: Run full test suite**

```bash
npm test 2>&1
```

Expected: ~26 tests, 0 failures (19 baseline + 6 skills-status + 1 new mcp).

---

### Task 5: Write report and commit

**Files:**
- Create: `/Users/zachrabin/Documents/github/interop-kit-publish-play/.git/sdd/skill2-report.md`

- [ ] **Step 1: Run `npm test` one final time and capture output**

```bash
npm test 2>&1
```

- [ ] **Step 2: Verify CLI smoke-test**

```bash
node /Users/zachrabin/Documents/github/affordable-housing-interop-kit/cli/ahik.mjs status 2>&1
```

- [ ] **Step 3: Write the report** to `/Users/zachrabin/Documents/github/interop-kit-publish-play/.git/sdd/skill2-report.md`

- [ ] **Step 4: Commit**

```bash
cd /Users/zachrabin/Documents/github/affordable-housing-interop-kit && \
git add lib/skills/status-explanation.mjs cli/ahik.mjs mcp/server.mjs mcp/tools.md test/skills-status.test.mjs test/mcp.test.mjs docs/superpowers/plans/2026-06-18-applicant-status-explanation.md && \
git commit -m "feat: real Applicant Status Explanation skill (orchestrates completeness) + CLI + MCP"
```

---

## Self-Review

**Spec coverage:**
- ✅ `lib/skills/status-explanation.mjs` — `explainStatus` with `{ result, audit, reviewBoundary }` shape
- ✅ Orchestrates `checkCompleteness`
- ✅ Three-way deterministic status derivation (draft / missing_documents / under_review)
- ✅ `applicant_summary` templates for all three statuses with `_` → ` ` humanization
- ✅ `statusEvent` with all required fields (event_id, application_id, status, occurred_at, actor, applicant_summary)
- ✅ `event_id = "evt_" + randomUUID().slice(0,8)`, `actor.actor_id = "ahik_skill"`
- ✅ `result.human_review_required = true` always
- ✅ `result.completeness` propagated
- ✅ `internal_notes` in statusEvent
- ✅ `audit.action = "explain_application_status"`
- ✅ `reviewBoundary` contains "human must review" and "does not determine eligibility"
- ✅ CLI `status [file]` command added + help updated
- ✅ MCP `summarize_application_status` upgraded (inputSchema + handleCall); TOOLS.length stays 7
- ✅ `mcp/tools.md` updated
- ✅ `test/skills-status.test.mjs` — 6 tests covering: incomplete→missing_documents (with "identity document"+"proof of residence" in summary), complete→under_review, invalid→draft, reviewBoundary, completeness propagation, required statusEvent fields
- ✅ `test/mcp.test.mjs` — new test for `summarize_application_status` real result shape

**Placeholder scan:** No TBDs, TODOs, or "similar to" references. All code blocks are complete.

**Type consistency:**
- `explainStatus` returns `{ result, audit, reviewBoundary }` — matches completeness.mjs shape
- `result.completeness` = `checkCompleteness(packet).result` (the inner result, not the outer)
- `result.statusEvent.status` enum values match `status-event.schema.json` enum
- `audit` from `makeAuditEvent` — matches audit-event schema (has `audit_id`, `source_system`, etc.)
