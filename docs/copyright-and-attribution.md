# Copyright, attribution, corrections, and removal

## Attribution rule

The X account that posted a prompt is a **publisher** unless the post or its thread provides evidence that the account wrote the prompt. The project never converts a publisher handle into an “author” label by default.

Each record keeps these fields:

- `source_publisher_handle`: account that published the source post.
- `authorship_status`: what the evidence establishes about the prompt’s original author.
- `credited_creator_handle`: original creator named by the source post, if any.
- `attribution_evidence`: the statement, link, or provenance fact supporting the label.
- `publication_rule`: whether a full prompt can appear in the public repository.

## Review outcomes

| Outcome | Required evidence | Repository treatment |
| --- | --- | --- |
| Original creator self-claimed | Explicit first-person authorship claim in the post/thread | Credit the creator and link the source post. |
| Repost with creator credited | Repost language plus an original creator handle or link | Credit the original creator prominently; list the repost separately. |
| Publisher unverified | Publisher known but authorship not demonstrated | Show index metadata only; do not publish the full prompt or image. |
| Repost creator unknown | Repost/credit language but the original creator cannot be identified | Keep only as a private review lead. |
| Source not verifiable | Deleted, anonymous, inaccessible, or ambiguous source | Do not publish. |

## Corrections and removal

If you created a prompt, own a source image, or believe a credit is inaccurate, open a GitHub issue titled `Attribution correction` or `Removal request`. Include the original post URL and the requested correction. We will promptly:

1. hide the full prompt and image while the request is reviewed;
2. correct the attribution, source link, or authorship status where evidence supports it; or
3. remove the record and its local image from future releases when requested by the creator or rights holder.

The project maintains a minimal public change note for the action taken, without republishing the disputed prompt or image.

