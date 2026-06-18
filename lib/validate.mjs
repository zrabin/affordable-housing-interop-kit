import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const here = dirname(fileURLToPath(import.meta.url));
const schemasDir = join(here, "..", "schemas");

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const validators = new Map();
for (const file of readdirSync(schemasDir)) {
  if (!file.endsWith(".schema.json")) continue;
  const name = file.replace(".schema.json", "");
  const schema = JSON.parse(readFileSync(join(schemasDir, file), "utf8"));
  validators.set(name, ajv.compile(schema));
}

export function schemaNames() {
  return [...validators.keys()];
}

export function validate(name, data) {
  const fn = validators.get(name);
  if (!fn) throw new Error(`Unknown schema: ${name}`);
  const valid = fn(data);
  return { valid, errors: valid ? [] : (fn.errors ?? []) };
}
