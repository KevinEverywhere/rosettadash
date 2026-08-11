# App component CSS convention

DashBuilder Angular components use **stable BEM class names tied to the component identity**. Styles live in the component’s own `.scss` file and target those classes — not ad-hoc page-specific accordion/collapsible duplicates.

## Rules

| Rule | Example |
|------|---------|
| Root class matches the public component | `app-nav`, `app-collapsible`, `app-builder-guide-card` |
| Block = kebab-case component name | `app-select` |
| Element = `__child` | `app-collapsible__toggle`, `app-nav__link` |
| Modifier = `--variant` | `app-collapsible--open`, `app-nav--toolbar` |
| Page/layout wrappers keep a page prefix | `welcome__stack-sections`, `admin-page__guide-list` |

**Shared primitives** (`apps/client/src/app/shared/`) use the `app-*` prefix:

- `app-nav` — top navigation
- `app-select` — custom dropdown (iOS-safe)
- `app-collapsible` — expand/collapse sections (Welcome stack, Admin panels, guide cards)

**Feature components** use a descriptive prefix that matches the selector:

- `app-builder-guide-card` — animated palette guide preview (`app-builder-guide-card`)

## Collapsible sections

Use `<app-collapsible>` instead of hand-rolled accordion markup.

```html
<app-collapsible
  appearance="stack"
  [expanded]="isSectionOpen('ui')"
  [summaryPlaceholder]="summary === 'Select'"
  toggleTestId="stack-section-toggle-ui"
  panelTestId="stack-section-panel-ui"
  (toggled)="toggleSection('ui')"
>
  <span appCollapsibleTitle>UI framework</span>
  <span appCollapsibleSummary>{{ summary }}</span>

  <!-- panel body -->
</app-collapsible>
```

| `appearance` | Used for |
|--------------|----------|
| `stack` | Welcome tech-stack sections |
| `admin` | Admin control panel sections |
| `card` | Nested guide cards (label + type id header) |

## Page vs primitive styling

- **Primitive** (`app-collapsible`): border, toggle layout, chevron, open state.
- **Page** (`welcome__*`, `admin-page__*`): spacing between sections, chip rows, form layout.

Do not copy collapsible CSS into page stylesheets — extend via `appearance` modifiers or wrapper spacing.

## Related

- [Builder creation assistance](./21-builder-creation-assistance.md)
- [AI & BYOK integration](./20-ai-and-byok-integration.md)
