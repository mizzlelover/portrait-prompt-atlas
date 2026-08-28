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
const fail = (message) => { throw new Error(message); };

if (rawRecords.length !== 728 || records.length !== audit.published_records || index.length !== records.length || catalog.length !== records.length) fail('Record counts are not synchronized.');
if (new Set(records.map((record) => record.id)).size !== records.length) fail('Source record IDs are not unique.');
if (audit.version !== 'portrait-curation-v3' || !Array.isArray(audit.duplicate_clusters) || !audit.secondary_category_counts) fail('Curation audit is incomplete.');
for (const record of records) {
  const generated = index.find((item) => item.id === record.id);
  const siteRecord = catalog.find((item) => item.id === record.id);
  if (!generated || !siteRecord) fail(`Missing generated record: ${record.id}`);
  const raw = rawRecords.find((item) => item.id === record.id);
  if (!raw || generated.prompt_sha256 !== digest(raw.prompt_text) || siteRecord.prompt !== raw.prompt_text) fail(`Prompt language/text drift: ${record.id}`);
  if (!generated.source_url?.startsWith('https://x.com/')) fail(`Missing X source: ${record.id}`);
  if (!record.curation?.primary_category || !record.curation?.secondary_category || !record.curation?.framing || record.curation.duplicate_status !== 'canonical') fail(`Missing curation decision: ${record.id}`);
  if (generated.sub_category !== record.curation.secondary_category || siteRecord.sub_category !== record.curation.secondary_category) fail(`Secondary category drift: ${record.id}`);
}
for (const file of ['SKILL.md', 'references/portrait-library.md', 'references/portrait-records.json', 'bin/portrait-prompt-atlas.mjs', 'package.json']) {
  if (!existsSync(join(root, 'agents', 'skills', 'gpt-image-2-portrait-library', file))) fail(`Skill package missing ${file}.`);
}
console.log(`Verified ${records.length} curated records against ${rawRecords.length} raw records, original prompt integrity, source links, and Skill package files.`);
