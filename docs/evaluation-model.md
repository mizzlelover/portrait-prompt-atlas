# Portrait prompt evaluation model

## Purpose

The model separates **what a prompt asks for** from **whether it is dependable for real portrait work**. Scores are review aids, not claims that a creator endorses a use case.

## Dimensions

| Dimension | Question | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- |
| Identity preservation | Does the prompt protect the person’s recognisable features? | No instruction | Reference image only | Preserves several key features | Explicit identity lock plus anti-alteration constraints |
| Natural-retouch realism | Does it prevent plastic or over-edited results? | No realism guidance | Photorealistic label only | Skin / light / proportion controls | Natural texture, pores, asymmetry and no-over-smoothing constraints |
| Technical control | Does it reduce common generation failure? | None | Basic format only | Lighting, composition or anatomy controls | Multiple controls plus explicit negative constraints |
| Task usefulness | Is the target outcome clear and usable? | Vague aesthetic | Style-only direction | Clear portrait scenario | Clear client scenario and deliverable framing |
| Reference dependency | Is the input-photo relationship specified? | None | Implied | Reference named | Reference scope and what must / must not change are both specified |
| Rights and safety readiness | Can it safely enter a public collection? | Unknown source / prohibited context | Publisher only | Creator credited but pending review | Verified author, clear attribution, no unresolved rights flags |

## Decision bands

- `ready_for_case_study`: total 15–18 and rights readiness = 3.
- `promising_needs_human_test`: total 10–14, or visual value is high but one control dimension is weak.
- `reference_only`: total below 10 or it lacks a clear portrait-editing workflow.
- `do_not_publish`: any unresolved rights gate or an identity / official-context risk that requires specialist review.

## Required human review

Automated triage can detect explicit language such as “preserve identity,” “natural skin,” “no smoothing,” or an X `#reversed-*` source marker. It cannot judge visual fidelity, original authorship, consent, or commercial permissions. Before a case is public, a reviewer must record source evidence, visual result, rights result, and any risk flags.

