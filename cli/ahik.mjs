#!/usr/bin/env node
import { runDemo } from "../lib/demo.mjs";

const [cmd] = process.argv.slice(2);

switch (cmd) {
  case "demo": {
    const artifacts = runDemo();
    console.log(JSON.stringify(artifacts, null, 2));
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
        "  demo   run a synthetic end-to-end flow (generate -> validate -> status + audit, plus a rejected-packet example)",
        "  mcp    start the reference MCP server (stdio)",
        "",
        "Planned (roadmap): submit, status, request-docs, review",
      ].join("\n"),
    );
}
