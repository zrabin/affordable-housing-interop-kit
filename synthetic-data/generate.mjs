import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FIRST = ["Avery", "Jordan", "Riley", "Casey", "Morgan", "Taylor", "Quinn", "Reese", "Sasha", "Devon"];
const LAST = ["Nguyen", "Okafor", "Santos", "Cohen", "Patel", "Romero", "Kim", "Diallo", "Haddad", "Walsh"];
const CONTACT = ["email", "phone", "sms", "mail", "portal"];
const LANG = ["en", "es", "zh", "ht", "bn"];
const PROGRAMS = ["lihtc", "project_based_voucher", "mitchell_lama", "supportive_housing", "hdfc"];
const UNIT = ["studio", "1br", "2br", "3br"];

// Seedable RNG. Unseeded: Math.random + random UUIDs + real clock (fresh each run).
// Seeded: mulberry32 + counter ids + fixed clock (fully reproducible).
let rng = Math.random;
let seq = 0;
let clock = null;

export function setSeed(seed) {
  let a = seed >>> 0;
  rng = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  seq = 0;
  clock = Date.parse("2026-01-01T00:00:00Z");
}

const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const sid = (prefix) =>
  clock === null ? `${prefix}_${randomUUID().slice(0, 8)}` : `${prefix}_${(seq++).toString(36).padStart(6, "0")}`;
const nowIso = () => (clock === null ? new Date().toISOString() : new Date(clock).toISOString());

export function generatePersona() {
  return {
    applicant_id: sid("app"),
    full_name: `${pick(FIRST)} ${pick(LAST)}`,
    preferred_contact_method: pick(CONTACT),
    language_preference: pick(LANG),
  };
}

export function generateApplicationPacket() {
  const createdAt = nowIso();
  const memberCount = 1 + Math.floor(rng() * 3);
  const members = Array.from({ length: memberCount }, (_, i) => ({
    member_id: sid("mem"),
    relationship: i === 0 ? "self" : pick(["spouse", "child", "parent", "other"]),
    age_band: i === 0 ? "adult" : pick(["minor", "adult", "senior"]),
  }));

  return {
    packet_id: sid("pkt"),
    created_at: createdAt,
    applicant: generatePersona(),
    household: {
      household_id: sid("hh"),
      members,
      income_sources: [{
        source_id: sid("inc"),
        source_type: pick(["employment", "benefits", "self_employment", "pension", "other"]),
        annualized_amount: 20000 + Math.floor(rng() * 60000),
      }],
    },
    opportunity: {
      opportunity_id: sid("opp"),
      program_type: pick(PROGRAMS),
      unit_size: pick(UNIT),
    },
    consent_grants: [{
      grant_id: sid("grant"),
      grantee: "reference-housing-operator",
      purpose: "eligibility_review",
      granted_at: createdAt,
    }],
    documents: [{
      document_id: sid("doc"),
      document_type: "income_verification",
      status: pick(["provided", "missing", "pending_review"]),
    }],
  };
}

// Direct run: `node generate.mjs [count] [--seed N] [--out DIR]`
// Default → synthetic-data/out/ (gitignored). `--seed N --out fixtures` → committed golden fixtures.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const seedArg = args.includes("--seed") ? Number(args[args.indexOf("--seed") + 1]) : null;
  const outArg = args.includes("--out") ? args[args.indexOf("--out") + 1] : "out";
  const count = Number(args.find((a) => /^\d+$/.test(a)) ?? 3);
  if (seedArg !== null) setSeed(seedArg);
  const baseDir = dirname(fileURLToPath(import.meta.url));
  const outDir = join(baseDir, outArg);
  mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < count; i += 1) {
    const packet = generateApplicationPacket();
    writeFileSync(join(outDir, `${packet.packet_id}.json`), JSON.stringify(packet, null, 2));
    console.log(`wrote synthetic-data/${outArg}/${packet.packet_id}.json`);
  }
}
