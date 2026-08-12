# Stack styling guides (React)

**Ticket:** [DAS-104](https://planetkevin.atlassian.net/browse/DAS-104) · [DAS-64](https://planetkevin.atlassian.net/browse/DAS-64)  
**Companion:** [React runtime integration](./40-react-runtime-integration.md), [Styling and classnames](./35-styling-and-classnames.md)

Runtime packages stay **stack-agnostic**. The export wizard’s stack profile (`foundation`, `authoring`, `componentLibrary`) records what the user chose; these guides show how to wire RosettaDash classnames into each option.

## Quick reference

| Stack profile choice | Typical import | RosettaDash hook |
|---------------------|----------------|------------------|
| `tailwind` (foundation) | Your Tailwind entry | `@apply` or arbitrary variants on `rd-*` classes |
| `neutral-tokens` (foundation) | `tokens.css` | Set `--rd-*` on `:root` or a wrapper |
| `plain-css` (authoring) | Your global CSS | Descendant selectors for `.rd-accordion`, etc. |
| `css-modules` (authoring) | `*.module.css` | `:global(.rd-accordion__header)` or wrap in a module root |
| `mui` (component library) | MUI theme | Style wrapper / `sx` on host; map `--rd-color-accent` to theme palette |
| Themed default | `styles.css` | Drop-in match for web-components / Storybook |

## 1. Themed default (match custom elements)

Use when you want accordion, link-list, and panel chrome identical to `<rd-*>` Storybook without adopting a full design system.

```tsx
// app entry (Vite, Next, etc.)
import '@rosettadash/web-components/tokens.css';
import '@rosettadash/web-components/styles.css';
```

Override tokens only:

```css
:root {
  --rd-color-accent: #0b6e4f;
  --rd-radius-md: 0.375rem;
}
```

## 2. Tailwind

Light-DOM React components inherit utility classes from ancestors. Two common patterns:

**A. Utilities on the component**

```tsx
<Accordion title="Nav" className="rounded-lg border border-slate-200 shadow-sm">
  <LinkList items={items} className="text-sm" />
</Accordion>
```

**B. `@layer components` in your Tailwind CSS**

```css
@layer components {
  .rd-accordion {
    @apply rounded-lg border border-slate-200 bg-white;
  }
  .rd-accordion__header {
    @apply flex w-full items-center justify-between px-4 py-2 text-left font-medium;
  }
  .rd-accordion__panel {
    @apply hidden px-4 pb-4;
  }
  .rd-accordion--open .rd-accordion__panel {
    @apply block;
  }
}
```

Shadow CE hosts: put Tailwind layout utilities on the host; use CSS variables for internal shadow styling:

```tsx
<VideoSource
  className="block w-full max-w-md"
  style={{ '--rd-color-accent': 'var(--color-primary)' } as React.CSSProperties}
/>
```

## 3. Plain CSS

Minimal integration — no build plugin required.

```css
.rd-link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.rd-link-list__link {
  color: var(--brand-link, #2563eb);
  text-decoration: none;
}
.rd-link-list__link:hover {
  text-decoration: underline;
}
```

Panel visibility for accordion (required if you skip `styles.css`):

```css
.rd-accordion__panel {
  display: none;
}
.rd-accordion--open .rd-accordion__panel {
  display: block;
}
```

## 4. CSS Modules

Scope your layout; reach into stable `rd-*` blocks with `:global`:

```css
/* NavSidebar.module.css */
.sidebar {
  width: 16rem;
  border-right: 1px solid #e5e7eb;
}
.sidebar :global(.rd-accordion__header) {
  font-weight: 600;
}
```

```tsx
import styles from './NavSidebar.module.css';
import { AccordionLinkList } from '@rosettadash/react/layout/accordion-link-list';

export function NavSidebar() {
  return (
    <aside className={styles.sidebar}>
      <AccordionLinkList title="Docs" items={items} />
    </aside>
  );
}
```

## 5. MUI (Material UI)

Use MUI for app chrome; RosettaDash for dashboard primitives. Map theme to tokens on a wrapper:

```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AccordionLinkList } from '@rosettadash/react/layout/accordion-link-list';

const theme = createTheme({ palette: { primary: { main: '#1976d2' } } });

export function AppShell() {
  return (
    <ThemeProvider theme={theme}>
      <div
        style={
          {
            '--rd-color-accent': theme.palette.primary.main,
            '--rd-font-family': theme.typography.fontFamily,
          } as React.CSSProperties
        }
      >
        <AccordionLinkList title="Sections" items={items} />
      </div>
    </ThemeProvider>
  );
}
```

Prefer native React Accordion/LinkList in MUI apps unless you need shadow encapsulation.

## 6. Choosing a mode in the builder

[DAS-64](https://planetkevin.atlassian.net/browse/DAS-64) stack styling profile fields:

- **Foundation:** `tailwind`, `neutral-tokens`, or none  
- **Authoring:** `css-modules`, `plain-css`, `styled-components`, or none  
- **Component library:** `mui`, or none  

Defaults for React exports lean toward `tailwind` + `css-modules`. Runtime npm packages do not install these — the profile informs generated app scaffolding and docs links.

## Checklist for integrators

1. Decide minimal vs `tokens.css` vs full `styles.css`.
2. Confirm accordion panel CSS (or import `styles.css`).
3. For CE hosts, set `--rd-*` on host or parent when not using global theme.
4. Use `className` + `forwardRef` for layout and test hooks.
5. Align with [public classname contract](./35-styling-and-classnames.md) — do not rename `rd-*` blocks in forks.
