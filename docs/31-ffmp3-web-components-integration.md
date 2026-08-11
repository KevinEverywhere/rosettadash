# FFMP3 Console integration (DAS-83)

Link DashBuilder runtime custom elements into [FFMP3 Console](/Volumes/Three/apps/ffmp3Console) for equirect subsection export.

## Packages

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

From FFMP3 Console (read-only integration — do not modify FFMP3 in this ticket unless explicitly requested):

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

## Export from DashBuilder

Web Components export defaults to **package mode** — generated `register.ts` imports `@dashbuilder/web-components` instead of inlining media/WASM source. Use **standalone** mode in the export wizard when you need a zip with no runtime dependency.

## Three.js (FFMP3 DomeSphere)

DashBuilder elements emit crop/filter metadata; FFMP3 `SceneViewport` / `DomeSphere` continue to own Three.js rendering. Wire `crop-region` events into your existing frustum/dome state — do not duplicate Three.js inside `@dashbuilder/web-components`.
