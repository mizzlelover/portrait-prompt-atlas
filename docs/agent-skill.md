# Agent Skill / Agent 技能

`gpt-image-2-portrait-library` is a complete, installable companion to the website. The package includes a source-aware selection protocol, generated category reference, all 519 curated original-language prompt records, a command-line search utility, and an installer for Codex, Claude Code, and shared agent folders.

`gpt-image-2-portrait-library` 是网站的可安装配套能力：包内包含来源感知的选择规则、生成的分类参考、519 条清理后的原语言提示词记录、命令行检索工具，以及 Codex、Claude Code 和共享 Agent 目录的安装器。

## Install / 安装

```bash
npx skills add mizzlelover/portrait-prompt-atlas --skill gpt-image-2-portrait-library --agent claude-code codex --global --yes --copy
```

本地开发时：`npm run generate:portrait-skill && npm run install:skill`。

## Guarantees / 工作边界

1. 按真实人像场景与身份保持强度检索原语言提示词。
2. 每次输出均区分来源发布者与已核验原创作者。
3. 收录提示词逐字保留；如需修改，以单独的 Adaptation patch 表达。
4. 面向真人照片执行身份与自然感检查。
5. 没有适配记录时，明确标注为新创作提示词。

## CLI lookup / 命令行检索

```bash
gpt-image-2-portrait-library search --query "老照片" --category restoration --identity explicit
gpt-image-2-portrait-library show GI2_00000
gpt-image-2-portrait-library stats
```

Skill 内的 `references/portrait-records.json` 与网站目录由同一生成器输出；`npm test` 会验证 519 条公开提示词与 728 条原始研究池逐字一致。
