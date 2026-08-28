import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const records = readFileSync(join(root, 'data', 'prompts.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const index = JSON.parse(readFileSync(join(root, 'agents', 'skills', 'gpt-image-2-portrait-library', 'references', 'portrait-records.json'), 'utf8')).records;
const catalog = JSON.parse(readFileSync(join(root, 'site', 'catalog.json'), 'utf8'));
const digest = (value) => createHash('sha256').update(value).digest('hex');
const fail = (message) => { throw new Error(message); };

if (records.length !== 728 || index.length !== records.length || catalog.length !== records.length) fail('Record counts are not synchronized.');
if (new Set(records.map((record) => record.id)).size !== records.length) fail('Source record IDs are not unique.');
for (const record of records) {
  const generated = index.find((item) => item.id === record.id);
  const siteRecord = catalog.find((item) => item.id === record.id);
  if (!generated || !siteRecord) fail(`Missing generated record: ${record.id}`);
  if (generated.prompt_sha256 !== digest(record.prompt_text) || siteRecord.prompt !== record.prompt_text) fail(`Prompt language/text drift: ${record.id}`);
  if (!generated.source_url?.startsWith('https://x.com/')) fail(`Missing X source: ${record.id}`);
}
for (const file of ['SKILL.md', 'references/portrait-library.md', 'references/portrait-records.json', 'bin/portrait-prompt-atlas.mjs', 'package.json']) {
  if (!existsSync(join(root, 'agents', 'skills', 'gpt-image-2-portrait-library', file))) fail(`Skill package missing ${file}.`);
}
console.log(`Verified ${records.length} records, original prompt integrity, source links, and Skill package files.`);
