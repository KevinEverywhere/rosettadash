# Styling and classnames (public npm)

**Ticket:** [DAS-90](https://planetkevin.atlassian.net/browse/DAS-90) · [DAS-92](https://planetkevin.atlassian.net/browse/DAS-92)  
**Companion:** [npm package prep](./33-npm-package-prep.md), [Public component API](./34-public-component-api.md), [npm library build](./37-npm-library-build.md)

Public components must nest inside existing design systems. Styling is **classname- and token-based**, minimal by default, and opt-in for the packaged theme.

## Decisions (locked)

| Topic | Decision |
|-------|----------|
| Token prefix | `--rd-*` |
| Default look | **Minimal** — components render with structure + stable classnames; visual theme via opt-in CSS |
| Stylesheet import | `import '@rosettadash/web-components/styles.css'` (and/or `tokens.css`) |
| Host integration | Override with CSS variables, `className`, and descendant selectors — no required Tailwind/MUI/CSS-modules |
| Opinionation | No card shells, forced page grids, or global resets inside the library CSS |

Builder app CSS (`app-*` BEM in [App component CSS convention](./28-app-component-css-convention.md)) stays separate from the **published** `rd-*` contract.

## Classname contract

Every public atom and recipe root exposes stable classnames:

| Piece | Pattern | Example |
|-------|---------|---------|
| Root block | `rd-<kebab>` | `rd-accordion`, `rd-link-list` |
| Element | `rd-<block>__<element>` | `rd-accordion__header`, `rd-accordion__panel` |
| Modifier | `rd-<block>--<modifier>` | `rd-accordion--open`, `rd-link-list--dense` |

Custom element tags match the block where practical (`<rd-accordion>`).

```ts
import '@rosettadash/web-components/styles.css';
```

```css
/* Host override — no library fork required */
:root {
  --rd-color-accent: #0b6e4f;
}
```

## Tokens (`--rd-*`)

Shipped from `@rosettadash/web-components` (DAS-92):

```ts
import '@rosettadash/web-components/tokens.css';
import '@rosettadash/web-components/styles.css';
```

```css
:root {
  --rd-color-text: #1a1a1a;
  --rd-color-muted: #5c5c5c;
  --rd-color-surface: transparent;
  --rd-color-border: #d0d0d0;
  --rd-color-accent: #2563eb;
  --rd-radius-sm: 0.25rem;
  --rd-radius-md: 0.5rem;
  --rd-space-xs: 0.25rem;
  --rd-space-sm: 0.5rem;
  --rd-space-md: 1rem;
  --rd-font-size: 0.875rem;
  --rd-line-height: 1.4;
  --rd-font-family: system-ui, sans-serif;
}
```

**Public npm CSS contract uses `--rd-*` only** (no `--db-*`).

## Minimal vs themed

| Mode | How | Result |
|------|-----|--------|
| Minimal (default) | No stylesheet import | Structure, semantics, classnames; host styles everything |
| Tokenized | `import '@rosettadash/web-components/tokens.css'` | Variables available; little or no component chrome |
| Themed | `import '@rosettadash/web-components/styles.css'` | Light default borders/spacing using `--rd-*` |

Library CSS must avoid:

- Global `*` / `body` resets
- Fixed page layout (sidebars, app shells)
- Heavy shadows, forced dark mode, or brand gradients
- Dependency on utility frameworks

## Drop-in rules (low opinionation)

1. **One job per component** — layout belongs to the host unless the atom *is* a layout primitive (`layout.flex`, `layout.stack`, …).
2. **No wrapper cards** unless the taxonomy component is explicitly a card (e.g. KPI).
3. **Recipes compose atoms** — `AccordionLinkList` should not invent extra chrome beyond accordion + list.
4. **Width/height** default to `auto` / `100%` of parent as appropriate; no magic fixed widths.
5. **Color** comes from tokens or inherits; never hard-code brand purples in public CSS.
6. **Stack styling profiles** (Tailwind, CSS Modules, MUI) remain **export-wizard** choices for generated apps — not peerDeps of runtime packages.

## Alignment with exporters

| Context | Class / token approach |
|---------|------------------------|
| Builder app | `app-*` BEM ([doc 28](./28-app-component-css-convention.md)) |
| Standalone export zip | May continue per-exporter conventions; prefer converging new work on `rd-*` / `--rd-*` over time |
| npm runtime packages | **Must** use `rd-*` + `--rd-*` |

## Related documents

- [npm package prep](./33-npm-package-prep.md)
- [Public component API](./34-public-component-api.md)
- [React runtime integration](./40-react-runtime-integration.md)
- [Stack styling guides](./41-stack-styling-guides.md)
- [npm library build](./37-npm-library-build.md)
- [App component CSS convention](./28-app-component-css-convention.md)
- [Standalone-first export](./32-standalone-first-export.md)
