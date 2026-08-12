# Storybook component catalogs (DAS-98)

Per-runtime Storybook apps for visual review and experimentation with RosettaDash npm library components.

## Apps

| Nx project | Runtime | Port | Command |
|------------|---------|------|---------|
| `storybook-web-components` | `@rosettadash/web-components` (default) | 6006 | `npm run storybook:web-components` |
| `storybook-react` | `@rosettadash/react` | 6007 | `npm run storybook:react` |
| `storybook-vue` | `@rosettadash/vue` | 6008 | `npm run storybook:vue` |
| `storybook-angular` | `@rosettadash/angular` | 6009 | `npm run storybook:angular` |
| `storybook-svelte` | `@rosettadash/svelte` | 6010 | `npm run storybook:svelte` |

Run all five in parallel (each on its own port):

```bash
npm run storybook:all
```

Build static catalogs:

```bash
npm run build-storybook
```

Output: `dist/storybook/<project>/`.

## Sidebar taxonomy

Each catalog uses the same sidebar ordering:

1. **Getting Started** — runtime intro
2. **Layout** — e.g. Accordion
3. **Visual** — Link List; **Visual/Media** — Video Source, Equirect Viewport
4. **Recipes** — Accordion Link List

Stories grow as components ship (DAS-93 full taxonomy).

## Styling

Preview loads opt-in RosettaDash chrome globally:

- `packages/web-components/src/styles/tokens.css` (`--rd-*` tokens)
- `packages/web-components/src/styles/styles.css` (`.rd-*` classes)

Shared via `tools/storybook-shared/rosettadash-preview.css`.

## Shared fixtures

Demo link items and JSON for web-component attributes live in `tools/storybook-shared/fixtures.ts`.

## Implementation notes

- Storybook **10.5** with Vite builders (`@storybook/*-vite`, `@storybook/angular-vite` for Angular 22).
- Stories import from workspace path aliases in `tsconfig.base.json` (same paths as consumers).
- Framework media components register underlying web components on mount.

## References

- [Component taxonomy](./08-component-taxonomy.md)
- [Styling and classnames](./35-styling-and-classnames.md)
- [npm library build](./37-npm-library-build.md)
