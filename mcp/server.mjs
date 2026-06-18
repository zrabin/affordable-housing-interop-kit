import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "node:crypto";
import { validate } from "../lib/validate.mjs";
import { makeAuditEvent } from "../lib/audit.mjs";

export const TOOLS = [
  {
    name: "validate_application_packet",
    description: "Validate a synthetic application packet against the reference schema.",
    inputSchema: { type: "object", properties: { packet: { type: "object" } }, required: ["packet"] },
  },
  {
    name: "create_document_request_draft",
    description: "Draft a document request for a synthetic application (human review required).",
    inputSchema: {
      type: "object",
      properties: { application_id: { type: "string" }, document_type: { type: "string" } },
      required: ["application_id", "document_type"],
    },
  },
  {
    name: "summarize_application_status",
    description: "Produce an applicant-friendly status summary for a synthetic application.",
    inputSchema: { type: "object", properties: { application_id: { type: "string" } }, required: ["application_id"] },
  },
  {
    name: "record_consent_grant",
    description: "Record a synthetic consent grant.",
    inputSchema: {
      type: "object",
      properties: { grantee: { type: "string" }, purpose: { type: "string" } },
      required: ["grantee", "purpose"],
    },
  },
  {
    name: "append_audit_event",
    description: "Append a synthetic audit event for a completed action.",
    inputSchema: {
      type: "object",
      properties: { action: { type: "string" }, subject: { type: "string" } },
      required: ["action", "subject"],
    },
  },
  {
    name: "generate_notice_draft",
    description: "Draft a synthetic applicant-facing notice (human review required).",
    inputSchema: {
      type: "object",
      properties: { application_id: { type: "string" }, kind: { type: "string" } },
      required: ["application_id"],
    },
  },
];

export function handleCall(name, args = {}) {
  const actor = { actor_type: "agent", actor_id: "ahik_mcp" };
  const subject = args.application_id ?? args.subject ?? args.grantee ?? "synthetic";
  const audit = makeAuditEvent({ actor, action: name, subject, purpose: "reference_demo" });

  let result;
  switch (name) {
    case "validate_application_packet":
      result = validate("application-packet", args.packet ?? {});
      break;
    case "create_document_request_draft":
      result = {
        request_id: `req_${randomUUID().slice(0, 8)}`,
        application_id: args.application_id,
        document_type: args.document_type,
        applicant_message: "Please upload the requested document so review can continue.",
        human_review_required: true,
      };
      break;
    case "summarize_application_status":
      result = { application_id: args.application_id, applicant_summary: "Your application is under review." };
      break;
    case "record_consent_grant":
      result = { grant_id: `grant_${randomUUID().slice(0, 8)}`, grantee: args.grantee, purpose: args.purpose };
      break;
    case "append_audit_event":
      result = makeAuditEvent({ actor, action: args.action, subject: args.subject, purpose: "reference_demo" });
      break;
    case "generate_notice_draft":
      result = { application_id: args.application_id, kind: args.kind ?? "status_update", human_review_required: true };
      break;
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
  return { result, audit };
}

export function createServer() {
  const server = new Server({ name: "ahik", version: "1.0.0" }, { capabilities: { tools: {} } });
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args } = req.params;
    const payload = handleCall(name, args ?? {});
    return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
  });
  return server;
}

export async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ahik MCP server running on stdio");
}
