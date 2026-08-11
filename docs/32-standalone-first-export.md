# Standalone-first export

This is a **product DNA** rule, not an implementation detail.

## Rule

Every DashBuilder export must produce **standalone source** that developers can drop into their project and run **without** installing `@dashbuilder/*` runtime packages.

| Priority | What | When |
|----------|------|------|
| **1 — Primary** | Standalone export | Always. Default for every exporter and export wizard run. |
| **2 — Follow-on** | Importable runtime packages (`@dashbuilder/web-components`, future `@dashbuilder/react`, etc.) | After the standalone path for that component group is complete and verified. Opt-in only. |

## What “standalone” means

A standalone export zip contains:

- All component source (templates, styles, helpers) **inlined** in the output tree
- No `import … from '@dashbuilder/…'` in generated app code (unless the developer adds it themselves)
- README with third-party deps the developer installs (`@ffmpeg/ffmpeg`, `three`, etc.) — same as any normal app

The builder may use `@dashbuilder/core` internally; **exports must not require it**.

## Runtime packages (opt-in family)

`@dashbuilder/web-components` and future npm packages are:

- **Reference implementations** of palette components (used to prove composites in real apps like FFMP3)
- **Optional integration path** via `exportMode: 'package'` on supported exporters
- **Not** the default delivery mechanism for developers receiving an export zip

Package mode exists so maintainers can iterate one copy of media/WASM elements and link them during dogfooding. Standalone mode is what we ship to developers.

## Exporter checklist

When adding or extending a component group:

1. Implement **standalone** code generation first (full source in export tree)
2. Add tests that default export (no options) is standalone
3. Only then add optional package-mode imports, if at all
4. Document third-party deps in `README.export.md`, not DashBuilder runtime deps

## Related

- [Export Pipeline](./04-export-pipeline.md)
- [Vision & Product Overview](./01-vision-and-product-overview.md)
- [FFMP3 Web Components integration](./31-ffmp3-web-components-integration.md) — opt-in package linking for dogfooding
