import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const records = readFileSync(join(root, 'data', 'prompts.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const rawRecords = readFileSync(join(root, 'data', 'raw-prompts.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const audit = JSON.parse(readFileSync(join(root, 'data', 'curation-audit.json'), 'utf8'));
const index = JSON.parse(readFileSync(join(root, 'agents', 'skills', 'gpt-image-2-portrait-library', 'references', 'portrait-records.json'), 'utf8')).records;
const catalog = JSON.parse(readFileSync(join(root, 'site', 'catalog.json'), 'utf8'));
const digest = (value) => createHash('sha256').update(value).digest('hex');
const normalizedPrompt = (value) => value.replace(/^\s*title\s*:[\s\S]*?\bprompt\s*:\s*/i, '').toLowerCase().replace(/^\s*(?:title|prompt)\s*:\s*/gim, '').replace(/\{argument name="[^"]+" default="([^"]*)"\}/g, '$1').replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
const fail = (message) => { throw new Error(message); };
const routingFixtures = {
  GI2_07603: 'restoration_and_preservation',
  GI2_01583: 'restoration_and_preservation',
  GI2_09196: 'identity_locked_style_transfer',
  GI2_17367: 'creative_portrait_scene',
  GI2_00922: 'editorial_fashion_portrait',
  GI2_02891: 'identity_locked_style_transfer'
};
const excludedFixtures = ['GI2_10566', 'GI2_02060', 'GI2_05132', 'GI2_21154', 'GI2_18149', 'GI2_21655', 'GI2_03174', 'GI2_17268', 'GI2_17722', 'GI2_06037', 'GI2_10475', 'GI2_07647', 'GI2_21048', 'GI2_10199', 'GI2_04955'];
const duplicateFixtures = [['GI2_02490', 'GI2_17521'], ['GI2_01313', 'GI2_01317']];

if (rawRecords.length !== 728 || records.length !== audit.published_records || index.length !== records.length || catalog.length !== records.length) fail('Record counts are not synchronized.');
if (new Set(records.map((record) => record.id)).size !== records.length) fail('Source record IDs are not unique.');
if (new Set(records.map((record) => normalizedPrompt(record.prompt_text))).size !== records.length) fail('Exact normalized prompt duplicates remain.');
const imageDigests = records.map((record) => digest(readFileSync(join(root, record.image.local_path))));
if (new Set(imageDigests).size !== imageDigests.length) fail('Identical result images remain.');
if (audit.version !== 'portrait-curation-v4' || !Array.isArray(audit.duplicate_clusters) || !audit.secondary_category_counts) fail('Curation audit is incomplete.');
for (const record of records) {
  const generated = index.find((item) => item.id === record.id);
  const siteRecord = catalog.find((item) => item.id === record.id);
  if (!generated || !siteRecord) fail(`Missing generated record: ${record.id}`);
  const raw = rawRecords.find((item) => item.id === record.id);
  if (!raw || generated.prompt_sha256 !== digest(raw.prompt_text) || siteRecord.prompt !== raw.prompt_text) fail(`Prompt language/text drift: ${record.id}`);
  if (!generated.source_url?.startsWith('https://x.com/')) fail(`Missing X source: ${record.id}`);
  if (!record.curation?.primary_category || !record.curation?.secondary_category || !record.curation?.classification_basis || !record.curation?.framing || record.curation.duplicate_status !== 'canonical') fail(`Missing curation decision: ${record.id}`);
  if (generated.sub_category !== record.curation.secondary_category || siteRecord.sub_category !== record.curation.secondary_category) fail(`Secondary category drift: ${record.id}`);
}
for (const id of excludedFixtures) if (records.some((record) => record.id === id)) fail(`Non-human output regression: ${id}`);
for (const pair of duplicateFixtures) if (pair.filter((id) => records.some((record) => record.id === id)).length !== 1) fail(`Duplicate regression: ${pair.join(', ')}`);
for (const cluster of audit.duplicate_clusters) if (!cluster.reasons?.length) fail(`Duplicate audit reason missing: ${cluster.canonical_id}`);
for (const [id, category] of Object.entries(routingFixtures)) {
  if (records.find((record) => record.id === id)?.curation.primary_category !== category) fail(`Classification regression: ${id}`);
}
for (const file of ['SKILL.md', 'references/portrait-library.md', 'references/portrait-records.json', 'bin/portrait-prompt-atlas.mjs', 'package.json']) {
  if (!existsSync(join(root, 'agents', 'skills', 'gpt-image-2-portrait-library', file))) fail(`Skill package missing ${file}.`);
}
console.log(`Verified ${records.length} curated records against ${rawRecords.length} raw records, original prompt integrity, source links, and Skill package files.`);
