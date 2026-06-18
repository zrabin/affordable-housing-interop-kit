import { readFileSync } from "node:fs";
import { join } from "node:path";
import { validate } from "../lib/validate.mjs";

const exampleToSchema = {
  "application-packet.example.json": "application-packet",
  "document-request.example.json": "document-request",
  "status-event.example.json": "status-event",
};

let failures = 0;
for (const [file, schema] of Object.entries(exampleToSchema)) {
  const data = JSON.parse(readFileSync(join("examples", file), "utf8"));
  const { valid, errors } = validate(schema, data);
  if (valid) {
    console.log(`ok examples/${file} -> ${schema}`);
  } else {
    failures += 1;
    console.error(`fail examples/${file}: ${JSON.stringify(errors)}`);
  }
}
if (failures > 0) process.exit(1);
