import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { setSeed, generateApplicationPacket } from "../synthetic-data/generate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "..", "synthetic-data", "fixtures");

test("fixtures directory contains exactly 3 .json files", () => {
  const files = readdirSync(fixturesDir).filter((f) => f.endsWith(".json"));
  assert.equal(files.length, 3, `Expected 3 fixture files, found ${files.length}: ${files.join(", ")}`);
});

test("committed fixtures match deterministic regeneration from setSeed(42)", () => {
  setSeed(42);
  const packets = [
    generateApplicationPacket(),
    generateApplicationPacket(),
    generateApplicationPacket(),
  ];

  for (const packet of packets) {
    const fixturePath = join(fixturesDir, `${packet.packet_id}.json`);
    const committed = JSON.parse(readFileSync(fixturePath, "utf8"));
    assert.deepEqual(
      committed,
      packet,
      `Fixture ${packet.packet_id}.json has drifted from the generator output`
    );
  }
});
