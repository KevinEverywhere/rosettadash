# User-Controlled Content Library

Save, revisit, and organize RosettaDash composites and exported artifacts under **user-controlled storage**. When users choose where to put output, RosettaDash records directory and file paths — it does not host content on the RosettaDash server.

**Phase:** Post–Phase 20 (implementation after BYOK + AI assist)  
**Ticket:** [DAS-71](https://planetkevin.atlassian.net/browse/DAS-71)  
**Branch:** `feature/DAS-71-content-library`  
**Status:** Spec only — discuss UX before implementation

---

## Goals

| Goal | Detail |
|------|--------|
| **Save and revisit** | Browse previously saved composites and export bundles |
| **User owns storage** | Local paths, user-picked folders — no mandatory cloud |
| **Path notation** | Record `directory` + `file` when user saves or exports |
| **Multi-format** | js, jsx, ts, tsx, svg, xml, html, css, and extensible registry |
| **Integrations** | Links from Welcome, Builder, and [Environment](./20-ai-and-byok-integration.md) pages |

---

## Non-goals (initial)

- RosettaDash-hosted content repository
- Automatic sync / backup
- Version control (Git) integration
- Collaborative sharing

---

## Draft data model

```typescript
interface ContentLibraryEntry {
  id: string;
  label: string;
  kind: 'composite' | 'export' | 'draft';
  createdAt: string;
  updatedAt: string;
  storage: {
    rootDirectory: string;      // user-provided absolute or workspace path
    files: ContentLibraryFile[];
  };
  stackProfile?: StackProfile;
  formatTags: ContentFormatTag[];
}

interface ContentLibraryFile {
  relativePath: string;         // e.g. src/components/Dashboard.tsx
  format: ContentFormatTag;
  bytes?: number;
}

type ContentFormatTag =
  | 'js' | 'jsx' | 'ts' | 'tsx'
  | 'svg' | 'xml' | 'html' | 'css'
  | 'json' | 'md' | 'env' | 'other';
```

Path notation is **advisory metadata** stored in the browser (or user export manifest) — RosettaDash does not write to arbitrary paths without explicit user action (File System Access API or download).

---

## UX surfaces (to decide)

1. **Library page** — `/library` or section on Welcome
2. **Save flow** — prompt for label + target directory when saving composite or export zip
3. **Reopen** — hydrate builder from saved composite JSON
4. **Export manifest** — list files in last export with paths for user reference

---

## Relationship to other work

| Phase | Connection |
|-------|------------|
| DAS-70 Environment page | Shared nav; export `.env.example` paths |
| DAS-69 Animated guides | Demo dashboards (Phase 21) may seed library entries |
| Phase 20 AI assist | Optional “save AI-generated layout to library” |

---

## Open questions

1. File System Access API vs download-only for path picking?
2. Index stored in `localStorage` vs sidecar `rosettadash-library.json` in user folder?
3. Single ticket vs epic with format-registry + UI + builder integration stories?

---

## Related documents

- [Roadmap — Phase 21 demo dashboards](./22-demo-dashboards.md)
- [AI & BYOK Integration](./20-ai-and-byok-integration.md)
- [Export Pipeline](./04-export-pipeline.md)
