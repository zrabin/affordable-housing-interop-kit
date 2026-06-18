import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const roots = ["schemas", "examples"];
let failures = 0;

for (const root of roots) {
  for (const file of readdirSync(root)) {
    if (!file.endsWith(".json")) continue;
    const path = join(root, file);
    try {
      JSON.parse(readFileSync(path, "utf8"));
      console.log(`ok ${path}`);
    } catch (error) {
      failures += 1;
      console.error(`fail ${path}: ${error.message}`);
    }
  }
}

if (failures > 0) {
  process.exit(1);
}

