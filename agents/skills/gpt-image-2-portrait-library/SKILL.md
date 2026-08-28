---
name: gpt-image-2-portrait-library
description: Choose, inspect, attribute, and safely adapt original-language GPT Image 2 portrait-editing prompts from a 728-record provenance-first library. Use for portrait restoration, natural retouching, identity-preserved transformations, professional headshots, and meaningful family or memorial photos.
---

# GPT Image 2 Portrait Library

Use this Skill to turn a real portrait-editing request into a source-aware recommendation. It is designed for client work, preservation work, and public research: the prompt, source link, publisher, authorship status, evaluation fields, and website catalog are generated from one corpus.

## Source of truth

- Read `references/portrait-library.md` first for the six portrait categories and selection rules.
- Use `references/portrait-records.json` as the installed, complete source of truth. It includes all 728 original-language prompts and their hashes, source URLs, publisher/creator fields, identity controls, and risk flags.
- Use `node bin/portrait-prompt-atlas.mjs search --query "..."` to narrow candidates. Use `show <record-id>` to inspect a full record. Do not rely on memory for case IDs or attribution.

## Modes

### 1. Find a collected prompt

1. Identify the user task: `beauty_and_editorial`, `portrait_scene_upgrade`, `identity_preserved_stylization`, `memory_and_relationship`, `restoration`, or `professional_portrait`.
2. Prefer `identity_lock: explicit` when the request involves an existing person, a sentimental image, a family photo, or a client portrait.
3. Filter records by the task family, identity control, and any needed terms. Read the complete candidate prompt before presenting it.
4. Return one strongest match, or two to three clearly different matches if the request is ambiguous.

### 2. Adapt a collected prompt

Keep the collected prompt verbatim first. Then, only when asked, provide a separate **Adaptation patch** that lists exactly which variables or clauses change. Do not silently rewrite the record or call the adapted text the source prompt.

### 3. Create a new prompt

When no record fits, write a new prompt and label it **Atlas-created prompt, not a collected record**. Do not inherit a source creator or X link. For real portraits, specify identity, age, defining facial features, expression, natural skin texture, body proportions, lighting consistency, and what must not change.

## Non-negotiable language and attribution rules

- Collected prompts are always returned in their original language. Chinese stays Chinese; English stays English. Never translate, normalize, shorten, or improve the original under the same record ID.
- `original_creator_self_claimed`: name the verified creator and link the source post.
- `repost_creator_credited`: name the credited creator first and the reposter second.
- `publisher_unverified`: say “source publisher: @handle; original prompt author unverified.” Do not call the publisher the author.
- `repost_creator_unknown` or `source_not_verifiable`: say that prompt authorship is not verified.

If a prompt is shared publicly, include the X link and provenance status. Route corrections/removals to the repository issue template.

## Real-person quality gate

Before recommending or creating a prompt, check identity preservation, natural texture, a believable scene/camera/lighting combination, and that the provenance statement exactly matches the record.

## Response shape

Use this compact format:

```markdown
### Recommended record: GI2_xxxxx

Fit: [one concise sentence]
Category: [category]
Identity control: [value]
Source status: [required provenance wording] ([X source](...))

Original prompt (verbatim; original language):
```text
[verbatim source prompt]
```

Adaptation patch: [only if requested; clearly separate from the source]
```

## Maintenance

When `data/prompts.jsonl` or `data/portrait-library.json` changes, run:

```bash
npm run generate:portrait-skill
npm test
```

The generator synchronizes the website catalog and installed Skill records; do not edit generated reference files by hand.
