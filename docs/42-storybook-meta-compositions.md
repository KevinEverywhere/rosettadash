# Storybook meta compositions (DAS-105)

**Ticket:** [DAS-105](https://planetkevin.atlassian.net/browse/DAS-105)  
**Companion:** [Storybook component catalog](./38-storybook-component-catalog.md), [Demo dashboards](./22-demo-dashboards.md)

Storybook **Catalog → Meta compositions** replaces the old **Meta elements** markup-only stories. Each entry shows:

1. **Layout diagram** — schematic of sections and component blocks (with hover sync to live preview)
2. **Live preview** — interactive dashboard or recipe with real palette demos

On wide screens the diagram sits beside the preview; on narrow viewports they stack (diagram first, then live).

## Why two catalog layers?

| Layer | Purpose |
|-------|---------|
| **Palette** | One row per taxonomy component — spec card + isolated demo |
| **Meta compositions** | Abstract “see it working together” — dashboards and cross-group recipes |

Users browse **Palette** to learn a single component; **Meta compositions** to understand how the library composes in real layouts.

## Compositions (10)

| Story | Covers |
|-------|--------|
| Operations KPI dashboard | Time preset, date range, KPI, line chart, table, detail, skeleton, timer, status badge |
| Analytics & reporting dashboard | Date range, tabs, collapsible, bar/line/pie charts, table, detail, metric chip |
| Admin & settings dashboard | All form inputs, role gate, invite, role assign, grid, flex, modal |
| News discovery flow | All six news-discovery components |
| Media authoring pipeline | Video source, equirect viewport, live capture, WASM media |
| WASM compute lab | WASM asset, worker host, module, media |
| VR & 3D gallery | All five 3D visuals + inline SVG + icon |
| Data platform panel | Env, four databases, four API servers |
| Navigation & layout shell | npm accordion, link lists, accordion-link-list + layout grid/flex/collapsible |
| **Component coverage audit** | Matrix proving 100% palette + npm atom inclusion |

## Implementation

- Definitions: `tools/storybook-shared/meta-compositions/composition-definitions.ts`
- Mount + wiring: `tools/storybook-shared/meta-compositions/mount-meta-composition.ts`
- Plain component XML: `tools/storybook-shared/palette-catalog/render-component-markup.ts`
- Panel tabs (diagram + live vs XML): `wire-meta-composition-panels.ts` — wide screens (≥1400px) show all three columns
- Reuses palette demo markup and `wireCatalogInteractivity()` from the palette catalog engine
- Styles: `meta-composition-styles.css` + shared `palette-demo-styles.css`

## Adding a composition

1. Add a `MetaCompositionDefinition` to `META_COMPOSITIONS` with `componentTypes` and `sections`.
2. Export a story in `apps/storybook-web-components/src/catalog/meta-compositions.stories.ts`.
3. Confirm **Component coverage audit** stays green (no uncovered palette types).

## Related

- Phase 21 [Demo dashboards](./22-demo-dashboards.md) — animated in-builder walkthroughs (separate from Storybook meta compositions)
- DAS-102 catalog meta CEs (`rd-component-name`, etc.) remain for palette spec cards; meta compositions use **live preview HTML**, not markup-tree-only demos
