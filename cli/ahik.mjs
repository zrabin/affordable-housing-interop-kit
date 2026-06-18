#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runDemo } from "../lib/demo.mjs";
import { generateApplicationPacket } from "../synthetic-data/generate.mjs";
import { checkCompleteness } from "../lib/skills/completeness.mjs";

const [cmd, arg] = process.argv.slice(2);

switch (cmd) {
  case "demo": {
    const artifacts = runDemo();
    console.log(JSON.stringify(artifacts, null, 2));
    break;
  }
  case "completeness": {
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
    const output = checkCompleteness(packet);
    console.log(JSON.stringify(output, null, 2));

    // One-line human summary
    const { result } = output;
    if (result.complete) {
      console.log(`\ncomplete: true — all ${result.present.length} required documents present`);
    } else {
      const items = result.outstanding.map((o) => `${o.document_type} (${o.reason})`).join(", ");
      console.log(`\ncomplete: false — ${result.outstanding.length} outstanding: ${items}`);
    }
    break;
  }
  case "mcp": {
    let mod;
    try {
      mod = await import("../mcp/server.mjs");
    } catch {
      console.error("The MCP server is not available in this build.");
      process.exit(1);
    }
    await mod.main();
    break;
  }
  default:
    console.log(
      [
        "ahik — affordable housing interop kit (reference)",
        "",
        "Commands:",
        "  demo                run a synthetic end-to-end flow (generate -> validate -> status + audit, plus a rejected-packet example)",
        "  completeness [file] check a packet for document completeness (flags outstanding docs for human review; uses synthetic packet if no file given)",
        "  mcp                 start the reference MCP server (stdio)",
        "",
        "Planned (roadmap): submit, status, request-docs, review",
      ].join("\n"),
    );
}
