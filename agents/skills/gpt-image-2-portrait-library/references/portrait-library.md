# Portrait Prompt Atlas Reference

Generated from `data/prompts.jsonl` and `data/portrait-library.json`. This reference and `portrait-records.json` are copied with the Skill so Claude Code and Codex use the same library as the website.

## Categories

### 自然美化与编辑肖像 / Beauty & editorial
- Value: `beauty_and_editorial`
- Records: 394
- Keywords: beauty, editorial, skin texture, 自拍, 写真, 妆容, 质感

### 人像场景升级 / Portrait scene upgrade
- Value: `portrait_scene_upgrade`
- Records: 143
- Keywords: travel, lifestyle, cinematic, 旅行, 场景, 氛围, 电影感

### 身份保持风格化 / Identity-preserved stylization
- Value: `identity_preserved_stylization`
- Records: 104
- Keywords: illustration, anime, collage, 风格化, 插画, 动漫, 拼贴

### 纪念与关系影像 / Memory & relationship
- Value: `memory_and_relationship`
- Records: 30
- Keywords: family, couple, child, pet, 家庭, 纪念, 合照, 亲人

### 照片修复 / Restoration
- Value: `restoration`
- Records: 29
- Keywords: restore, old photo, scratch, repair, 老照片, 修复, 褪色, 划痕

### 职业肖像 / Professional portrait
- Value: `professional_portrait`
- Records: 28
- Keywords: headshot, corporate, studio, 职业, 证件, 商务, 头像

## Selection rules

- 涉及真实人物、客户照片或纪念照片时，优先选择明确锁定身份的记录。 / For real people, client photos, or sentimental images, prefer records with explicit identity control.
- 收录提示词按来源原语言输出；不得翻译、润色或假装是新创作。 / Collected prompts are returned in their source language; do not translate, polish, or present them as newly authored.
- 发布者与原创作者必须分开表达；未核验时不得升级作者主张。 / Keep publisher and original creator distinct; never strengthen an unverified author claim.
- 自然美化优先保留年龄、肤质、面部特征与合理不对称，避免塑料感。 / Natural retouching should preserve age, texture, defining features, and plausible asymmetry.

## Command-line lookup

```bash
node bin/portrait-prompt-atlas.mjs search --query "老照片" --category restoration
node bin/portrait-prompt-atlas.mjs show GI2_00000
```

