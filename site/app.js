const state = { lang: 'zh', items: [], visible: 28, category: 'all', secondary: 'all', identity: 'all', query: '', sort: 'recent' };

const labels = {
  restoration_and_preservation: ['修复与影像保全', 'Restoration & preservation'], natural_retouch_and_beauty: ['自然精修与美化', 'Natural retouch & beauty'], professional_headshot_and_brand: ['职业头像与形象', 'Professional identity photography'], lifestyle_and_travel_portrait: ['生活方式与旅行人像', 'Lifestyle & travel portrait'], editorial_fashion_portrait: ['时尚与编辑肖像', 'Editorial & fashion portrait'], identity_locked_style_transfer: ['身份锁定风格转换', 'Identity-locked style transfer'], memory_family_and_relationship: ['纪念、家庭与关系影像', 'Memory, family & relationship'], creative_portrait_scene: ['创意肖像与场景表达', 'Creative portrait & scene']
};
const secondaryLabels = {
  historic_and_damaged_photo: ['老照片与破损修复', 'Historic & damaged photo'], clarity_color_and_quality_recovery: ['清晰度、色彩与画质恢复', 'Clarity, colour & quality recovery'], memory_photo_preservation: ['纪念照片保全', 'Memory photo preservation'], selfie_face_and_closeup_polish: ['自拍、脸部与近景精修', 'Selfie, face & close-up polish'], half_and_full_body_polish: ['半身与全身自然精修', 'Half & full-body polish'], group_and_relationship_retouch: ['合照与关系影像精修', 'Group & relationship retouch'], business_headshot_and_profile: ['商务头像与职业主页照', 'Business headshot & profile'], document_and_id_photo: ['证件与身份照片', 'Document & ID photo'], personal_branding_half_and_full_portrait: ['个人品牌半身与全身照', 'Personal-brand half & full portrait'], travel_and_outdoor_portrait: ['旅行与户外人像', 'Travel & outdoor portrait'], daily_and_social_portrait: ['日常与社交人像', 'Daily & social portrait'], event_and_relationship_portrait: ['活动、约会与关系影像', 'Event & relationship portrait'], beauty_and_studio_closeup: ['棚拍美妆与近景肖像', 'Beauty studio & close-up'], fashion_half_and_full_body_portrait: ['时尚半身与全身肖像', 'Fashion half & full portrait'], campaign_and_magazine_portrait: ['杂志与品牌大片肖像', 'Campaign & magazine portrait'], illustration_and_anime_transform: ['插画、素描与动漫转换', 'Illustration, sketch & anime'], digital_and_graphic_transform: ['数字图形、点云与像素转换', 'Digital graphic, point-cloud & pixel'], cinematic_and_fantasy_transform: ['电影感与奇幻转换', 'Cinematic & fantasy transform'], identity_locked_style_upgrade: ['保留身份的风格升级', 'Identity-locked style upgrade'], creative_composite_and_poster: ['创意合成与人物海报', 'Creative composite & portrait poster'], cinematic_and_fantasy_scene: ['电影感与奇幻场景肖像', 'Cinematic & fantasy scene'], creative_portrait_scene: ['创意场景人像', 'Creative portrait scene']
};
const zh = {
  navLibrary: '图鉴', navAgent: '给 Agent', eyebrow: 'GPT IMAGE 2 · 人像处理', heroTitle: '<span class="cjk-line">让人像处理更有</span><br><em class="cjk-line">来处，也更有分寸。</em>', heroCopy: '一个以来源为先的人像提示词图鉴。用于修复、自然美化、身份保持与有意义照片的重生。', browse: '浏览全部案例', source: '查看源库 ↗', statCases: '条精选记录', statTracks: '个人像方向', statLinks: '条原始来源可回链', principleOneTitle: '原文保留', principleOneText: '提示词按来源原样展示：中文保留中文，英文保留英文，不作翻译或改写。', principleTwoTitle: '来源可追溯', principleTwoText: '每条记录都回链原始 X 帖文，并清楚标注发布者与作者核验状态。', principleThreeTitle: '为真实人像而设', principleThreeText: '围绕身份保持、自然质感与具有纪念意义的影像处理做筛选。', catalogEyebrow: '精选目录', catalogTitle: '从真实需求开始找', catalogCopy: '选择处理方向与具体场景，打开原始提示词、作者和来源。', search: '搜索提示词、场景或发布者', allCategories: '全部处理方向', allSecondary: '全部具体场景', chooseSecondary: '先选择处理方向', allIdentity: '任意身份控制', identityExplicit: '明确锁定身份', identityReference: '以参考图保持身份', identityImplicit: '隐含身份控制', identityNone: '未写身份控制', results: '条记录', reset: '清除筛选', openSource: '打开 X 来源 ↗', sortRecent: '按最新收录', sortShortest: '按提示词长度', sourcePublisher: '来源发布者', originalCreator: '已核验原创作者', provenance: '来源状态', prompt: '原始提示词（未翻译）', copyPrompt: '复制提示词', task: '处理方向', scenario: '具体场景', identity: '身份保持', noResults: '没有符合条件的记录。', agentEyebrow: '内置 SKILL', agentTitle: '把人像图鉴带进<br><em>Claude Code 和 Codex。</em>', agentCopy: '同一份目录既可浏览，也能让你的 Agent 根据真实人像需求挑选合适的原始提示词，同时保留来源信息。', installLabel: '快速安装', copy: '复制', copied: '已复制', installNote: '安装后直接说：使用 gpt-image-2-portrait-library，为一张旅行人像找一个自然、保留身份的处理方案。', ethicsEyebrow: '署名也是工作流的一部分', ethicsTitle: '好看的结果，不该抹去创作者的来处。', ethicsCopy: '此库区分“发布者”和“已核验原创作者”。如果来源不充分，不把发布账号冒充作者；作者可以随时发起更正或移除。', ethicsLink: '查看署名与更正规则 ↗', footer: '提示词始终保持来源的原始语言。'
};
const en = { ...zh, navLibrary: 'Library', navAgent: 'For agents', eyebrow: 'GPT IMAGE 2 · PORTRAIT EDITING', heroTitle: 'Portrait editing with<br><em>context and care.</em>', heroCopy: 'A provenance-first prompt atlas for restoration, natural retouching, identity preservation, and meaningful photo renewal.', browse: 'Browse the library', source: 'View source repo ↗', statCases: 'curated records', statTracks: 'portrait tracks', statLinks: 'records source linked', catalogEyebrow: 'CURATED CATALOG', catalogTitle: 'Choose the outcome first', catalogCopy: 'Choose an editing outcome and concrete scenario, then open the original prompt, creator and source.', search: 'Search prompt, scene or publisher', allCategories: 'All editing outcomes', allSecondary: 'All scenarios', chooseSecondary: 'Choose an outcome first', allIdentity: 'Any identity control', identityExplicit: 'Explicit identity lock', identityReference: 'Reference-based identity', identityImplicit: 'Implicit identity lock', identityNone: 'No identity lock', results: 'records', reset: 'Reset filters', openSource: 'Open X source ↗', sortRecent: 'Recently collected', sortShortest: 'Shortest prompt first', sourcePublisher: 'Source publisher', originalCreator: 'Verified original creator', provenance: 'Provenance', prompt: 'Original prompt (untranslated)', copyPrompt: 'Copy prompt', task: 'Outcome', scenario: 'Scenario', identity: 'Identity', noResults: 'No matching records.' };
const $ = (selector) => document.querySelector(selector);
const t = (key) => (state.lang === 'zh' ? zh : en)[key] || key;
const localized = (source, key) => source[key]?.[state.lang === 'zh' ? 0 : 1] || key;
const cat = (key) => localized(labels, key);
const subcat = (key) => localized(secondaryLabels, key);
const esc = (value = '') => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
const img = (record) => `https://raw.githubusercontent.com/mizzlelover/portrait-prompt-atlas/main/${record.image}`;

function filtered() {
  const query = state.query.toLowerCase();
  const records = state.items.filter((record) => (state.category === 'all' || record.category === state.category) && (state.secondary === 'all' || record.sub_category === state.secondary) && (state.identity === 'all' || record.identity === state.identity) && (!query || [record.prompt, record.publisher, record.creator, record.category, record.sub_category].filter(Boolean).join(' ').toLowerCase().includes(query)));
  return state.sort === 'short' ? records.toSorted((left, right) => left.prompt.length - right.prompt.length) : records;
}
function secondaryOptions() { return state.category === 'all' ? [] : [...new Set(state.items.filter((record) => record.category === state.category).map((record) => record.sub_category))]; }
function controls() {
  const category = $('#category');
  category.innerHTML = `<option value="all">${t('allCategories')}</option>${Object.keys(labels).map((key) => `<option value="${key}">${cat(key)}</option>`).join('')}`;
  category.value = state.category;
  const secondary = $('#secondary');
  const options = secondaryOptions();
  secondary.disabled = state.category === 'all';
  secondary.innerHTML = `<option value="all">${state.category === 'all' ? t('chooseSecondary') : t('allSecondary')}</option>${options.map((key) => `<option value="${key}">${subcat(key)}</option>`).join('')}`;
  secondary.value = state.secondary;
  $('#sort').innerHTML = `<option value="recent">${t('sortRecent')}</option><option value="short">${t('sortShortest')}</option>`;
  $('#sort').value = state.sort;
}
function updateUrl() {
  const params = new URLSearchParams();
  if (state.category !== 'all') params.set('category', state.category);
  if (state.secondary !== 'all') params.set('secondary', state.secondary);
  if (state.identity !== 'all') params.set('identity', state.identity);
  if (state.query) params.set('q', state.query);
  history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
}
function render() {
  controls(); $('#search').value = state.query; $('#identity').value = state.identity;
  const records = filtered(); const visibleRecords = records.slice(0, state.visible);
  $('#resultCount').textContent = records.length;
  $('#resetFilters').hidden = state.category === 'all' && state.secondary === 'all' && state.identity === 'all' && !state.query;
  $('#grid').innerHTML = visibleRecords.length ? visibleRecords.map((record) => `<article class="card" data-id="${record.id}"><button class="card-open" type="button" aria-label="Open prompt"><div class="card-image"><img loading="lazy" src="${img(record)}" alt="${esc(subcat(record.sub_category))}"></div><div class="card-body"><div class="card-meta"><span class="badge">${esc(cat(record.category))}</span><span>${record.id}</span></div><p class="card-subcategory">${esc(subcat(record.sub_category))}</p><h3>${esc(record.prompt.replace(/\s+/g, ' ').slice(0, 95))}${record.prompt.length > 95 ? '…' : ''}</h3><p>@${esc(record.creator || record.publisher || 'unknown')}</p></div></button></article>`).join('') : `<p class="empty">${t('noResults')}</p>`;
  document.querySelectorAll('.card-open').forEach((button) => { button.onclick = () => detail(button.closest('.card').dataset.id); });
  $('#loadSentinel').hidden = state.visible >= records.length;
  updateUrl();
}
function detail(id) {
  const record = state.items.find((item) => item.id === id); const dialog = $('#detail');
  const person = record.creator ? `${t('originalCreator')}: @${record.creator}` : `${t('sourcePublisher')}: @${record.publisher || 'unknown'}`;
  $('#detailContent').innerHTML = `<div class="detail-body"><img src="${img(record)}" alt="${esc(subcat(record.sub_category))}"><h2>${esc(subcat(record.sub_category))}</h2><div class="detail-tags"><span>${t('task')}: ${esc(cat(record.category))}</span><span>${t('scenario')}: ${esc(subcat(record.sub_category))}</span><span>${t('identity')}: ${esc(record.identity)}</span></div><p class="detail-source">${esc(person)}<br>${t('provenance')}: ${esc(record.authorship)} · <a href="${record.source}" target="_blank" rel="noreferrer">${t('openSource')}</a></p><div class="prompt-label"><span>${t('prompt')}</span><button type="button" id="copyPrompt">${t('copyPrompt')}</button></div><pre class="prompt">${esc(record.prompt)}</pre></div>`;
  dialog.showModal(); document.body.classList.add('modal-open'); $('#copyPrompt').onclick = async () => { await navigator.clipboard.writeText(record.prompt); $('#copyPrompt').textContent = t('copied'); };
}
function reset() { state.category = 'all'; state.secondary = 'all'; state.identity = 'all'; state.query = ''; state.visible = 28; render(); }
function language() {
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach((element) => { element.innerHTML = t(element.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  $('#languageToggle').textContent = state.lang === 'zh' ? 'EN' : '中'; render();
}
$('#languageToggle').onclick = () => { state.lang = state.lang === 'zh' ? 'en' : 'zh'; language(); };
$('#search').oninput = (event) => { state.query = event.target.value; state.visible = 28; render(); };
$('#category').onchange = (event) => { state.category = event.target.value; state.secondary = 'all'; state.visible = 28; render(); };
$('#secondary').onchange = (event) => { state.secondary = event.target.value; state.visible = 28; render(); };
$('#identity').onchange = (event) => { state.identity = event.target.value; state.visible = 28; render(); };
$('#sort').onchange = (event) => { state.sort = event.target.value; render(); };
$('.close').onclick = () => $('#detail').close(); $('#resetFilters').onclick = reset;
$('#detail').addEventListener('close', () => document.body.classList.remove('modal-open'));
$('#copyInstall').onclick = async (event) => { await navigator.clipboard.writeText('npx skills add mizzlelover/portrait-prompt-atlas --skill gpt-image-2-portrait-library --agent claude-code codex --global --yes --copy'); event.target.textContent = t('copied'); setTimeout(() => { event.target.textContent = t('copy'); }, 1400); };
const initial = new URLSearchParams(location.search);
state.category = initial.get('category') || 'all'; state.secondary = initial.get('secondary') || 'all'; state.identity = initial.get('identity') || 'all'; state.query = initial.get('q') || '';
const sentinel = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) return; const count = filtered().length; if (state.visible < count) { state.visible += 28; render(); } }, { rootMargin: '520px 0px' });
sentinel.observe($('#loadSentinel'));
fetch('catalog.json').then((response) => response.json()).then((items) => { state.items = items; if (!items.some((item) => item.category === state.category)) state.category = 'all'; if (!items.some((item) => item.sub_category === state.secondary && item.category === state.category)) state.secondary = 'all'; $('#totalCount').textContent = items.length; language(); }).catch(() => { $('#grid').innerHTML = '<p>Catalog could not be loaded.</p>'; });
