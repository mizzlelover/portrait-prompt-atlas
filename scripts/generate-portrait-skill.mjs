import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, 'agents', 'skills', 'gpt-image-2-portrait-library', 'references');
const library = JSON.parse(readFileSync(join(root, 'data', 'portrait-library.json'), 'utf8'));
const records = readFileSync(join(root, 'data', 'prompts.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const restorationResearch = readFileSync(join(root, 'data', 'restoration-prompt-research.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));

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

function researchSubCategory(record) {
  if (record.scope === 'old_photo_colorization') return 'black_white_colorization';
  if (record.scope === 'research_taxonomy') return 'methodology_reference';
  if (record.scope === 'portrait_enhancement_adjacent' || record.scope === 'restoration_adjacent') return 'restoration_adjacent_research';
  if (record.scope === 'paid_prompt_lead' || record.scope === 'gpt_image_2_lead' || record.scope === 'prompt_lead') return 'research_lead';
  if (record.near_duplicate_cluster?.includes('severe') || record.task_tags?.some((tag) => ['severe_damage', 'missing_corner', 'tear_repair'].includes(tag))) return 'severe_damage_reconstruction';
  if (record.task_tags?.some((tag) => ['deblur', 'low_resolution', 'compression_repair'].includes(tag))) return 'low_resolution_rescue';
  if (record.prompt_text_status === 'structure_only') return 'restoration_workflow_research';
  return 'historic_and_damaged_photo';
}

function toResearchRecord(record) {
  const prompt = record.prompt_excerpt || (record.prompt_text_status === 'lead_only' ? '仅保留来源线索，原文未复制。' : '仅保留方法论摘要，非完整提示词。');
  return {
    id: record.id,
    kind: 'research',
    prompt,
    category: 'restoration_and_preservation',
    sub_category: researchSubCategory(record),
    framing: 'unspecified',
    identity: record.task_tags?.includes('identity_preservation') ? 'explicit' : 'none',
    publisher: record.publisher || null,
    creator: record.author_or_credit || null,
    authorship: record.authorship_status,
    source: record.source_url,
    image: null,
    scope: record.scope,
    prompt_text_status: record.prompt_text_status,
    rights_status: record.rights_status,
    source_title: record.source_title,
    quality_note: record.quality_note || null
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
writeFileSync(join(root, 'site', 'research-catalog.json'), JSON.stringify(restorationResearch.map(toResearchRecord)));
console.log(`Generated ${index.length} curated portrait records and ${restorationResearch.length} restoration research records.`);
