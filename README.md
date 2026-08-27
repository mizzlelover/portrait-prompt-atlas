# Portrait Prompt Atlas

> A provenance-first research atlas for GPT Image 2 portrait editing, restoration, retouching, and identity-preserved transformations.

This project is deliberately narrower than a general prompt list. A useful portrait-editing prompt must be judged not just by visual style, but by whether it preserves the person, respects the source creator, and is safe to adapt for a real client.

## Current research corpus

- 728 deduplicated X-source prompt records dated 2026-05-27 to 2026-08-12.
- One matched result image has been downloaded for every record.
- Every record has a publisher / authorship status and a rule controlling whether its full prompt may be published.
- Current rights gate: no prompt is treated as publicly reusable merely because the X publisher is known.

The local research dataset is intentionally not committed until its authorship status has been verified record by record. The public repository will expose only records that meet the publication rule in [Copyright and attribution](docs/copyright-and-attribution.md).

## What makes a record publishable

| Status | Public display | Full prompt |
| --- | --- | --- |
| `original_creator_self_claimed` | Original creator, original X post, evidence | Allowed with attribution |
| `repost_creator_credited` | Original creator first, reposter second, evidence | Allowed with attribution |
| `publisher_unverified` | Source index only | Withheld |
| `repost_creator_unknown` / `source_not_verifiable` | Do not expose the record | Withheld |

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

- `data/prompts.jsonl` is the local, structured research master; it includes source, rights gate, image pointer and machine triage.
- `data/image-manifest.jsonl` maps every prompt record to one downloaded result image.
- `assets/images/` holds one result image per record for internal review.

These data and assets are retained locally for provenance review and are not part of the initial public commit.

## Acknowledgements

The research source pool was discovered through [Goku-OpenLab/gpt-image-2-prompts-datasets](https://huggingface.co/datasets/Goku-OpenLab/gpt-image-2-prompts-datasets), licensed CC BY 4.0. That dataset-level license does not establish who authored each X prompt; this project therefore preserves individual X-source attribution and applies the stricter record-level publication gate above.

