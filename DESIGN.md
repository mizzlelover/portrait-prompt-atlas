# Portrait Prompt Atlas Design System

## 0. Research Log

- Reference site: `gpt-image2.canghe.ai` is the interaction reference for a searchable prompt-gallery workflow. Its live interaction surface could not be inspected because the managed browser policy was unavailable; the adaptation therefore preserves the observable gallery pattern, not its branding or dark visual language.
- Existing surface: extracted the current mint, sky and peach palette, editorial typography and card-gallery pattern; the redesign keeps this user-approved light, human portrait tone.

## 1. Atmosphere & Identity

An airy editorial dressing room for photographs with memories attached. The signature is a soft paper field with pale colour washes and a compact “choose a need, then open a proof” gallery: source information is never hidden behind the prettiness.

## 2. Color

| Role | Token | Value | Usage |
|---|---|---|---|
| Paper | `--paper` | `#fbfdfb` | page canvas |
| Ink | `--ink` | `#1d2f35` | primary text and primary action |
| Muted | `--muted` | `#64777a` | supporting text |
| Line | `--line` | `#dce8e4` | quiet separation |
| Mint | `--mint` | `#dff6e9` | restorative accents |
| Sky | `--sky` | `#e2f3fb` | identity/reference accents |
| Peach | `--peach` | `#ffe8d8` | beauty/editorial accents |
| Sun | `--sun` | `#fff4bf` | memory accents |
| Success | `--success` | `#376f5c` | verified / traceable states |

## 3. Typography

- Display: `DM Sans, Noto Sans SC, sans-serif`, clamp 48–104px, 600, tight tracking.
- Body: `DM Sans, Noto Sans SC, sans-serif`, 14–18px.
- Metadata and code: `DM Mono, monospace`, 11–13px.
- A Georgia serif italic is reserved for one soft emphasis per major heading.

## 4. Spacing & Layout

Base unit is 4px. Named steps: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px. Content width is 1184px with 28px desktop / 18px phone gutters. Gallery changes from four to two columns below 800px.

## 5. Components

### Need chips
- Structure: button cluster with count.
- States: default, hover, selected, focus.
- Accessibility: buttons use `aria-pressed`; keyboard selectable.
- Motion: transform and background/opacity only, 160ms.

### Prompt card
- Structure: image, task badge, source identity, prompt excerpt, quick actions.
- States: default, hover, focus, selected; opens a detail dialog.
- Accessibility: semantic button action, visible focus, descriptive image alt.

### Detail dialog
- Structure: image evidence, provenance, original-language prompt, copy and source actions.
- States: open, copied, closed.
- Accessibility: native modal focus handling, Escape close, labelled close button.

### Library controls
- Structure: search, category/identity selectors, sort, result count, saved filter state.
- States: default, filtered, empty, loading.
- Accessibility: explicit labels and live result count.

## 6. Motion & Interaction

Use 140ms ease-out for presses, 220ms ease-in-out for chip/card transitions, and 420ms `cubic-bezier(.16,1,.3,1)` for dialog/hero entry. Animate only transform and opacity. Respect `prefers-reduced-motion`.

## 7. Depth & Surface

Mixed: quiet `--line` borders plus one soft lifted shadow on interactive cards. Pale washes identify a task area; they never communicate status alone.

## 8. Accessibility Constraints & Accepted Debt

- Target WCAG 2.2 AA: visible keyboard focus, 4.5:1 body contrast, labelled controls, no essential hover-only action and reduced-motion support.
- Accepted debt: no user account or server persistence; saved prompts remain a local-browser convenience until a future backend is added.
