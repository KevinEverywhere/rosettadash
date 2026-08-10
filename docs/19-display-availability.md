# Display Availability

DashBuilder supports different form factors with explicit availability rules. Users on unsupported viewports see a dedicated guidance screen instead of a broken builder layout.

**Tickets:** [DAS-66](https://planetkevin.atlassian.net/browse/DAS-66), [DAS-67](https://planetkevin.atlassian.net/browse/DAS-67)

## Builder requirement

The builder workspace requires **at least 1024px viewport width in landscape mode** (`width >= height` and `width >= 1024`).

This single rule covers:

- **All mobile phones** — portrait and landscape
- **Small tablets** — e.g. Samsung Galaxy Tab and other devices whose landscape width is below 1024px
- **Tablet portrait** — rotate to landscape on a large enough device, or use desktop
- **Narrow desktop windows** — widen the browser window to at least 1024px

See `packages/core/src/lib/viewport/display-availability.ts` (`BUILDER_MIN_WIDTH_PX`).

## Supported vs blocked

| Condition | Builder | Welcome / stack setup |
|-----------|---------|------------------------|
| Landscape, width ≥ 1024px | Full or compact workspace (see below) | Full stack picker |
| Portrait, longer edge ≥ 1024px (touch) | Blocked — rotate to landscape | Full stack picker |
| Portrait, longer edge < 1024px | Blocked — larger display required | Full stack picker |
| Landscape, width < 1024px | Blocked — larger display required | Full stack picker |

Detected tiers (for metrics on the gate screen):

| Tier | Meaning |
|------|---------|
| `desktop` | Fine pointer, landscape, width ≥ 1024px |
| `tablet-landscape` | Touch, landscape, width ≥ 1024px |
| `phone` | Width ≤ 767px |
| `small-tablet` | Touch, landscape, width < 1024px |
| `portrait` | Portrait orientation, width > 767px |
| `narrow` | Fine pointer, landscape, width < 1024px |

## What users see when blocked

Two messages depending on whether rotation can satisfy the 1024px landscape requirement.

### Rotate to landscape

When the device is in **portrait** but its longer edge is at least 1024px (e.g. iPad Mini at 768×1024), touch users see:

- **Title:** Rotate to landscape
- **Message:** Your device can meet the 1024px width requirement when turned sideways.
- **Actions:** **Try again** (after rotation) and link back to stack setup

### Larger display required

When rotation cannot help — phones, small tablets in any orientation, narrow desktop windows — users see:

- **Title:** Larger display required
- **Message:** DashBuilder requires at least 1024px width in landscape mode.
- **Hint:** Use a tablet 10 inches or larger in landscape, or a desktop computer.
- **Actions:** **Try again** and link back to stack setup

Phones and small tablets do **not** render the palette / canvas / inspector grid.

## Compact builder layout (DAS-67)

When the builder is allowed and viewport width is **1024–1280px**, the workspace switches to **compact mode**:

- Canvas uses the full workspace width by default
- **Components** and **Inspector** toolbar toggles open side panels as drawers
- Selecting a canvas node auto-opens the inspector on compact layouts
- Template picker and undo/redo labels hide to save toolbar space; Export and Save remain

Above **1280px**, the standard three-column layout is used (16rem palette, flexible canvas, 22rem inspector).

See `packages/core/src/lib/viewport/workspace-layout.ts` (`COMPACT_BUILDER_MAX_WIDTH_PX`).

## Welcome page behavior

The welcome page at `/` remains available on all form factors so users can:

- Read product overview and stack guidance
- Choose UI framework, server, database, and styling preferences
- Resume or start projects (session stored in `sessionStorage`)

Continuing to `/builder` on a blocked viewport shows the gate instead of the workspace.

## Roadmap

| Phase | Scope |
|-------|--------|
| **DAS-66** | 1024px landscape gate + unified fallback UX |
| **DAS-67 (now)** | Compact builder with collapsible palette/inspector drawers (1024–1280px) |
| **Future** | Phone-native authoring for phone-targeted components and dashboards |

## Implementation notes

- `DisplayAvailabilityService` listens to `resize` and `orientationchange`.
- `BuilderShellComponent` checks `viewport.blocked()` before auth/project initialization.
- `BuilderViewportGateComponent` renders copy from `DISPLAY_AVAILABILITY_COPY` in core.
- E2E and desktop dev workflows are unchanged when the viewport meets the minimum.

## Related docs

- [Architecture](./02-architecture.md) — client builder shell
- [Roadmap Phase 15](./10-roadmap.md) — display availability
- [Planned Tickets — DAS-66](./11-planned-tickets.md)
