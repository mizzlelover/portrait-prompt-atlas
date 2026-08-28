const taxonomyLabels = {
  historic_and_damaged_photo: ['老照片与破损修复', 'Historic & damaged photo'],
  clarity_color_and_quality_recovery: ['清晰度、色彩与画质恢复', 'Clarity, colour & quality recovery'],
  memory_photo_preservation: ['纪念照片保全', 'Memory photo preservation'],
  selfie_face_and_closeup_polish: ['自拍、脸部与近景精修', 'Selfie, face & close-up polish'],
  half_and_full_body_polish: ['半身与全身自然精修', 'Half & full-body polish'],
  group_and_relationship_retouch: ['合照与关系影像精修', 'Group & relationship retouch'],
  business_headshot_and_profile: ['商务头像与职业主页照', 'Business headshot & profile'],
  document_and_id_photo: ['证件与身份照片', 'Document & ID photo'],
  personal_branding_half_and_full_portrait: ['个人品牌半身与全身照', 'Personal-brand half & full portrait'],
  travel_and_outdoor_portrait: ['旅行与户外人像', 'Travel & outdoor portrait'],
  daily_and_social_portrait: ['日常与社交人像', 'Daily & social portrait'],
  event_and_relationship_portrait: ['活动、约会与关系影像', 'Event & relationship portrait'],
  beauty_and_studio_closeup: ['棚拍美妆与近景肖像', 'Beauty studio & close-up'],
  fashion_half_and_full_body_portrait: ['时尚半身与全身肖像', 'Fashion half & full portrait'],
  campaign_and_magazine_portrait: ['杂志与品牌大片肖像', 'Campaign & magazine portrait'],
  illustration_and_anime_transform: ['插画、素描与动漫转换', 'Illustration, sketch & anime'],
  cinematic_and_fantasy_transform: ['电影感与奇幻转换', 'Cinematic & fantasy transform'],
  identity_locked_style_upgrade: ['保留身份的风格升级', 'Identity-locked style upgrade'],
  creative_composite_and_poster: ['创意合成与人物海报', 'Creative composite & portrait poster'],
  cinematic_and_fantasy_scene: ['电影感与奇幻场景肖像', 'Cinematic & fantasy scene'],
  creative_portrait_scene: ['创意场景人像', 'Creative portrait scene']
};
const taxonomyRoot = document.querySelector('#taxonomy');
const categoryTitle = (category) => labels[category]?.[state.lang === 'zh' ? 0 : 1] || category;
const secondaryTitle = (category) => taxonomyLabels[category]?.[state.lang === 'zh' ? 0 : 1] || category.replaceAll('_', ' ');
function renderTaxonomy(records) {
  const grouped = Object.groupBy(records, (record) => record.category);
  taxonomyRoot.innerHTML = `<p>${state.lang === 'zh' ? '两级分类：先按任务，再按具体交付物或人物范围。' : 'Two levels: choose the task first, then the concrete deliverable or portrait scope.'}</p>${Object.entries(grouped).map(([primary, items]) => {
    const children = Object.entries(Object.groupBy(items, (item) => item.sub_category));
    return `<details><summary>${categoryTitle(primary)} <b>${items.length}</b></summary><div>${children.map(([secondary, childItems]) => `<button type="button" data-secondary="${secondary}">${secondaryTitle(secondary)} <b>${childItems.length}</b></button>`).join('')}</div></details>`;
  }).join('')}`;
  taxonomyRoot.querySelectorAll('[data-secondary]').forEach((button) => button.addEventListener('click', () => {
    const target = button.dataset.secondary;
    document.querySelectorAll('.card').forEach((card) => card.hidden = !state.items.find((item) => item.id === card.dataset.id)?.sub_category.includes(target));
  }));
}
fetch('catalog.json').then((response) => response.json()).then((records) => {
  renderTaxonomy(records);
  new MutationObserver(() => renderTaxonomy(records)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
});
