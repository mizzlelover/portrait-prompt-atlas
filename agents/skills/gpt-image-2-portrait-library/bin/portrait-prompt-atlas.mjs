#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const records = JSON.parse(readFileSync(join(root, 'references', 'portrait-records.json'), 'utf8')).records;
const [command = 'help', ...args] = process.argv.slice(2);
const usage = 'Usage: gpt-image-2-portrait-library search --query <words> [--category <value>] [--identity <value>] [--limit <n>]\n       gpt-image-2-portrait-library show <GI2_id>\n       gpt-image-2-portrait-library stats';
const option = (name) => {
  const index = args.indexOf(name);
  return index < 0 ? '' : args[index + 1] || '';
};
const summary = (record) => ({id: record.id, category: record.category, identity_control: record.identity_control, publisher: record.publisher, credited_creator: record.credited_creator, authorship_status: record.authorship_status, source_url: record.source_url, excerpt: record.prompt.replace(/\s+/g, ' ').slice(0, 180)});

if (command === 'search') {
  const query = option('--query').toLowerCase();
  const category = option('--category');
  const identity = option('--identity');
  const limit = Number(option('--limit') || 12);
  const found = records.filter((record) => (!query || `${record.prompt} ${record.publisher || ''}`.toLowerCase().includes(query)) && (!category || record.category === category) && (!identity || record.identity_control === identity)).slice(0, Number.isFinite(limit) ? limit : 12).map(summary);
  console.log(JSON.stringify(found, null, 2));
} else if (command === 'show') {
  const record = records.find((item) => item.id === args[0]);
  if (!record) throw new Error(`Record not found: ${args[0] || '(missing id)'}`);
  console.log(JSON.stringify(record, null, 2));
} else if (command === 'stats') {
  const counts = Object.groupBy(records, (record) => record.category);
  console.log(JSON.stringify(Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, value.length])), null, 2));
} else console.log(usage);
