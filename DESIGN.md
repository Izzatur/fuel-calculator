---
name: Fuel Calculator
description: A live timing screen that holds a fuel plan instead of a field — ruled columns, tabular figures, flat ink.
colors:
  ground: "#14171A"
  panel: "#1A1E22"
  row-alt: "#1E2328"
  rule: "#272D33"
  rule-strong: "#333B43"
  ink: "#E9ECEF"
  ink-mid: "#A8B1B9"
  ink-dim: "#7C868E"
  best: "#7C4DD6"
  best-ink: "#C4A9FF"
  ok: "#2FBF6B"
  ok-ink: "#6FE0A2"
  warn: "#F2B705"
  warn-ink: "#F7CF57"
  on-best: "#FFFFFF"
  on-warn: "#1A1400"
typography:
  display:
    fontFamily: "Martian Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "96px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum 1"
    note: "the ≥1000px step"
  display-compact:
    fontFamily: "Martian Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "80px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum 1"
    note: "the ≥640px step"
  display-mobile:
    fontFamily: "Martian Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "64px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum 1"
    note: "the base step, under 640px"
  headline:
    fontFamily: "Martian Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.01em"
    fontFeature: "tnum 1"
  title:
    fontFamily: "Martian Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "tnum 1"
    note: "lead readout, ≥640px"
  title-compact:
    fontFamily: "Martian Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "tnum 1"
    note: "lead readout, base"
  title-mobile:
    fontFamily: "Martian Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "tnum 1"
    note: "lead readout, under 640px"
  readout:
    fontFamily: "Martian Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "tnum 1"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  data:
    fontFamily: "Martian Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.01em"
    fontFeature: "tnum 1"
  note:
    fontFamily: "system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.12em"
  section-head:
    fontFamily: "system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  none: "0px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
components:
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px 16px 32px"
  panel-wide:
    padding: "24px 32px 32px"
  strip:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "68px"
  readout-lead:
    textColor: "{colors.best-ink}"
    typography: "{typography.title}"
    padding: "0 16px 0 0"
  input-figure:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "4px 0"
  input-figure-focus:
    textColor: "{colors.ink}"
  input-text:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px"
    size: "14px"
  input-text-focus:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
  input-over:
    backgroundColor: "transparent"
    textColor: "{colors.ok-ink}"
    rounded: "{rounded.none}"
    padding: "2px 0"
    width: "3.5ch"
    size: "14px"
  button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
    size: "11px"
  button-hover:
    backgroundColor: "{colors.row-alt}"
    textColor: "{colors.ink}"
  button-active:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.ink}"
  seg-option:
    backgroundColor: "transparent"
    textColor: "{colors.ink-mid}"
    rounded: "{rounded.none}"
    padding: "12px 8px"
    size: "12px"
  seg-option-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  tag-best:
    backgroundColor: "{colors.best}"
    textColor: "{colors.on-best}"
    rounded: "{rounded.none}"
    padding: "1px 6px"
    size: "11px"
  tag-bad:
    backgroundColor: "{colors.warn}"
    textColor: "{colors.on-warn}"
    rounded: "{rounded.none}"
    padding: "1px 6px"
    size: "11px"
  flag-rail-best:
    backgroundColor: "{colors.best}"
    width: "4px"
  flag-rail-ok:
    backgroundColor: "{colors.ok}"
    width: "4px"
  flag-rail-bad:
    backgroundColor: "{colors.warn}"
    width: "4px"
  table-row:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-mid}"
    rounded: "{rounded.none}"
    padding: "12px"
  table-row-alt:
    backgroundColor: "{colors.row-alt}"
    textColor: "{colors.ink-mid}"
  table-row-best:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.best-ink}"
  table-row-bad:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.warn-ink}"
  preset-row:
    backgroundColor: "{colors.row-alt}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 8px 8px 12px"
---

# Design System: Fuel Calculator

## Overview

**Creative North Star: "The Timing Screen"**

This is the live timing tabulation a racer already reads mid-session, holding a fuel plan instead of a field of cars. Everything about it is borrowed from a surface built to be scanned under time pressure by someone whose attention is mostly elsewhere: a near-black charcoal ground, columns separated by hairline rules rather than air, uppercase letterspaced column heads, and every single figure set in one tabular monospace so that a value updating on keystroke never nudges the column beside it. It is dense on purpose. Density is not a compromise here; it is what a timing screen is.

The register is instrument, not dashboard. The category this product sits in ships neon telemetry — glowing gauges, gradient meters, glassy cards — and this build refuses all of it. Every fill is a single flat ink. There is no shadow, no gradient, no glass, no glow, and no rounded corner anywhere in the stylesheet. Depth is carried entirely by two devices: a one-pixel rule, and a four-value step of near-black tint between ground, panel and alternating row. The only three saturated colours in the system — purple, green, amber — never appear as decoration. They are the timing vocabulary: fastest viable, viable, over a limit. If a surface wants colour for its own sake, this system has none to give it.

The counterweight to all that density is a single enormous figure. The recommended fuel load renders at 96px in Martian Mono 600 in the accent purple, and it is the only element on the page allowed that scale. A racer glancing over from a running rig gets the answer from across the room; everything else — the basis sentence, the six-row breakdown, the ten-column strategy tabulation — is there for the driver who leans in. The sticky session strip guarantees that the answer never scrolls away, and at 1920 it runs full-bleed edge to edge while its contents stay locked to the same 1600px shell the columns below it use.

**Key Characteristics:**
- Charcoal ground (#14171A) with panels one tint step up; a dark-only surface, declared via `color-scheme: dark`
- Absolutely flat: no shadow, gradient, glass, glow, or blur in the entire system
- Every corner square; zero border-radius on every surface, control and tag
- Self-hosted Martian Mono at 400/500/600 carries every figure, from a 12px table cell to the 96px load
- Three status colours, load-bearing only, each redundantly coded with a word
- Hairline structure: 1px rules and 1px grid gaps that reveal the layer beneath
- One 96px figure as the whole page's answer; everything else is reference density

## Colors

A near-black charcoal ground stepped through four barely-separated tints, lit by exactly three saturated inks that only ever report a state.

### Primary

- **Session-Best Purple** (`{colors.best}`): The fastest viable strategy. It fills the 4px flag rail on the leading row, the `Fastest` tag, the focus ring's parent hue, the text selection highlight, and the input underline on focus. It is the colour of *the decision*, and it appears on well under a tenth of the screen.
- **Session-Best Purple Ink** (`{colors.best-ink}`): The legible-on-charcoal sibling of the purple, used wherever the accent has to be read as a figure rather than seen as a mark — the 96px load value, the `LOAD` lead readout in the strip, the fastest row's figures, the `Start load` action row in the breakdown, and every focus outline. Never used as a fill.

### Secondary

- **Viable Green** (`{colors.ok}`): The flag rail on any strategy that clears every limit the racer stated — tank capacity, an optional stint limit, or both — and the underline on a focused "over N laps" field.
- **Viable Green Ink** (`{colors.ok-ink}`): The derived per-lap figures under the entry grid, and the "over N laps" lap-count value — the numbers the product computes *for* you rather than the ones you typed. This is the one place the green carries meaning outside the strategy table, and the meaning is the same: this figure is sound.

### Tertiary

- **Over-Limit Amber** (`{colors.warn}`): The flag rail and the `Over tank` or `Over stint` tag on a strategy that breaks a stated limit, and the strike-through line laid across the figures that overran — litres when the tank is the problem, laps and stint time when the stint limit is.
- **Exceeds-Tank Amber Ink** (`{colors.warn-ink}`): Amber text — the whole non-viable row, the error state of the derived line, and the delete control on hover.

### Neutral

- **Charcoal Ground** (`{colors.ground}`): The page beneath everything, the text-field well, and the ink colour on the one inverted surface (the selected segment of the race-format control). Also the `theme-color`.
- **Panel Charcoal** (`{colors.panel}`): Every panel, every grid cell, every table row at rest, and the strip. One tint step up from ground.
- **Alternating Row** (`{colors.row-alt}`): Even rows of the strategy tabulation, saved-setup rows, and the button hover fill. A second tint step, just enough to track a row across ten columns.
- **Hairline Rule** (`{colors.rule}`): The default separator between peers — column dividers, row bottoms, breakdown rows, grid gaps, the legend's top rule. Also the button's active-state fill.
- **Strong Rule** (`{colors.rule-strong}`): The heavier separator that closes a section or bounds a control — under a panel head, under a table head, around the segmented control and text fields, the input underline at rest, the total row's bottom edge, the scrollbar thumb.
- **Ink** (`{colors.ink}`): Primary reading text and every entered or tabulated figure.
- **Mid Ink** (`{colors.ink-mid}`): Supporting prose, breakdown terms, table cells that are not the primary figure, and unselected segment labels.
- **Dim Ink** (`{colors.ink-dim}`): Labels, column heads, units, hints, footer, and the ellipsised session line. The quietest legible step.
- **On-Best / On-Warn** (`{colors.on-best}` / `{colors.on-warn}`): The two ink colours that ride on a saturated fill — white on the purple tag and the selection highlight, near-black brown on the amber tag.

### Named Rules

**The Timing Vocabulary Rule.** Purple, green and amber report viability and nothing else. Purple is *fastest viable*, green is *viable*, amber is *over a stated limit*. They are never used for branding, emphasis, hierarchy, category, or delight. A new surface that wants an accent colour does not get one — it gets a tint step or a rule weight.

**The Never Colour Alone Rule.** Every status colour ships with a word. The purple rail carries a `Fastest` tag, the amber rail carries `Over tank` or `Over stint` — naming the limit, not merely reporting failure — both carry visually-hidden status text for screen readers, the legend spells all three out, and every figure that overran is struck through as well as recoloured. Remove all colour from this page and every state is still readable. That is the test.

**The Purple Belongs to the Answer Rule.** The accent marks the single decision the driver leaves with, and follows it wherever it appears: the 96px load, the `LOAD` readout, the fastest row, the `Start load (stint 1 of N)` line, the focus ring, the selection. It never marks a heading, a border, a brand mark, or a call to action.

## Typography

**Display Font:** Martian Mono (self-hosted woff2 at 400/500/600, SIL OFL 1.1, with `ui-monospace, Cascadia Mono, Consolas, monospace` behind it)
**Body Font:** system sans stack (`system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif`)

**Character:** A wide, engineered, slightly mechanical monospace doing all the numeric work against a quiet, unremarkable system sans doing all the verbal work. The mono is the voice of the instrument; the sans is the voice of the person explaining it. The pairing reads as a readout with annotations, which is exactly what the page is.

### Hierarchy

- **Display** (`{typography.display}`): The recommended fuel load only. 64px on phones, 80px from 640px, 96px from 1000px, in the accent purple ink with its unit set beside it in 20px dim uppercase. Exactly one instance per screen.
- **Headline** (`{typography.headline}`): Values inside entry fields. Large enough to check a transcribed number at a glance without magnifying the form.
- **Title** (`{typography.title}`): The `LOAD` lead readout in the sticky strip — the display figure's small persistent echo, in the same purple ink.
- **Readout** (`{typography.readout}`): The secondary strip figures (race laps, fuel per lap) in plain ink.
- **Body** (`{typography.body}`): The document base. Explanatory prose renders one or two steps down from it — 13px for the load basis, 12px for hints, table notes and the footer — never above it.
- **Data** (`{typography.data}`): Table cells and breakdown values. Numeric cells go mono and right-aligned; term columns stay sans and left-aligned.
- **Note** (`{typography.note}`): Hints, the strategy note, the legend, and the footer, in dim ink.
- **Label** (`{typography.label}`): Field labels, uppercase, dim. The tightest-tracked of the three uppercase steps.
- **Section Head** (`{typography.section-head}`): Panel titles, uppercase at the widest tracking (0.14em), dim, sitting above a strong rule. The column heads of the tabulation are the same size and weight at 0.06em, and the strip's readout labels at 0.08em — the tracking loosens as the label's scope widens.

### Named Rules

**The One Mono Rule.** Martian Mono is self-hosted at all three weights and carries every figure on the page, including the 96px load. Delegating the display voice to whatever mono the OS happens to ship — Consolas, SF Mono, Liberation Mono — is three different designs. The fallback stack exists for the swap window, not as an accepted outcome.

**The Figures Mono, Words Sans Rule.** A line that carries figures is set in the mono; a line that carries only words is set in the sans. This holds down to the exception that proves it: the `Fastest`, `Over tank` and `Over stint` tags sit inside mono table cells and explicitly force the sans back on, because they are words.

**The No-Shift Rule.** Every numeric surface sets `tabular-nums` and `tnum`. Figures recompute on every keystroke, and a column that reflows while a driver is reading it has failed. Tightened by -0.01em to keep the wide mono from sprawling.

**The Two-Case Rule.** Uppercase belongs to labels — section heads, field labels, column heads, units, buttons, tags. Prose and figures are never uppercased. Uppercase always carries letterspacing (0.04em–0.14em), and letterspaced text is never below 11px.

## Layout

The shell is capped at **1600px** (`--shell`) and centred. Below 1000px the page is a single column of stacked panels; from 1000px it becomes a two-column grid at `minmax(360px, 4fr) 6fr`, widening to `minmax(420px, 4fr) 7fr` at 1400px. Panel placement is explicit rather than flow-ordered: session entry and saved setups hold the narrow left rail, fuel load and the strategy tabulation hold the wide right, so neither column strands a dead region when one side runs short.

The entry grid is one column below 640px and two columns above it. Exactly one of the two race-format cells is hidden at a time, so six cells are always in play and the two-column grid always fills — no bare rule-coloured slot is left behind and no cell has to span to cover one. Panel padding steps with the viewport: `24px 16px 32px` on phones, `24px 24px 32px` from 640px, `24px 32px 32px` from 1000px, and the sticky strip's inline padding tracks the same steps so its contents stay aligned to the columns beneath it.

Spacing runs on a seven-step 4px-based rhythm (4 / 8 / 12 / 16 / 24 / 32 / 48). Vertical rhythm inside a panel is dominated by 24px (head-to-content) and 16px (block-to-block); intra-control spacing is 8px and 12px.

Below 640px two things change shape rather than merely reflowing. The strip breaks into **two courses** — mark on the first, the three readouts spread edge to edge on the second — and the redundant session line is dropped rather than ellipsised. The ten-column strategy tabulation becomes **one card per strategy**: the table head goes visually hidden, rows become blocks, and each cell prints its `data-label` as a left-hand caption with the value right-aligned opposite. The stop count promotes to 18px and takes a rule beneath it as the card's own head. A horizontal scrollbar was available and was refused.

### Named Rules

**The Hairline Grid Rule.** Separators are not borders on the thing being separated — they are the layer beneath showing through a 1px gap. The main grid and the entry grid both set a rule-coloured background and a 1px gap, and the panels sit on top. This is why the seams stay perfectly consistent across a responsive grid where borders would double up or drop out.

**The Own Measure Rule.** At 1600px a term and its value can end up a thousand pixels apart and the pairing stops reading. Every prose or paired block therefore carries its own cap, independent of the shell: 44rem on the load breakdown and the result panel's head rule, 46ch on the load basis, 60ch on the strategy note, 70ch on the footer paragraphs. The container is wide; the reading is not.

**The Full-Bleed Strip Rule.** The session strip spans the full viewport — a timing strip that stops short of the display edge reads as a floating panel. Its contents are pulled back to the shell with `padding-inline: calc(max(0px, (100% - 1600px) / 2) + <panel padding>)` so they still line up with the columns below.

**The Safe-Area Rule.** The sticky strip adds `env(safe-area-inset-top)` to its top padding and the body adds `env(safe-area-inset-bottom)`; the viewport meta ships `viewport-fit=cover`. The phone is a first-class surface, not a narrow desktop.

## Elevation & Depth

**This system has no shadows.** There is not one `box-shadow`, `text-shadow`, `filter`, `backdrop-filter` or gradient in the stylesheet, and nothing is translucent except a single animation frame. Depth is conveyed by two devices only, and they are both extremely quiet.

The first is **tonal stepping**: four near-black values (`ground` → `panel` → `row-alt` → `rule`) separated by roughly a single tint step each. A panel reads as sitting on the ground because it is four points lighter, not because it casts anything. The second is the **rule**, in two weights: `{colors.rule}` separates peers and `{colors.rule-strong}` closes a section or bounds a control. Nothing floats, nothing lifts on hover, nothing has a z-plane except the sticky strip (`z-index: 10`), which earns it by function rather than by appearance — it changes nothing about its own styling when it overlaps content.

### Named Rules

**The Flat Ink Rule.** Every fill is one flat colour. No gradient, no glass, no glow, no shadow, no blur, at any state including hover, focus and active. If a new surface needs to read as raised, it steps a tint or takes a rule — those are the only two moves available.

**The Two-Weight Rule.** Rules come in exactly two weights and they mean different things. `{colors.rule}` divides peers of equal standing (columns, rows, grid cells). `{colors.rule-strong}` marks a boundary — the end of a heading, the edge of a control, the bottom of a total. Never use a third weight or a third colour to separate things.

## Shapes

The form language is **rectilinear and ruled**. Every corner in the system is square: there is no `border-radius` declaration anywhere, on any panel, control, field, button, tag or flag. Surfaces are rectangles butted against each other with a hairline between; the page reads as a table of contents in the literal sense.

Controls are defined by **edges rather than boxes**. Numeric entry fields are transparent with a 2px bottom rule that turns purple on `:focus-within`, so the figure sits on a line rather than inside a well. The "over N laps" sub-field takes a 1px bottom rule that turns green. Only the two sans-serif text fields (setup name, share URL) get a full 1px box with a ground-coloured well — they hold words, not readouts, and the different shape says so.

Status is a **rail, not a badge**. Viability renders as a 4px vertical bar filling the left edge of the row (40px minimum height on the table, full row height on mobile cards), and as a 3px × 12px chip in the legend. Tags are hard rectangles with 1px/6px padding and no radius. Nothing in this system is pill-shaped, circular, or clipped.

### Named Rules

**The Zero Radius Rule.** Radius is `0` everywhere, permanently. A rounded corner in this world reads as a consumer app and breaks the instrument register on contact.

**The Underline-Not-Box Rule.** A field that holds a figure is an underline. A field that holds prose is a box. The shape tells you which kind of value is expected before you read the label.

## Components

### Session Strip

The page's answer, pinned. A sticky, full-bleed header (68px minimum, `z-index: 10`) on panel charcoal with a strong bottom rule. Left: the product name in 13px/14px uppercase 600 and, beneath it, the live session line in mono dim (race length · average lap · fuel per lap), ellipsised rather than wrapped. Right: three definition-list readouts, right-aligned, separated by 1px left rules — race laps and fuel per lap in plain ink at 17px, and `LOAD` as the lead readout in purple ink at 24px (28px from 640px), with its divider dropped so the accent figure sits flush to the shell edge. Under 640px it wraps to two courses, the mark row and the readouts row, the readouts spread `space-between`, the lead readout right-aligned at 22px, and the session line hidden as redundant with the readouts.

### Panels

- **Corner Style:** square (`{rounded.none}`)
- **Background:** `{colors.panel}` on a rule-coloured grid, so seams are 1px gaps rather than borders
- **Shadow Strategy:** none — see Elevation & Depth
- **Border:** none of its own; the grid gap supplies every edge
- **Internal Padding:** `24px 16px 32px`, stepping to `24px 24px 32px` at 640px and `24px 32px 32px` at 1000px
- **Head:** 11px uppercase 600 at 0.14em tracking in dim ink, 8px of padding below it, a strong rule under that, then 24px of clearance

### Buttons

- **Shape:** square (`{rounded.none}`), 1px strong-rule border
- **Default:** transparent fill, ink text, 11px uppercase 600 at 0.12em, `12px 16px` padding
- **Hover:** fill steps to the alternating-row tint, border lifts to dim ink, over 120ms linear
- **Active:** fill steps to the rule colour
- **Wide variant:** the same button set to `flex: 1 1 auto` to span its row (used for "Copy shareable link")
- **Ghost variants:** the preset load button is borderless ink text that turns purple ink on hover; the delete button is borderless dim text that turns amber ink and reveals a strong-rule border on hover

### Segmented Control

- **Style:** a two-column grid inside a 1px strong-rule box, with 1px strong-rule dividers between segments and none after the last. Real radio inputs, visually hidden but focusable.
- **Unselected:** transparent on panel, mid ink, 12px uppercase 500 at 0.08em
- **Selected:** the one inverted surface in the system — full ink fill with ground-coloured text
- **Focus:** the checked label takes a 2px purple-ink outline inset by 2px so the ring stays inside the control's own box

### Inputs / Fields

- **Figure fields:** transparent, borderless, 26px mono 500 tabular, sitting on a 2px strong-rule bottom edge with its unit baseline-aligned beside it in 12px dim uppercase. The native focus ring is suppressed; focus is signalled by the underline turning purple over 120ms. The whole assembly is a flex `unitbox` so a value and its unit never separate.
- **"Over N laps" sub-field:** the product's differentiator, rendered small and deliberately unlike a primary field — 3.5ch wide, 14px mono 600 in green ink on a 1px bottom rule that turns green on focus, wrapped in 11px uppercase dim text reading `over __ lap(s)` with the plural driven live off the value.
- **Text fields:** 1px strong-rule box with a ground-coloured well, 14px sans (12px mono for the read-only share URL), `12px` padding, dim placeholder. Focus replaces the border colour with solid purple rather than adding a ring.
- **Error state:** there is no per-field error styling. Invalid input resolves to a stated condition in the derived line, which turns amber ink, and the figures fall back to an em dash. Nothing ever renders `NaN`.

### Fuel Load Figure

The page's one display element. A baseline-aligned pair: the value in 64/80/96px mono 600 purple ink, and `L` in 20px dim uppercase. Beneath it, a 13px basis sentence capped at 46ch stating exactly what the figure includes, then a two-column definition list capped at 44rem where terms sit left in mid ink and values sit right in mono. Rows are separated by hairlines. Two rows carry weight: `is-total` (the sum — 600 weight, full ink, strong rule beneath) and `is-action` (the litres to actually pour in — 600 weight in purple ink, because it is the same decision the fastest strategy names).

### Strategy Tabulation

The element the whole direction is named after, and the system's signature.

- **Structure:** a ten-column table, collapsed borders, 13px. Column heads in 11px uppercase 600 dim at 0.06em over a strong rule. Body rows carry a hairline bottom and an alternating tint on evens.
- **Ruled columns:** every cell takes a 1px left rule from its predecessor, except the leading stops column. Whitespace alone was explicitly not enough — the ruling is the point.
- **Flag rail:** a 4px column at the far left, zero padding, filled purple (fastest viable), green (viable) or amber (over a stated limit), with visually-hidden status text beside it in its own box.
- **Status coding:** the best row's stops and figures turn purple ink and take a `Fastest` tag; a non-viable row turns entirely amber ink and takes an `Over tank` or `Over stint` tag naming the limit it breaks. The struck figures are the ones that actually overran — start load and fuel per stint for the tank, laps per stint and stint time for the stint limit — so a row that breaks both is struck in four places.
- **Tags:** hard rectangles, 11px sans 700 uppercase at 0.04em, `1px 6px`, white on purple or near-black on amber, offset 8px from the figure.
- **Legend:** always present beneath the note, above a hairline, spelling out all three states in 11px uppercase dim beside 3px × 12px flag chips.
- **Mobile:** one card per strategy with the flag rail running the full card height down the left edge, `data-label` captions on the left of each row, values right, and the stop count promoted to 18px above its own rule.

### Signature Interaction: The Session-Best Flash

When the fastest viable strategy changes — a tank size edited, a lap time corrected — the new leading row takes the purple flag the way a timing screen announces a session best: a single 620ms `ease-out` wash from `rgba(124, 77, 214, 0.30)` to transparent, then settled. It is a low-alpha wash rather than a solid fill precisely because the figures must stay readable during the one moment the design stages as its announcement. The class is stripped after 700ms so it can fire again, it never fires on first paint, and `prefers-reduced-motion` removes it along with every transition on the page.

### Motion

Motion is functional and almost absent. Two durations exist: **120ms linear** for state transitions (input underline colour, button background and border), and **620ms ease-out** for the one announcement. There is no entrance animation, no scroll effect, no hover lift, and no transform anywhere. Under `prefers-reduced-motion: reduce` the flash is removed and all transitions are disabled globally.

### Focus & Selection

Focus is a 2px solid purple-ink outline offset 2px, applied globally via `:focus-visible`, with two overrides where the offset would break a boundary: the segmented control insets it by -2px, and the two field types replace it with a coloured edge. Text selection is repainted purple with white text — selecting figures is the highest-traffic act on a page built for transcription, and the default system blue is a foreign ink here. The scrollbar is themed to match (strong-rule thumb on ground track, 12px, dim on hover).

## Do's and Don'ts

### Do:

- **Do** set every figure in Martian Mono with `tabular-nums` and `tnum`, at 400, 500 or 600 — the three weights that are actually self-hosted.
- **Do** separate surfaces with a 1px gap over a rule-coloured parent rather than a border on the child (The Hairline Grid Rule).
- **Do** give every prose or paired block its own measure (44rem / 46ch / 60ch / 70ch are the established caps) independent of the 1600px shell.
- **Do** pair every status colour with a word and, for impossible figures, a strike-through — the page must survive being read in greyscale.
- **Do** use exactly two rule weights: `{colors.rule}` between peers, `{colors.rule-strong}` at a boundary.
- **Do** make a figure field an underline and a prose field a box.
- **Do** step a tint or add a rule when a surface needs to read as distinct.
- **Do** reserve the accent purple for the single decision the driver leaves with.
- **Do** reshape at 640px rather than scrolling sideways — the ten-column tabulation becomes cards, the strip becomes two courses.
- **Do** honour `prefers-reduced-motion` by removing both the session-best flash and every transition.

### Don't:

- **Don't** add a `box-shadow`, gradient, glass blur, or glow. There is not one in the system and there is no state that earns the first.
- **Don't** round a corner. Radius is `0` everywhere, permanently.
- **Don't** spend purple, green or amber on decoration, branding, category, or emphasis. They report viability only.
- **Don't** let colour be the sole carrier of any state.
- **Don't** introduce a second display face, or let the OS mono stack become the shipped display voice.
- **Don't** set prose or figures in uppercase; uppercase belongs to labels, and letterspaced text never drops below 11px.
- **Don't** put a second element on a screen at display scale — the load figure is the only one.
- **Don't** animate anything beyond a 120ms state transition, and never with a transform or a hover lift.
- **Don't** render a raw `NaN`, `Infinity`, or negative figure; fall back to an em dash and state the condition in the derived line.
- **Don't** let a value separate from its unit — bind them with a non-breaking space and keep them in one flex container.
