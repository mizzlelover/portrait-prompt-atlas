# Portrait Prompt Atlas

> A provenance-first research atlas for GPT Image 2 portrait editing, restoration, retouching, and identity-preserved transformations.

This project is deliberately narrower than a general prompt list. A useful portrait-editing prompt must be judged not just by visual style, but by whether it preserves the person, respects the source creator, and is safe to adapt for a real client.

## Current research corpus

- 728 deduplicated X-source prompt records dated 2026-05-27 to 2026-08-12.
- One matched result image has been downloaded for every record.
- Every record has a publisher / authorship status and a rule controlling whether its full prompt may be published.
- Current rights gate: no prompt is treated as publicly reusable merely because the X publisher is known.

The public corpus preserves the original X-source link, the source publisher where available, the attribution status, one source result image, and a correction path on every record. A publisher handle is labelled as a publisher, never silently promoted to “prompt author.”

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
