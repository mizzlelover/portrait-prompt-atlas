# Portrait Prompt Atlas Reference

Generated from `data/prompts.jsonl` and `data/portrait-library.json`. This reference and `portrait-records.json` are copied with the Skill so Claude Code and Codex use the same library as the website.

## Categories

### 修复与影像保全 / Restoration & preservation
- Value: `restoration_and_preservation`
- Records: 59
- Keywords: restore, old photo, scratch, repair, 老照片, 修复, 褪色, 划痕

### 自然精修与美化 / Natural retouch & beauty
- Value: `natural_retouch_and_beauty`
- Records: 143
- Keywords: retouch, skin texture, makeup, 自然美化, 肤质, 妆容, 毛孔

### 职业头像与形象 / Professional headshot & brand
- Value: `professional_headshot_and_brand`
- Records: 13
- Keywords: headshot, corporate, business, 职业, 商务, 证件, 企业形象

### 生活方式与旅行人像 / Lifestyle & travel portrait
- Value: `lifestyle_and_travel_portrait`
- Records: 29
- Keywords: travel, street, beach, cafe, 旅行, 街拍, 海边, 咖啡

### 时尚与编辑肖像 / Editorial & fashion portrait
- Value: `editorial_fashion_portrait`
- Records: 40
- Keywords: fashion, editorial, vogue, magazine, 时尚, 杂志, 秀场

### 身份锁定风格转换 / Identity-locked style transfer
- Value: `identity_locked_style_transfer`
- Records: 222
- Keywords: illustration, anime, cartoon, 插画, 动漫, 漫画, 风格化

### 纪念、家庭与关系影像 / Memory, family & relationship
- Value: `memory_family_and_relationship`
- Records: 45
- Keywords: family, couple, wedding, 家庭, 亲人, 情侣, 婚礼, 纪念

### 创意肖像与场景表达 / Creative portrait & scene
- Value: `creative_portrait_scene`
- Records: 80
- Keywords: cinematic, surreal, creative, 电影感, 超现实, 创意

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

