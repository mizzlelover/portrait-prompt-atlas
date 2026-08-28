import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const activeFile = join(root, 'data', 'prompts.jsonl');
const rawFile = join(root, 'data', 'raw-prompts.jsonl');
const auditFile = join(root, 'data', 'curation-audit.json');
if (!existsSync(rawFile)) copyFileSync(activeFile, rawFile);
const raw = readFileSync(rawFile, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
const manualExclusions = new Set(['GI2_21048', 'GI2_10199', 'GI2_04955']);

const inputSignal = /(uploaded|upload|attached\s+(image|photo|portrait|face|model)|pictured\s+in\s+the\s+attached|reference\s*(image|photo|portrait|face)|my\s+(face|photo|portrait|image)|same\s+(person|face)|preserve[^.\n]{0,80}(identity|face|facial)|identity[^.\n]{0,60}(preserv|reference|lock)|original\s+(photo|image)|input\s+(photo|image)|基于.*(照片|人像|脸)|上传.*(照片|人像|脸)|参考.*(照片|人像|脸)|保持.*(身份|人像|脸|五官)|保留.*(身份|人像|脸|五官|相貌))/i;
const humanSignal = /\b(?:selfie|headshot|person|people|woman|women|man|men|male|female|girl|boy|family|couple|child|children|baby|athlete|player|actor|bride|groom|mother|father|face-obscuring)\b|\b(?:human|portrait|fashion|male|female)\s+(?:subject|figure|model)\b|\bmodel\s+(?:in|from|pictured|photo|portrait)\b|\b(?:central|monumental|full-body|half-body|close-up|editorial|cinematic|fashion)\s+portrait\b|\bportrait\s+(?:subject|of\s+(?:a|an|the)|featuring)\b|\b(?:uploaded|reference|attached)[^.\n]{0,80}\b(?:face|facial)\b|\bfacial\s+(?:structure|features|proportions|identity)\b|\b(?:face|facial)\s+(?:reference|identity)\b|人物|人像|肖像|脸|五官|本人|自拍|家庭|合照|情侣|儿童|亲人|模特|运动员|球员|新娘|新郎/i;
const explicitPersonSignal = /\b(?:selfie|headshot|person|people|woman|women|man|men|male|female|girl|boy|family|couple|child|children|baby|athlete|player|actor|bride|groom|mother|father)\b|\b(?:human|portrait|fashion|male|female)\s+(?:subject|figure|model)\b|\bmodel\s+(?:in|from|pictured|photo|portrait)\b|\b(?:central|monumental|full-body|half-body|close-up|editorial|cinematic|fashion)\s+portrait\b|\bportrait\s+(?:subject|of\s+(?:a|an|the)|featuring)\b|人物|人像|肖像|本人|自拍|家庭|合照|情侣|儿童|亲人|模特|运动员|球员|新娘|新郎/i;
const animalSignal = /\b(?:cat|kitten|dog|puppy|pet|fox|bird|animal)\b|猫|狗|宠物|狐狸|动物/i;
const productSignal = /\b(?:product|package|packaging|vehicle|car|motorcycle|sneaker|shoe|bottle|perfume|cosmetic|food|beverage|app interface|dashboard|infographic)\b|产品|包装|汽车|车辆|摩托车|鞋|香水|化妆品|食品|饮料|界面|信息图/i;
const notPortraitOutput = /(avoid\s+(?:any\s+)?(?:people|persons?|faces?|humans?)|no\s+(?:people|persons?|humans?|faces?)(?:\s|,|$)|\b(?:infographic|wordmark|web app screenshot|gallery index page|dashboard interface|commemorative coin presentation|industrial packaging|product sheet|vehicle dossier|product-only advertisement|miniature diorama reconstruction|tabletop miniature)\b|\b(?:create|design|transform)[^.\n]{0,100}\b(?:package|packaging)\b|\b(?:magazine archive spread|editorial dossier)[^.\n]{0,100}\b(?:car|vehicle)\b)/i;
const rules = {
  restoration: /\b(?:old[ -]photo\s+restoration|photo\s+restoration|restore\s+(?:the\s+|an?\s+)?(?:attached\s+|provided\s+|reference\s+|same\s+|old\s+|damaged\s+)?(?:photo|image|portrait|snapshot)|(?:photo|image|portrait|snapshot)[^.\n]{0,80}\b(?:restore|repair|enhance|deblur|denoise|sharpen|colori[sz]e)\b|(?:upscale|enhance|repair|deblur|denoise|sharpen|colori[sz]e)\s+(?:and\s+(?:restore|enhance)\s+)?(?:the\s+|this\s+|same\s+|attached\s+|provided\s+|reference\s+)?(?:photo|image|portrait|snapshot)\b)\b|(?:修复|修复并上色|去噪|去模糊|提升清晰度)[^。\n]{0,60}(?:照片|图像|人像)|(?:照片|图像|人像)[^。\n]{0,60}(?:修复|去噪|去模糊|提升清晰度)/i,
  memory: /\b(?:family|couple|wedding|parent|grandparent|child|baby|memorial|anniversary|pet)\b|家庭|亲人|父母|爷爷|奶奶|情侣|婚礼|孩子|纪念|宠物/i,
  professional: /\b(?:headshot|corporate|business|linkedin|professional portrait|id photo|passport)\b|职业|商务|证件|企业形象/i,
  retouch: /\b(?:portrait\s+retouch|beauty\s+(?:and\s+lifestyle\s+photo\s+)?retouch|natural\s+retouch|retouch(?:ing)?\s+(?:the\s+)?(?:face|skin|portrait|photo)|remove\s+(?:temporary\s+)?(?:blemishes|acne)|improve\s+(?:the\s+)?complexion|refine\s+(?:the\s+)?(?:skin|makeup))\b|自然精修|人像精修|美化人像|去除痘印|肤质优化/i,
  natural: /\b(?:photorealistic\s+(?:portrait|selfie|headshot)|realistic\s+(?:portrait|selfie|headshot)|studio\s+portrait|candid\s+(?:portrait|selfie)|beauty\s+portrait|close-up\s+portrait)\b|自然写实人像/i,
  lifestyle: /\b(?:travel|beach|street|cafe|hotel|vacation|city|lifestyle)\b|旅行|海边|街拍|咖啡|酒店|生活方式/i,
  editorial: /\b(?:fashion|editorial|vogue|magazine|runway|couture)\b|时尚|杂志|高级感|秀场/i,
  style: /\b(?:anime|manga|illustration|cartoon|comic|watercolor|oil painting|sketch|pixel art|chibi|caricature|point[ -]cloud|holographic|particle[ -]render|daguerreotype|pixar)\b|插画|动漫|漫画|水彩|油画|素描|卡通|像素画|点云|全息|粒子渲染/i,
  composite: /\b(?:poster|collage|double exposure|magazine spread|billboard|campaign artwork|mixed-media composition)\b|海报|拼贴|双重曝光|杂志跨页|广告牌/i
};

function classificationText(text) {
  const withoutNegativeBlock = text.replace(/\bnegative(?: prompt| indications?| constraints?)\b[\s\S]*$/i, ' ');
  return withoutNegativeBlock.split(/\n|(?<=[.!?])\s+/).filter((part) => !/^\s*(?:do not|don't|avoid|exclude|without|no\s|cartoon\s*,|anime\s*,|illustration\s*,|painting\s*,|watermark\s*,|low[ -]resolution\s*,|blurry\s*,)/i.test(part)).join(' ');
}

function normalized(text) {
  return text.replace(/^\s*title\s*:[\s\S]*?\bprompt\s*:\s*/i, '').toLowerCase().replace(/^\s*(?:title|prompt)\s*:\s*/gim, '').replace(/\{argument name="[^"]+" default="([^"]*)"\}/g, '$1').replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
}
function imageDigest(record) {
  const path = record.image?.local_path;
  return path && existsSync(join(root, path)) ? createHash('sha256').update(readFileSync(join(root, path))).digest('hex') : null;
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
  const positive = classificationText(text);
  if (!inputSignal.test(text) || !humanSignal.test(positive) || notPortraitOutput.test(positive)) return null;
  if ((animalSignal.test(positive) || productSignal.test(positive)) && !explicitPersonSignal.test(positive)) return null;
  if (rules.restoration.test(positive)) return {primary: 'restoration_and_preservation', basis: 'restoration_action'};
  if (rules.style.test(positive)) return {primary: 'identity_locked_style_transfer', basis: 'medium_transformation'};
  if (rules.composite.test(positive)) return {primary: 'creative_portrait_scene', basis: 'composite_or_poster'};
  if (rules.professional.test(positive)) return {primary: 'professional_headshot_and_brand', basis: 'professional_output'};
  if (rules.editorial.test(positive)) return {primary: 'editorial_fashion_portrait', basis: 'editorial_output'};
  if (rules.retouch.test(positive)) return {primary: 'natural_retouch_and_beauty', basis: 'natural_retouch_action'};
  if (rules.lifestyle.test(positive)) return {primary: 'lifestyle_and_travel_portrait', basis: 'lifestyle_scene'};
  if (rules.memory.test(positive)) return {primary: 'memory_family_and_relationship', basis: 'relationship_or_memory'};
  if (rules.natural.test(positive)) return {primary: 'natural_retouch_and_beauty', basis: 'natural_photographic_output'};
  return {primary: 'creative_portrait_scene', basis: 'general_creative_portrait'};
}
function subCategory(text, primary) {
  const positive = classificationText(text);
  const framing = portraitFraming(text);
  if (primary === 'restoration_and_preservation') {
    if (/\b(?:family|memorial|anniversary|wedding)\b|家庭|亲人|纪念|婚礼/i.test(positive)) return 'memory_photo_preservation';
    if (/\b(?:old[ -]photo|historic\s+photo|damaged\s+photo|aged\s+photo|scratch|crease|paper damage|peeling emulsion)\b|老照片|泛黄|划痕|褪色/i.test(positive)) return 'historic_and_damaged_photo';
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
    if (/\b(?:anime|manga|illustration|cartoon|comic|watercolor|oil painting|sketch|chibi|caricature|pixar)\b|插画|动漫|漫画|水彩|油画|素描|卡通/i.test(positive)) return 'illustration_and_anime_transform';
    if (/\b(?:point[ -]cloud|holographic|particle[ -]render|voxel|pixel art|3d)\b|点云|全息|粒子渲染|像素画/i.test(positive)) return 'digital_and_graphic_transform';
    if (/\b(?:cinematic|fantasy|surreal)\b|电影感|超现实/i.test(positive)) return 'cinematic_and_fantasy_transform';
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
  const positive = classificationText(text);
  const tags = [primary];
  for (const [name, pattern] of Object.entries(rules)) if (pattern.test(positive) && name !== primary) tags.push(name);
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

const eligible = raw.map((record) => ({record, decision: manualExclusions.has(record.id) ? null : category(record.prompt_text)})).filter((item) => item.decision);
const includedIds = new Set(eligible.map((item) => item.record.id));
const excluded = raw.filter((record) => !includedIds.has(record.id)).map((record) => ({id: record.id, reason: manualExclusions.has(record.id) ? 'manual_visual_no_person' : 'not_real_person_reference_edit'}));
const prepared = eligible.map((item) => ({record: item.record, primary: item.decision.primary, basis: item.decision.basis, normalized: normalized(item.record.prompt_text), grams: grams(item.record.prompt_text)}));
const parent = prepared.map((_, index) => index);
const rootOf = (index) => parent[index] === index ? index : (parent[index] = rootOf(parent[index]));
const joinSet = (left, right) => { const a = rootOf(left); const b = rootOf(right); if (a !== b) parent[b] = a; };
const pairs = [];
for (let left = 0; left < prepared.length; left += 1) for (let right = 0; right < left; right += 1) {
  const result = similarity(prepared[left], prepared[right]);
  if (result.score >= 0.94 && result.length_ratio >= 0.85) { joinSet(left, right); pairs.push({left, right, reason: 'near_identical_prompt', ...result}); }
}
const imageOwners = new Map();
for (let index = 0; index < prepared.length; index += 1) {
  const digest = imageDigest(prepared[index].record);
  if (!digest) continue;
  if (imageOwners.has(digest)) { const left = imageOwners.get(digest); joinSet(left, index); pairs.push({left, right: index, reason: 'identical_result_image', score: 1, length_ratio: 1}); }
  else imageOwners.set(digest, index);
}
const clusters = new Map();
for (let index = 0; index < prepared.length; index += 1) {
  const key = rootOf(index); clusters.set(key, [...(clusters.get(key) || []), index]);
}
const duplicateClusters = [...clusters.values()].filter((cluster) => cluster.length > 1).map((cluster) => {
  const canonical = cluster.map((index) => prepared[index].record).reduce(earlier);
  const members = cluster.map((index) => prepared[index].record.id);
  const links = pairs.filter((pair) => cluster.includes(pair.left) && cluster.includes(pair.right));
  return {canonical_id: canonical.id, duplicate_ids: members.filter((id) => id !== canonical.id), all_ids: members, reasons: [...new Set(links.map((link) => link.reason))], threshold: {trigram_dice: 0.94, length_ratio: 0.85}, strongest_similarity: Math.max(...links.map((link) => link.score))};
});
const duplicates = new Set(duplicateClusters.flatMap((cluster) => cluster.duplicate_ids));
const curated = prepared.filter((item) => !duplicates.has(item.record.id)).map(({record, primary, basis}) => ({...record, curation: {version: 'portrait-curation-v4', primary_category: primary, secondary_category: subCategory(record.prompt_text, primary), classification_basis: basis, framing: portraitFraming(record.prompt_text), tags: tags(record.prompt_text, primary), duplicate_status: 'canonical'}}));
const categories = Object.fromEntries(Object.entries(Object.groupBy(curated, (record) => record.curation.primary_category)).map(([name, records]) => [name, records.length]));
writeFileSync(activeFile, `${curated.map((record) => JSON.stringify(record)).join('\n')}\n`);
writeFileSync(auditFile, `${JSON.stringify({version: 'portrait-curation-v4', source_records: raw.length, included_records: eligible.length, published_records: curated.length, excluded, duplicate_clusters: duplicateClusters, category_counts: categories, secondary_category_counts: Object.fromEntries(Object.entries(Object.groupBy(curated, (record) => record.curation.secondary_category)).map(([name, records]) => [name, records.length]))})}\n`);
console.log(JSON.stringify({source: raw.length, excluded: excluded.length, duplicate_clusters: duplicateClusters.length, removed_duplicates: duplicates.size, published: curated.length, categories}, null, 2));
