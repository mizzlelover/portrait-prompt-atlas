---
name: gpt-image-2-portrait-library
description: Find an original-language GPT Image 2 portrait-editing prompt from Portrait Prompt Atlas, preserve its provenance, and adapt only with clear attribution boundaries.
---

# GPT Image 2 Portrait Library

Use this skill when a request involves portrait restoration, natural retouching, identity-preserved enhancement, a professional headshot, a meaningful family photo, or a portrait style upgrade.

## Source of truth

- Read `data/prompts.jsonl` for the full original-language prompt and record-level provenance.
- Use `site/catalog.json` only for quick filtering and website-compatible metadata.
- Never translate, normalize, or silently rewrite a collected prompt. Chinese prompts stay Chinese and English prompts stay English.

## Selection workflow

1. Identify the user task: `beauty_and_editorial`, `portrait_scene_upgrade`, `identity_preserved_stylization`, `memory_and_relationship`, `restoration`, or `professional_portrait`.
2. Prefer `identity_lock: explicit` when the request involves an existing person, a sentimental image, a family photo, or a client portrait.
3. Filter records by the task family, identity control, and any needed terms. Read the complete candidate prompt before presenting it.
4. Return the original prompt verbatim in a copyable code block. Do not translate it.
5. Add a concise provenance line containing the X source URL and the authorship status.

## Attribution boundary

- `original_creator_self_claimed`: name the verified creator and link the source post.
- `repost_creator_credited`: name the credited creator first and the reposter second.
- `publisher_unverified`: say “source publisher: @handle; original prompt author unverified.” Do not call the publisher the author.
- `repost_creator_unknown` or `source_not_verifiable`: say that prompt authorship is not verified.

If a user asks for a public collection, include the source link and provenance wording. If the user requests a derivative, state which sections are being changed and preserve the source attribution. If they want a newly written prompt, create a new prompt instead of claiming that it came from this library.

## Safety for real people

For portrait edits, explicitly preserve identity, age, ethnicity, defining facial features, expression, and natural skin texture unless the user clearly asks for a change. Do not make a source prompt's creator claim stronger than the record supports.

## Response shape

Use this compact format:

```markdown
### Recommended record: GI2_xxxxx

Why it fits: [one sentence]

Source status: [required provenance wording] ([X source](...))

Original prompt (unchanged):
```text
[verbatim source prompt]
```

Suggested adaptation boundary: [only if the user asked for one]
```

