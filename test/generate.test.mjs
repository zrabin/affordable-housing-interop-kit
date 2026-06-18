import { test } from "node:test";
import assert from "node:assert/strict";
import { generateApplicationPacket, setSeed } from "../synthetic-data/generate.mjs";
import { validate } from "../lib/validate.mjs";

test("generated packet validates against the schema", () => {
  const packet = generateApplicationPacket();
  const { valid, errors } = validate("application-packet", packet);
  assert.equal(valid, true, JSON.stringify(errors));
});

test("unseeded runs produce fresh packets", () => {
  const a = generateApplicationPacket();
  const b = generateApplicationPacket();
  assert.notEqual(a.packet_id, b.packet_id);
});

test("same seed reproduces an identical packet", () => {
  setSeed(42);
  const a = generateApplicationPacket();
  setSeed(42);
  const b = generateApplicationPacket();
  assert.deepEqual(a, b);
});
