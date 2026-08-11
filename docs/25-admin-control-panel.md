# Admin control panel

Local **admin hub** at `/admin` for saved content, feature toggles, integration status, and the component catalog. Part of the “DashBuilder builds itself” path — hand-crafted shell first (DAS-74), dogfooded admin UI later (DAS-75).

**Ticket:** [DAS-74](https://planetkevin.atlassian.net/browse/DAS-74) · Branch: `feature/DAS-74-admin-control-panel`

---

## Goals

| Goal | Detail |
|------|--------|
| **Content library** | Save/reopen composite snapshots in the browser |
| **Integration hub** | AI, voice, app lock, and BYOK status + deep links |
| **Feature toggles** | Enable/disable AI drawer and voice input locally |
| **Catalog** | Read-only registry view for palette component types |
| **Cost-point-zero** | No server admin; `localStorage` / `sessionStorage` only |

---

## Panels

| Panel | DAS-74 behavior |
|-------|-----------------|
| **Saved content** | Save current builder canvas, list entries, open in builder, remove |
| **AI, voice & environment** | Status cards + links to `/environment` and `/builder` |
| **Feature toggles** | `aiDrawerEnabled`, `voiceInputEnabled` |
| **Component catalog** | Palette groups from `@dashbuilder/core` registry |

---

## Content library flow

1. User builds on `/builder` (session keeps canvas in memory).
2. User opens `/admin` → **Saved content** → enter label → **Save current canvas**.
3. Entry stored in `localStorage` (`dashbuilder:content-library:index`).
4. **Open in builder** writes `dashbuilder:library-restore` and navigates to `/builder`.
5. `BuilderProjectService` applies the snapshot to a fresh workspace.

Path notation and export bundles remain a DAS-71/DAS-74 follow-up.

---

## Navigation

- Welcome → Admin control panel
- Environment → Admin
- Builder toolbar → Admin
- Admin → Welcome, Environment, Builder

---

## Related documents

- [Content Library](./23-content-library.md) — original spec (UX lives in admin now)
- [AI & BYOK Integration](./20-ai-and-byok-integration.md)
- [App Lock](./24-app-lock.md)
- [Roadmap](./10-roadmap.md)
