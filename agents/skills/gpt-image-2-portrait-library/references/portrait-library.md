# Portrait Prompt Atlas Reference

Generated from `data/prompts.jsonl` and `data/portrait-library.json`. This reference and `portrait-records.json` are copied with the Skill so Claude Code and Codex use the same library as the website.

## Categories

### 修复与影像保全 / Restoration & preservation
- Value: `restoration_and_preservation`
- Records: 4
- Keywords: restore, old photo, scratch, repair, 老照片, 修复, 褪色, 划痕
  - clarity_color_and_quality_recovery: 2
  - historic_and_damaged_photo: 2

### 自然精修与美化 / Natural retouch & beauty
- Value: `natural_retouch_and_beauty`
- Records: 10
- Keywords: retouch, skin texture, makeup, 自然美化, 肤质, 妆容, 毛孔
  - half_and_full_body_polish: 2
  - selfie_face_and_closeup_polish: 8

### 职业头像与形象 / Professional headshot & brand
- Value: `professional_headshot_and_brand`
- Records: 5
- Keywords: headshot, corporate, business, 职业, 商务, 证件, 企业形象
  - business_headshot_and_profile: 5

### 生活方式与旅行人像 / Lifestyle & travel portrait
- Value: `lifestyle_and_travel_portrait`
- Records: 15
- Keywords: travel, street, beach, cafe, 旅行, 街拍, 海边, 咖啡
  - daily_and_social_portrait: 11
  - travel_and_outdoor_portrait: 2
  - event_and_relationship_portrait: 2

### 时尚与编辑肖像 / Editorial & fashion portrait
- Value: `editorial_fashion_portrait`
- Records: 153
- Keywords: fashion, editorial, vogue, magazine, 时尚, 杂志, 秀场
  - beauty_and_studio_closeup: 58
  - campaign_and_magazine_portrait: 62
  - fashion_half_and_full_body_portrait: 33

### 身份锁定风格转换 / Identity-locked style transfer
- Value: `identity_locked_style_transfer`
- Records: 173
- Keywords: illustration, anime, cartoon, 插画, 动漫, 漫画, 风格化
  - illustration_and_anime_transform: 162
  - digital_and_graphic_transform: 10
  - cinematic_and_fantasy_transform: 1

### 纪念、家庭与关系影像 / Memory, family & relationship
- Value: `memory_family_and_relationship`
- Records: 4
- Keywords: family, couple, wedding, 家庭, 亲人, 情侣, 婚礼, 纪念
  - creative_portrait_scene: 2
  - creative_composite_and_poster: 2

### 创意肖像与场景表达 / Creative portrait & scene
- Value: `creative_portrait_scene`
- Records: 155
- Keywords: cinematic, surreal, creative, 电影感, 超现实, 创意
  - creative_portrait_scene: 26
  - cinematic_and_fantasy_scene: 37
  - creative_composite_and_poster: 92

## Selection rules

- 涉及真实人物、客户照片或纪念照片时，优先选择明确锁定身份的记录。 / For real people, client photos, or sentimental images, prefer records with explicit identity control.
- 收录提示词按来源原语言输出；不得翻译、润色或假装是新创作。 / Collected prompts are returned in their source language; do not translate, polish, or present them as newly authored.
- 发布者与原创作者必须分开表达；未核验时不得升级作者主张。 / Keep publisher and original creator distinct; never strengthen an unverified author claim.
- 自然美化优先保留年龄、肤质、面部特征与合理不对称，避免塑料感。 / Natural retouching should preserve age, texture, defining features, and plausible asymmetry.

## Command-line lookup

```bash
node bin/portrait-prompt-atlas.mjs search --query "老照片" --category restoration_and_preservation
node bin/portrait-prompt-atlas.mjs show GI2_00000
```

