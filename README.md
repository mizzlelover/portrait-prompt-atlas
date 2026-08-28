# Portrait Prompt Atlas

> GPT Image 2 人像处理提示词图鉴：来源优先、保留原文、服务真实的人像修复与自然美化。

[中文说明](#中文) · [English](#english) · [在线图鉴](https://portrait-prompt-atlas.vercel.app) · [版权与署名规则](docs/copyright-and-attribution.md)

<p align="center">
  <img src="https://img.shields.io/badge/GPT%20Image%202-Portrait%20Editing-86bca7?style=flat-square" alt="GPT Image 2 Portrait Editing">
  <img src="https://img.shields.io/badge/records-728-5f9ebe?style=flat-square" alt="728 records">
  <img src="https://img.shields.io/badge/provenance-source--linked-f3ad79?style=flat-square" alt="source linked">
  <img src="https://img.shields.io/badge/license-MIT-536b87?style=flat-square" alt="MIT">
</p>

## 中文

这不是一个把提示词堆在一起的仓库，而是一套面向真人照片的可追溯图鉴：帮助你从真实需求出发，找到修复、自然美化、身份保持、职业头像和纪念照片处理的参考方案。

每条提示词都按来源原样保存：中文仍是中文，英文仍是英文；本仓库不把它们翻译成另一种语言，也不把发布账号未经核验地当成原创作者。

### 在线浏览

访问 [Portrait Prompt Atlas 在线图鉴](https://portrait-prompt-atlas.vercel.app)，可按场景和身份保持强度筛选，查看结果图、原始提示词与 X 来源链接，并一键复制。

### 当前收录

- 728 条去重后的 X 来源记录，日期范围为 2026-05-27 至 2026-08-12。
- 每条记录均有一张对应结果图、X 原帖链接、来源发布者和作者核验状态。
- 6 个围绕真实人像需求建立的方向：自然美化与编辑肖像、人像场景升级、身份保持风格化、纪念与关系影像、照片修复、职业肖像。

### 分类总览

| 方向 | 记录数 | 典型用途 |
| --- | ---: | --- |
| 自然美化与编辑肖像 | 394 | 自然美化、杂志感肖像、时尚修饰 |
| 人像场景升级 | 143 | 旅行、生活方式、影棚和电影感场景 |
| 身份保持风格化 | 104 | 插画、动漫、拼贴与艺术指导转换 |
| 纪念与关系影像 | 30 | 家庭、伴侣、生日、儿童与宠物 |
| 照片修复 | 29 | 老照片、清晰度、上色和破损修复 |
| 职业肖像 | 28 | 职业头像、企业形象与影棚输出 |

### 让 Claude Code 与 Codex 使用图鉴

仓库内置 `gpt-image-2-portrait-library` Skill。它会从同一份目录中为具体人像需求挑选提示词，并在输出中保留原始语言与来源边界。

```bash
npx skills add mizzlelover/portrait-prompt-atlas --skill gpt-image-2-portrait-library --agent claude-code codex --global --yes --copy
```

安装后可直接提出：

```text
使用 gpt-image-2-portrait-library，为一张旅行人像找一个自然、保留身份的处理方案。
```

Claude Code 也可使用插件市场：

```text
/plugin marketplace add mizzlelover/portrait-prompt-atlas
/plugin install gpt-image-2-portrait-library@portrait-prompt-atlas
```

### 署名与使用边界

| 状态 | 页面展示 | 提示词展示 |
| --- | --- | --- |
| `original_creator_self_claimed` | 已核验原创作者、原始 X 帖文、证据 | 附署名公开 |
| `repost_creator_credited` | 原创作者优先、转载者其次、证据 | 附署名公开 |
| `publisher_unverified` | 来源发布者、原始 X 链接、未核验标识 | 附来源与更正渠道公开 |
| `repost_creator_unknown` / `source_not_verifiable` | X 链接与来源未知标识 | 作为研究记录公开，不主张作者身份 |

创作者可随时提出更正或移除请求，详见[署名与更正流程](docs/copyright-and-attribution.md#corrections-and-removal)。

## English

Portrait Prompt Atlas is a provenance-first research atlas for GPT Image 2 portrait editing, restoration, retouching, and identity-preserved transformations. It retains prompts in their source language and links each record back to its X source, with a clear distinction between publisher and verified prompt author.

Browse the [live catalog](https://portrait-prompt-atlas.vercel.app) or install the included `gpt-image-2-portrait-library` skill for Claude Code and Codex:

```bash
npx skills add mizzlelover/portrait-prompt-atlas --skill gpt-image-2-portrait-library --agent claude-code codex --global --yes --copy
```

## Research corpus

- 728 deduplicated X-source prompt records dated 2026-05-27 to 2026-08-12.
- One matched result image has been downloaded for every record.
- Every record has a publisher / authorship status and a rule controlling whether its full prompt may be published.
- Current rights gate: no prompt is treated as publicly reusable merely because the X publisher is known.

The public corpus preserves the original X-source link, the source publisher where available, the attribution status, one source result image, and a correction path on every record. A publisher handle is labelled as a publisher, never silently promoted to “prompt author.”

## Portrait-specialist categories

| Category | Records | Typical use |
| --- | ---: | --- |
| Beauty and editorial | 394 | Natural beauty, magazine portraits, fashion-oriented retouching |
| Portrait scene upgrade | 143 | Travel, lifestyle, studio and cinematic scene changes |
| Identity-preserved stylization | 104 | Illustration, anime, collage and art-direction transfers |
| Memory and relationship | 30 | Family, couples, birthdays, children and pets |
| Restoration | 29 | Old-photo, clarity, color and repair-oriented workflows |
| Professional portrait | 28 | Headshots, corporate identity and professional studio output |

The category, image link, attribution state, risk flags, and rule-based evaluation are all queryable in `data/prompts.jsonl` and `data/evaluations.jsonl`.

## What makes a record publishable

| Status | Public display | Full prompt |
| --- | --- | --- |
| `original_creator_self_claimed` | Original creator, original X post, evidence | Allowed with attribution |
| `repost_creator_credited` | Original creator first, reposter second, evidence | Allowed with attribution |
| `publisher_unverified` | Source publisher, original X link, explicit unverified label | Public with attribution and correction path |
| `repost_creator_unknown` / `source_not_verifiable` | Original X link and explicit provenance-unknown label | Public as a research record; never assert an author |

Creators can request correction or removal at any time. See [correction and removal](docs/copyright-and-attribution.md#corrections-and-removal).

## Evaluation model

Each candidate is assessed through six distinct lenses, described in [the evaluation model](docs/evaluation-model.md):

1. Identity preservation
2. Natural-retouch realism
3. Technical control and failure prevention
4. Task and commercial usefulness
5. Reference-image dependency
6. Rights and safety readiness

This prevents a visually impressive but identity-breaking style transfer from being ranked alongside a reliable natural headshot retouch.

## Data layout

- `data/prompts.jsonl` is the structured research master; it includes source, rights status, image pointer and machine triage.
- `data/image-manifest.jsonl` maps every prompt record to one downloaded result image.
- `assets/images/` holds one result image per record for internal review.

The result images are retained together with their record-level source links so that a visitor can judge the prompt as a visual workflow rather than as isolated prose.

## Acknowledgements

The research source pool was discovered through [Goku-OpenLab/gpt-image-2-prompts-datasets](https://huggingface.co/datasets/Goku-OpenLab/gpt-image-2-prompts-datasets), licensed CC BY 4.0. That dataset-level license does not establish who authored each X prompt; this project therefore preserves individual X-source attribution and applies the stricter record-level publication gate above.
