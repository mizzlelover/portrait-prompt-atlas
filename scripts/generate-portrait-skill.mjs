import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, 'agents', 'skills', 'gpt-image-2-portrait-library', 'references');
const library = JSON.parse(readFileSync(join(root, 'data', 'portrait-library.json'), 'utf8'));
const records = readFileSync(join(root, 'data', 'prompts.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));

const digest = (value) => createHash('sha256').update(value).digest('hex');
const label = (value, language) => value[language] || value.en;
const categoryByValue = new Map(library.categories.map((category) => [category.value, category]));

function toRecord(record) {
  const source = record.source || {};
  const analysis = record.analysis || {};
  return {
    id: record.id,
    prompt: record.prompt_text,
    prompt_sha256: digest(record.prompt_text),
    category: record.curation?.primary_category || analysis.task_family,
    sub_category: record.curation?.secondary_category || 'uncategorized',
    framing: record.curation?.framing || 'unspecified',
    tags: record.curation?.tags || [],
    identity_control: analysis.identity_lock || 'none',
    naturalness_control: analysis.naturalness_control || 'unspecified',
    risk_flags: analysis.risk_flags || [],
    publisher: source.publisher_handle || null,
    credited_creator: source.credited_creator_handle || null,
    authorship_status: source.authorship_status || 'source_not_verifiable',
    source_url: source.x_post_url || null,
    posted_at_utc: source.posted_at_utc || null,
    image: record.image?.local_path || null
  };
}

function renderReference(index) {
  const lines = [
    '# Portrait Prompt Atlas Reference',
    '',
    'Generated from `data/prompts.jsonl` and `data/portrait-library.json`. This reference and `portrait-records.json` are copied with the Skill so Claude Code and Codex use the same library as the website.',
    '',
    '## Categories',
    ''
  ];
  for (const category of library.categories) {
    const records = index.filter((record) => record.category === category.value);
    const count = records.length;
    lines.push(`### ${label(category.title, 'zh')} / ${label(category.title, 'en')}`);
    lines.push(`- Value: \`${category.value}\``);
    lines.push(`- Records: ${count}`);
    lines.push(`- Keywords: ${category.keywords.join(', ')}`);
    for (const [subCategory, subRecords] of Object.entries(Object.groupBy(records, (record) => record.sub_category))) lines.push(`  - ${subCategory}: ${subRecords.length}`);
    lines.push('');
  }
  lines.push('## Selection rules', '');
  for (const rule of library.selection_rules) lines.push(`- ${rule.zh} / ${rule.en}`);
  lines.push('', '## Command-line lookup', '', '```bash', 'node bin/portrait-prompt-atlas.mjs search --query "老照片" --category restoration_and_preservation', 'node bin/portrait-prompt-atlas.mjs show GI2_00000', '```', '');
  return `${lines.join('\n')}\n`;
}

const index = records.map(toRecord);
if (new Set(index.map((record) => record.id)).size !== index.length) throw new Error('Duplicate record IDs in source corpus.');
if (index.some((record) => !categoryByValue.has(record.category))) throw new Error('A record has an unknown category.');
if (index.some((record) => !record.prompt || !record.source_url)) throw new Error('A record is missing a prompt or source URL.');

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'portrait-records.json'), `${JSON.stringify({schema_version: library.schema_version, generated_from: 'data/prompts.jsonl', records: index})}\n`);
writeFileSync(join(outputDir, 'portrait-library.md'), renderReference(index));
writeFileSync(join(root, 'site', 'catalog.json'), JSON.stringify(index.map((record) => ({id: record.id, prompt: record.prompt, category: record.category, sub_category: record.sub_category, framing: record.framing, identity: record.identity_control, publisher: record.publisher, creator: record.credited_creator, authorship: record.authorship_status, source: record.source_url, image: record.image}))));
console.log(`Generated ${index.length} portrait records for the website and agent Skill.`);
