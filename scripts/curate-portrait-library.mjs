import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const activeFile = join(root, 'data', 'prompts.jsonl');
const rawFile = join(root, 'data', 'raw-prompts.jsonl');
const auditFile = join(root, 'data', 'curation-audit.json');
if (!existsSync(rawFile)) copyFileSync(activeFile, rawFile);
const raw = readFileSync(rawFile, 'utf8').trim().split('\n').map((line) => JSON.parse(line));

const inputSignal = /(uploaded|upload|attached\s+(image|photo|portrait|face|model)|pictured\s+in\s+the\s+attached|reference\s*(image|photo|portrait|face)|my\s+(face|photo|portrait|image)|same\s+(person|face)|preserve[^.\n]{0,80}(identity|face|facial)|identity[^.\n]{0,60}(preserv|reference|lock)|original\s+(photo|image)|input\s+(photo|image)|基于.*(照片|人像|脸)|上传.*(照片|人像|脸)|参考.*(照片|人像|脸)|保持.*(身份|人像|脸|五官)|保留.*(身份|人像|脸|五官|相貌))/i;
const humanSignal = /(portrait|face|facial|selfie|headshot|person|people|woman|women|man|men|girl|boy|human|family|couple|child|children|baby|identity|人物|人像|肖像|脸|五官|本人|自拍|家庭|合照|情侣|儿童|亲人)/i;
const notPortraitOutput = /(avoid\s+(?:any\s+)?(?:people|persons?|faces?|humans?)|no\s+(?:people|persons?|humans?|faces?)(?:\s|,|$)|\b(?:infographic|wordmark)\b)/i;
const rules = {
  restoration: /\b(?:restore|restoration|repair|scratch|crease|faded|colori[sz]e|denoise|deblur|low[ -]resolution|damaged|old[ -]photo)\b|修复|老照片|划痕|褪色|泛黄|去噪|模糊|低清/i,
  memory: /\b(?:family|couple|wedding|parent|grandparent|child|baby|memorial|anniversary|pet)\b|家庭|亲人|父母|爷爷|奶奶|情侣|婚礼|孩子|纪念|宠物/i,
  professional: /\b(?:headshot|corporate|business|linkedin|professional portrait|id photo|passport)\b|职业|商务|证件|企业形象/i,
  natural: /\b(?:retouch|beauty|makeup|skin care|skin texture|pores|complexion)\b|美化|美颜|妆容|肤质|毛孔|皮肤/i,
  lifestyle: /\b(?:travel|beach|street|cafe|hotel|vacation|city|lifestyle)\b|旅行|海边|街拍|咖啡|酒店|生活方式/i,
  editorial: /\b(?:fashion|editorial|vogue|magazine|runway|couture)\b|时尚|杂志|高级感|秀场/i,
  style: /\b(?:anime|manga|illustration|cartoon|comic|watercolor|oil painting|sketch|3d|pixar)\b|插画|动漫|漫画|水彩|油画|素描|卡通/i
};

function normalized(text) {
  return text.toLowerCase().replace(/^(title|prompt)\s*:\s*/gim, '').replace(/\{argument name="[^"]+" default="[^"]*"\}/g, '{arg}').replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
}
function grams(text) {
  const value = normalized(text).replaceAll(' ', '');
  const result = new Set();
  for (let index = 0; index < value.length - 2; index += 1) result.add(value.slice(index, index + 3));
  return result;
}
function similarity(left, right) {
  const shortRatio = Math.min(left.normalized.length, right.normalized.length) / Math.max(left.normalized.length, right.normalized.length);
  if (shortRatio < 0.85) return {score: 0, length_ratio: shortRatio};
  let common = 0;
  for (const gram of left.grams) if (right.grams.has(gram)) common += 1;
  return {score: (2 * common) / (left.grams.size + right.grams.size), length_ratio: shortRatio};
}
function category(text) {
  if (!inputSignal.test(text) || !humanSignal.test(text) || notPortraitOutput.test(text)) return null;
  if (rules.restoration.test(text)) return 'restoration_and_preservation';
  if (rules.memory.test(text)) return 'memory_family_and_relationship';
  if (rules.professional.test(text)) return 'professional_headshot_and_brand';
  if (rules.style.test(text)) return 'identity_locked_style_transfer';
  if (rules.natural.test(text)) return 'natural_retouch_and_beauty';
  if (rules.lifestyle.test(text)) return 'lifestyle_and_travel_portrait';
  if (rules.editorial.test(text)) return 'editorial_fashion_portrait';
  return 'creative_portrait_scene';
}
function subCategory(text, primary) {
  const framing = portraitFraming(text);
  if (primary === 'restoration_and_preservation') {
    if (/\b(?:old|historic|vintage|archival)\b|老照片|泛黄|划痕|褪色/i.test(text)) return 'historic_and_damaged_photo';
    if (/\b(?:family|memorial|anniversary|wedding)\b|家庭|亲人|纪念|婚礼/i.test(text)) return 'memory_photo_preservation';
    return 'clarity_color_and_quality_recovery';
  }
  if (primary === 'natural_retouch_and_beauty') {
    if (/\b(?:family|couple|group|wedding)\b|家庭|合照|情侣|婚礼/i.test(text)) return 'group_and_relationship_retouch';
    if (framing === 'half_body' || framing === 'full_body') return 'half_and_full_body_polish';
    return 'selfie_face_and_closeup_polish';
  }
  if (primary === 'professional_headshot_and_brand') {
    if (/\b(?:passport|id photo|visa|document)\b|证件|护照|签证/i.test(text)) return 'document_and_id_photo';
    if (framing === 'half_body' || framing === 'full_body') return 'personal_branding_half_and_full_portrait';
    return 'business_headshot_and_profile';
  }
  if (primary === 'lifestyle_and_travel_portrait') {
    if (/\b(?:travel|beach|hotel|vacation|landmark)\b|旅行|海边|酒店|景点/i.test(text)) return 'travel_and_outdoor_portrait';
    if (/\b(?:wedding|date|couple|family|party)\b|婚礼|约会|情侣|家庭|聚会/i.test(text)) return 'event_and_relationship_portrait';
    return 'daily_and_social_portrait';
  }
  if (primary === 'editorial_fashion_portrait') {
    if (framing === 'half_body' || framing === 'full_body') return 'fashion_half_and_full_body_portrait';
    if (/\b(?:campaign|magazine|runway|vogue)\b|杂志|秀场/i.test(text)) return 'campaign_and_magazine_portrait';
    return 'beauty_and_studio_closeup';
  }
  if (primary === 'identity_locked_style_transfer') {
    if (/\b(?:anime|manga|illustration|cartoon|comic|watercolor|oil painting|sketch|pixar)\b|插画|动漫|漫画|水彩|油画|素描|卡通/i.test(text)) return 'illustration_and_anime_transform';
    if (/\b(?:cinematic|fantasy|surreal)\b|电影感|超现实/i.test(text)) return 'cinematic_and_fantasy_transform';
    return 'identity_locked_style_upgrade';
  }
  if (/\b(?:poster|collage|double exposure|composite)\b|海报|拼贴|双重曝光/i.test(text)) return 'creative_composite_and_poster';
  if (/\b(?:cinematic|fantasy|surreal)\b|电影感|超现实/i.test(text)) return 'cinematic_and_fantasy_scene';
  return 'creative_portrait_scene';
}
function portraitFraming(text) {
  if (/\b(?:group|family|couple|people)\b|合照|家庭|情侣|多人/i.test(text)) return 'group';
  if (/\b(?:full[ -]body|full length|head[ -]to[ -]toe)\b|全身|全身像/i.test(text)) return 'full_body';
  if (/\b(?:half[ -]body|three[ -]quarter|three quarter)\b|半身|三分之二身/i.test(text)) return 'half_body';
  if (/\b(?:headshot|selfie|close[ -]up|closeup|face only|head and shoulders)\b|头像|自拍|特写|近景/i.test(text)) return 'headshot_closeup';
  return 'unspecified';
}
function tags(text, primary) {
  const tags = [primary];
  for (const [name, pattern] of Object.entries(rules)) if (pattern.test(text) && name !== primary) tags.push(name);
  return tags;
}
function rank(record) {
  const status = record.source.authorship_status;
  const provenance = status === 'original_creator_self_claimed' ? 3 : status === 'repost_creator_credited' ? 2 : status === 'publisher_unverified' ? 1 : 0;
  return [-provenance, record.source.posted_at_utc || '', record.id];
}
function earlier(left, right) {
  const a = rank(left); const b = rank(right);
  for (let index = 0; index < a.length; index += 1) if (a[index] !== b[index]) return a[index] < b[index] ? left : right;
  return left;
}

const eligible = raw.map((record) => ({record, primary: category(record.prompt_text)})).filter((item) => item.primary);
const excluded = raw.filter((record) => !category(record.prompt_text)).map((record) => ({id: record.id, reason: 'not_real_person_reference_edit'}));
const prepared = eligible.map((item) => ({...item, normalized: normalized(item.record.prompt_text), grams: grams(item.record.prompt_text)}));
const parent = prepared.map((_, index) => index);
const rootOf = (index) => parent[index] === index ? index : (parent[index] = rootOf(parent[index]));
const joinSet = (left, right) => { const a = rootOf(left); const b = rootOf(right); if (a !== b) parent[b] = a; };
const pairs = [];
for (let left = 0; left < prepared.length; left += 1) for (let right = 0; right < left; right += 1) {
  const result = similarity(prepared[left], prepared[right]);
  if (result.score >= 0.94 && result.length_ratio >= 0.85) { joinSet(left, right); pairs.push({left, right, ...result}); }
}
const clusters = new Map();
for (let index = 0; index < prepared.length; index += 1) {
  const key = rootOf(index); clusters.set(key, [...(clusters.get(key) || []), index]);
}
const duplicateClusters = [...clusters.values()].filter((cluster) => cluster.length > 1).map((cluster) => {
  const canonical = cluster.map((index) => prepared[index].record).reduce(earlier);
  const members = cluster.map((index) => prepared[index].record.id);
  const links = pairs.filter((pair) => cluster.includes(pair.left) && cluster.includes(pair.right));
  return {canonical_id: canonical.id, duplicate_ids: members.filter((id) => id !== canonical.id), all_ids: members, threshold: {trigram_dice: 0.94, length_ratio: 0.85}, strongest_similarity: Math.max(...links.map((link) => link.score))};
});
const duplicates = new Set(duplicateClusters.flatMap((cluster) => cluster.duplicate_ids));
const curated = prepared.filter((item) => !duplicates.has(item.record.id)).map(({record, primary}) => ({...record, curation: {version: 'portrait-curation-v3', primary_category: primary, secondary_category: subCategory(record.prompt_text, primary), framing: portraitFraming(record.prompt_text), tags: tags(record.prompt_text, primary), duplicate_status: 'canonical'}}));
const categories = Object.fromEntries(Object.entries(Object.groupBy(curated, (record) => record.curation.primary_category)).map(([name, records]) => [name, records.length]));
writeFileSync(activeFile, `${curated.map((record) => JSON.stringify(record)).join('\n')}\n`);
writeFileSync(auditFile, `${JSON.stringify({version: 'portrait-curation-v3', source_records: raw.length, included_records: eligible.length, published_records: curated.length, excluded, duplicate_clusters: duplicateClusters, category_counts: categories, secondary_category_counts: Object.fromEntries(Object.entries(Object.groupBy(curated, (record) => record.curation.secondary_category)).map(([name, records]) => [name, records.length]))})}\n`);
console.log(JSON.stringify({source: raw.length, excluded: excluded.length, duplicate_clusters: duplicateClusters.length, removed_duplicates: duplicates.size, published: curated.length, categories}, null, 2));
