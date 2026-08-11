# FFMP3 Console integration (DAS-83)

Optional **package-mode** linking for dogfooding DashBuilder media/WASM components in [FFMP3 Console](/Volumes/Three/apps/ffmp3Console).

> **Standalone-first:** Developer exports from DashBuilder are **standalone by default** — full source in the zip, no `@dashbuilder/*` deps. This doc is for maintainers integrating the runtime package while proving composites in FFMP3. See [Standalone-first export](./32-standalone-first-export.md).

## When to use this doc

| Goal | Path |
|------|------|
| Ship code to another developer | Export from DashBuilder (standalone zip) |
| Iterate media/WASM in FFMP3 without re-exporting every change | `npm link` `@dashbuilder/web-components` (package mode) |

## Packages (opt-in runtime family)

| Import | Elements |
|--------|----------|
| `@dashbuilder/web-components/media` | `<db-video-source>`, `<db-equirect-viewport>` |
| `@dashbuilder/web-components/wasm` | `<db-wasm-media>` (equirect-extract) |
| `@dashbuilder/core` | `buildEquirectExtractFilter`, defaults |

## Local link (monorepo dev)

From DashBuilder root:

```bash
cd packages/web-components && npm link
cd ../core && npm link
```

From FFMP3 Console:

```bash
npm link @dashbuilder/web-components @dashbuilder/core
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

## Minimal HTML usage

```html
<db-video-source id="source"></db-video-source>
<db-equirect-viewport
  preview-mode="flat-crop"
  crop-x="1508"
  crop-y="664"
  crop-width="1080"
  crop-height="720"
  output-width="720"
  output-height="480"
></db-equirect-viewport>
<db-wasm-media operation="equirect-extract" extraction-mode="flat-crop"></db-wasm-media>

<script type="module">
  import { registerDashBuilderElements } from '@dashbuilder/web-components';
  registerDashBuilderElements();

  const source = document.getElementById('source');
  const viewport = document.querySelector('db-equirect-viewport');
  const media = document.querySelector('db-wasm-media');

  source.addEventListener('video-file', (event) => {
    media.setProperty('inputFile', event.detail.file);
  });
  viewport.addEventListener('crop-region', (event) => {
    media.setProperty('cropRegion', event.detail);
  });
  media.addEventListener('extract-complete', (event) => {
    const url = URL.createObjectURL(event.detail.blob);
    console.log('Extract ready', url, event.detail.metadata);
  });
</script>
```

## Rectilinear preview

Set `preview-mode="rectilinear"` on `<db-equirect-viewport>` and `yaw`, `pitch`, `horizontal-fov` attributes. WASM media `extraction-mode="rectilinear"` uses the matching v360 filter.

## Package-mode export (opt-in)

Pass `{ exportMode: 'package' }` to the Web Components exporter to generate `register.ts` that imports `@dashbuilder/web-components`. **Not the default** — use standalone export for developer handoff.

## Three.js (FFMP3 DomeSphere)

DashBuilder elements emit crop/filter metadata; FFMP3 `SceneViewport` / `DomeSphere` own Three.js rendering. Wire `crop-region` events into your existing frustum/dome state.
