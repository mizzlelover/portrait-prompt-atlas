# Public release gate

The public repository is not a mirror of a scraped prompt corpus. A record becomes public only after all required gates pass.

| Gate | Required proof | Current corpus result |
| --- | --- | --- |
| Prompt attribution | Original creator self-claim, or an explicit repost credit to the original creator | 0 / 728 complete |
| Source-image permission | A publishable source-image basis, or creator permission | 0 / 728 complete |
| Correction path | Issue template and correction / removal procedure present | Complete |
| Prompt evaluation | Rule-based triage plus a human result review | Rule-based triage complete; human review pending |
| Image pairing | One locally downloaded result image linked to each record | 728 / 728 complete |

## Why the gate is strict

An X permalink can identify a publisher, but it cannot establish that the publisher wrote the prompt or owns the generated image. Publishing the source text and image before that distinction is resolved would conflict with the project’s stated attribution promise.

## Release sequence

1. Review source post and thread.
2. Capture explicit author or repost-credit evidence.
3. Ask the creator for correction where the source is ambiguous.
4. Mark the record publishable only when its source and image basis are documented.
5. Export the public gallery from only publishable records.

The local corpus remains available for private provenance review. It is excluded from the initial public Git commit by `.gitignore`.

