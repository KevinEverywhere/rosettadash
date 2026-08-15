# Destination Atlas — consumer proof apps (DAS-120)

**Epic:** [DAS-120](https://planetkevin.atlassian.net/browse/DAS-120)  
**Research:** [DAS-126](https://planetkevin.atlassian.net/browse/DAS-126)  
**Gap WC components:** [DAS-127](https://planetkevin.atlassian.net/browse/DAS-127) app-language-select · [DAS-128](https://planetkevin.atlassian.net/browse/DAS-128) geo-map · [DAS-129](https://planetkevin.atlassian.net/browse/DAS-129) youtube-embed

Five **identical** Nx apps under `apps/` prove `@rosettadash/*@0.1.1` npm installs outside Storybook. Each app is **Destination Atlas** — current and historic information about world locations.

## Product intent

Users explore destinations worldwide: statistics and trends, searchable records, maps and globes, embedded video and 360° tours, regional news, and trip planning. The app is a **functional demo**, not a taxonomy kitchen sink.

### Multilingual apps (not multilingual RosettaDash)

RosettaDash component chrome and builder UI stay English-only. Developers build multilingual apps using:

- **`domain.i18n.app-language-select`** — sets the app base locale (BCP-47), emits `locale-change`
- Developer-owned i18n (vue-i18n, ngx-translate, react-intl, etc.) wired to that event

Distinct from **`visual.news.language-select`**, which filters news API language — not app UI locale.

### Provider choice at component level

Geo and media components expose **developer-selectable providers** via props/inspector. RosettaDash documents tradeoffs (cost, API keys, branding):

| Component | Provider prop values | Notes |
|-----------|---------------------|-------|
| `visual.display.geo-map` | `maplibre` · `leaflet` · `google-maps` | See [geo-map providers](#geo-map-providers) |
| `visual.media.youtube-embed` | YouTube embed only | Subject to Google ToS / ads |
| `visual.display.3d-geo-globe` | Three.js host | Texture URL + marker rowset |

## Apps

| Ticket | Path | Runtime |
|--------|------|---------|
| DAS-121 | `apps/proof-web-components` | `@rosettadash/web-components` |
| DAS-122 | `apps/proof-react` | `@rosettadash/react` |
| DAS-123 | `apps/proof-angular` | `@rosettadash/angular` |
| DAS-124 | `apps/proof-vue` | `@rosettadash/vue` |
| DAS-125 | `apps/proof-svelte` | `@rosettadash/svelte` |

Shared mock data and screen definitions: **`libs/destination-atlas/`**.

### WC vs framework parity

Most palette atoms are **native runtime** components today. The WC npm package ships layout recipes, media CE hosts, wasm, and catalog elements. `proof-web-components` uses available CEs plus **gap placeholders** until 0.1.2 WC expansion. Framework proof apps use the full generated taxonomy.

## Screens

| Screen | Purpose | Key components |
|--------|---------|----------------|
| **About** | Proof onboarding — why Destination Atlas exists, how to run proof + Storybook per runtime | ScrollRegion (designated app scroller) |
| **Overview** | Current stats + trends | KpiCard, LineChart, BarChart, MetricChip, StatusBadge, GridLayout |
| **Destinations** | Browse + filter | DataTable, DetailPanel, TextInput, SelectInput, DateRangeFilter, TimePreset |
| **Map** | 2D exploration | GeoMap (provider prop), LinkList, TabsLayout |
| **Globe** | 3D markers | ThreeGeoGlobe |
| **Media** | Video consumption | YoutubeEmbed, VideoMetadataPanel |
| **Authoring** | Upload + WASM extract | VideoSource, EquirectViewport, WasmMedia (ffmpeg.wasm — [DAS-131](https://planetkevin.atlassian.net/browse/DAS-131)) |
| **Intel** | Regional news | NewsSearchBox, NewsRegionSelect, NewsResultsTable, NewsArticleDetail |
| **Plan** | Trip + access | RoleGate, PersonInvite, RoleAssign, Timer, form inputs |
| **Stack** | Infra demo | infra/* read-only panel |
| **Settings** | App locale | AppLanguageSelect |

### About page & scroll policy

The **About** tab is the first screen and the **only** page-level scroller in each proof app. Long-form copy (runtime guides, npm commands, Storybook ports) lives inside **`layout.scroll-region`**. The shell locks `body` overflow; other tabs fit within the viewport without page scroll. When content fits, the scroll region shows no visible scrollbar; overflow uses a thin overlay scrollbar.

Implemented in React proof: [DAS-130](https://planetkevin.atlassian.net/browse/DAS-130). Shared copy: `libs/destination-atlas/src/data/about-guides.ts`.

### Authoring tab (Three.js sphere + ffmpeg.wasm)

**Authoring** is separate from **Media**. Media is for watching destination embeds; Authoring is where users upload 2:1 equirect video and frame an export:

- **Source pane** — `EquirectSphereViewport`: interior Three.js sphere (flipped texture), green export rectangle, orbit + Shift+drag framing, preset sizes (320×240, 640×360, 720×480, custom), ffmpeg.wasm extract
- **Output pane** — live program-camera preview (matches export rectangle) + extracted MP4 blob + download

Shipped with one example: **Cusco plaza (360° equirect)** (`libs/destination-atlas/src/data/authoring-examples.ts`).

**Dev setup (proof-react):** from repo root run `npm install` (includes `@ffmpeg/ffmpeg` + `@ffmpeg/util` as devDependencies). The Vite dev server sets COOP/COEP headers required for ffmpeg.wasm SharedArrayBuffer. First extract downloads ~31 MB of `@ffmpeg/core` from unpkg.

Implemented in React proof: [DAS-131](https://planetkevin.atlassian.net/browse/DAS-131) (tab shell); [DAS-132](https://planetkevin.atlassian.net/browse/DAS-132) (sphere viewport + WASM extract on branch `feature/DAS-132-wasm-authoring-extract`). Editor/Admin roles only.

## Geo-map providers

| Provider | Engine | Typical cost | API key | Tradeoffs |
|----------|--------|--------------|---------|-----------|
| **maplibre** (default) | MapLibre GL JS | OSS free; vector tiles often via MapTiler/similar | Often required for tiles | Modern vector UX; recommended default |
| **leaflet** | Leaflet | OSS free; tile provider varies | Optional (OSM free tier limits apply) | Lightweight; huge plugin ecosystem; raster-first |
| **google-maps** | Google Maps JavaScript API | Paid after free tier | Required | Strong geocoding; Google branding and ToS |

Component props: `provider`, `tile-url`, `api-key`, `center`, `zoom`, `markers`, `selected-id`. Event: `marker-select`.

## Mock data

`libs/destination-atlas/src/data/destinations.ts` — sample destinations with:

- `id`, `name`, `region`, `lat`, `lng`
- `youtubeId`, `equirectUrl` (optional)
- `visitorsCurrent`, `visitorsHistoric[]` (year + count)
- `labels` — optional per-locale display names for developer i18n demos

## Install (consumer)

```bash
npm install @rosettadash/core@0.1.1 @rosettadash/web-components@0.1.1 @rosettadash/react@0.1.1
# … angular, vue, svelte as needed
```

Local dev without registry: `npm run pack:consumer` then `file:` tarballs. See [39-npm-consumer-install.md](./39-npm-consumer-install.md).

## Delivery order

1. **DAS-126** — matrix + WC specs (in progress)
2. **DAS-127–129** — gap WC base components → manifest regen → **0.1.2** publish
3. **DAS-121** — `proof-web-components` shell — **done**
4. **DAS-122** — `proof-react` (full taxonomy UX) — **in progress**
5. **DAS-123–125** — remaining framework apps (identical UX to React)

## References

- [Planned tickets](./11-planned-tickets.md)
- [Public component API](./34-public-component-api.md)
- [npm consumer install](./39-npm-consumer-install.md)
- `tools/runtime-taxonomy/manifest.mjs`
