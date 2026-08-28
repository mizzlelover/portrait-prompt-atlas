import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const recordsFile = join(root, 'data', 'prompts.jsonl');
const showcaseFile = join(root, 'docs', 'showcase.md');
const casesDir = join(root, 'docs', 'cases');

const cases = [
  { id: 'GI2_01583', zh: '老照片与破损修复', en: 'Historic & damaged photo' },
  { id: 'GI2_04109', zh: '自拍、脸部与近景精修', en: 'Selfie, face & close-up polish' },
  { id: 'GI2_01089', zh: '商务头像与职业主页照', en: 'Business headshot & profile' },
  { id: 'GI2_21669', zh: '日常与社交人像', en: 'Daily & social portrait' },
  { id: 'GI2_21354', zh: '棚拍美妆与近景肖像', en: 'Beauty studio & close-up' },
  { id: 'GI2_21341', zh: '插画、素描与动漫转换', en: 'Illustration, sketch & anime' },
  { id: 'GI2_00893', zh: '创意合成与人物海报', en: 'Creative composite & portrait poster' },
  { id: 'GI2_21082', zh: '电影感与奇幻场景肖像', en: 'Cinematic & fantasy scene' }
];

const categoryLabels = {
  restoration_and_preservation: ['修复与影像保全', 'Restoration & preservation'],
  natural_retouch_and_beauty: ['自然精修与美化', 'Natural retouch & beauty'],
  professional_headshot_and_brand: ['职业头像与形象', 'Professional headshot & brand'],
  lifestyle_and_travel_portrait: ['生活方式与旅行人像', 'Lifestyle & travel portrait'],
  editorial_fashion_portrait: ['时尚与编辑肖像', 'Editorial & fashion portrait'],
  identity_locked_style_transfer: ['身份锁定风格转换', 'Identity-locked style transfer'],
  memory_family_and_relationship: ['纪念、家庭与关系影像', 'Memory, family & relationship'],
  creative_portrait_scene: ['创意肖像与场景表达', 'Creative portrait & scene']
};

const rows = readFileSync(recordsFile, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const records = new Map(rows.map((record) => [record.id, record]));
const lineNumbers = new Map(rows.map((record, index) => [record.id, index + 1]));

const escapeHtml = (value = '') => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
const oneLine = (value = '') => value.replace(/\s+/g, ' ').trim();
const excerpt = (value, limit = 260) => {
  const compact = oneLine(value);
  return compact.length > limit ? `${compact.slice(0, limit)}…` : compact;
};
const category = (record) => categoryLabels[record.curation.primary_category] || [record.curation.primary_category, record.curation.primary_category];
const imagePath = (record) => {
  const path = record.image?.local_path;
  if (!path || !existsSync(join(root, path))) throw new Error(`Missing showcase image for ${record.id}: ${path}`);
  return path;
};
const sourceLink = (record) => record.source?.x_post_url || '#';
const publisher = (record) => record.source?.publisher_handle ? `@${record.source.publisher_handle}` : 'unknown';
const authorship = (record) => record.source?.credited_creator_handle ? `@${record.source.credited_creator_handle}` : '未核验原创作者';

for (const item of cases) {
  const record = records.get(item.id);
  if (!record) throw new Error(`Showcase record not found: ${item.id}`);
  imagePath(record);
}

mkdirSync(casesDir, { recursive: true });

const renderCard = (item, index, detailPath = `cases/${item.id}.md`) => {
  const record = records.get(item.id);
  const [, categoryEn] = category(record);
  const image = imagePath(record).replace(/^assets\//, '../assets/');
  return `<td width="50%">\n<a href="${detailPath}"><img src="${image}" alt="${escapeHtml(item.zh)}" width="360"></a><br>\n<strong>${index + 1}. ${escapeHtml(item.zh)}</strong><br>\n<sub>${escapeHtml(categoryEn)} · ${escapeHtml(record.id)} · ${escapeHtml(publisher(record))}</sub><br>\n<small>${escapeHtml(excerpt(record.prompt_text, 190))}</small>\n</td>`;
};

const galleryRows = [];
for (let index = 0; index < cases.length; index += 2) {
  galleryRows.push(`<tr>\n${renderCard(cases[index], index)}\n${cases[index + 1] ? renderCard(cases[index + 1], index + 1) : '<td></td>'}\n</tr>`);
}

const showcase = [
  '# 精选效果图 / Visual showcase',
  '',
  '> 这里把“提示词”和“结果图”放在一起看。图片来自仓库内 `assets/images/`，每一张都对应 `data/prompts.jsonl` 中的一条记录，并保留来源发布者、作者核验状态和原始 X 帖文。',
  '>',
  '> This page pairs each original-language prompt record with its result image. Every case keeps a publisher, authorship status, and source link so the visual result is never separated from its provenance.',
  '',
  '## 先看效果 / Start with the images',
  '',
  '<table>',
  ...galleryRows,
  '</table>',
  '',
  '## 如何阅读 / How to read a case',
  '',
  '- 点击图片或案例标题进入详情页，可看到分类、具体场景、构图范围、身份保持状态、来源与提示词原文摘要。',
  '- 详情页的“完整原文”链接会定位到 `data/prompts.jsonl` 的对应行；原提示词保持来源语言，不翻译、不改写。',
  '- `publisher_unverified` 只表示“来源发布者已知、原创作者尚未核验”，不把发布者直接写成作者。',
  '- 如果你是作者或权利人，请按[更正与移除流程](copyright-and-attribution.md#corrections-and-removal)提出请求。',
  '',
  '## 精选案例索引 / Case index',
  '',
  '| ID | 处理方向 | 具体场景 | 发布者 | 原始来源 |',
  '| --- | --- | --- | --- | --- |',
  ...cases.map((item) => {
    const record = records.get(item.id);
    const [categoryZh] = category(record);
    return `| [${record.id}](cases/${record.id}.md) | ${categoryZh} | ${item.zh} | ${publisher(record)} | [X 帖文](${sourceLink(record)}) |`;
  }),
  '',
  '本页由 `npm run generate:github-showcase` 生成。精选案例 ID、图片路径和提示词摘要均从 `data/prompts.jsonl` 读取，避免 README、详情页和研究主库出现不同步。',
  ''
].join('\n');

writeFileSync(showcaseFile, showcase);

for (const item of cases) {
  const record = records.get(item.id);
  const [categoryZh, categoryEn] = category(record);
  const promptExcerpt = excerpt(record.prompt_text, 900);
  const restricted = record.source?.publication_rule === 'do_not_publish_full_prompt';
  const lines = [
    `# ${record.id} · ${item.zh}`,
    '',
    `<img src="../../${imagePath(record)}" alt="${escapeHtml(item.zh)}" width="620">`,
    '',
    `> ${escapeHtml(categoryEn)} · ${escapeHtml(item.en)}`,
    '',
    '## 记录信息',
    '',
    '| 字段 | 内容 |',
    '| --- | --- |',
    `| 处理方向 | ${categoryZh} / ${categoryEn} |`,
    `| 具体场景 | ${item.zh} / ${item.en} |`,
    `| 构图范围 | \`${record.curation.framing}\` |`,
    `| 身份保持 | \`${record.analysis.identity_lock}\` |`,
    `| 来源发布者 | ${publisher(record)} |`,
    `| 作者状态 | \`${record.source.authorship_status}\` · ${authorship(record)} |`,
    `| 收录日期 | ${record.source.posted_at_utc?.slice(0, 10) || 'unknown'} |`,
    '',
    '## 提示词原文摘要',
    '',
    '> 下面只截取原文开头，保留原始语言，不翻译、不改写。',
    '',
    '~~~~text',
    promptExcerpt,
    '~~~~',
    '',
    restricted
      ? `完整提示词受当前发布规则限制，请在[研究主库原始记录](../../data/prompts.jsonl#L${lineNumbers.get(record.id)})查看并按署名规则使用。`
      : `查看[完整原始提示词](../../data/prompts.jsonl#L${lineNumbers.get(record.id)})（第 ${lineNumbers.get(record.id)} 行）；也可在[在线图鉴](https://portrait.mizzlelover.xyz)中浏览同类案例。`,
    '',
    '## 来源与署名',
    '',
    `- 原始 X 帖文：[${sourceLink(record)}](${sourceLink(record)})`,
    `- 来源发布者：${publisher(record)}`,
    `- 作者核验：\`${record.source.authorship_status}\``,
    `- 证据说明：${record.source.attribution_evidence || '未提供'}`,
    `- 结果图上游文件：[${record.image.source_dataset_path}](${record.image.download_url})`,
    '',
    '这张效果图仅用于与对应提示词配对阅读。若你是作者或权利人，请按[更正与移除流程](../copyright-and-attribution.md#corrections-and-removal)联系维护者。',
    '',
    '[← 返回精选效果图](../showcase.md) · [返回 README](../../README.md)',
    ''
  ];
  writeFileSync(join(casesDir, `${record.id}.md`), lines.join('\n'));
}

console.log(`Generated GitHub showcase index and ${cases.length} case detail pages.`);
