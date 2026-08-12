# FFMP3 Console integration (DAS-83)

Optional **package-mode** linking for dogfooding RosettaDash media/WASM components in [FFMP3 Console](/Volumes/Three/apps/ffmp3Console).

> **Standalone-first:** Developer exports from RosettaDash are **standalone by default** — full source in the zip, no `@rosettadash/*` deps. This doc is for maintainers integrating the runtime package while proving composites in FFMP3. See [Standalone-first export](./32-standalone-first-export.md).

## When to use this doc

| Goal | Path |
|------|------|
| Ship code to another developer | Export from RosettaDash (standalone zip) |
| Iterate media/WASM in FFMP3 without re-exporting every change | `npm link` `@rosettadash/web-components` (package mode) |

## Packages (opt-in runtime family)

| Import | Elements |
|--------|----------|
| `@rosettadash/web-components/media` | `<rd-video-source>`, `<rd-equirect-viewport>` |
| `@rosettadash/web-components/wasm` | `<rd-wasm-media>` (equirect-extract) |
| `@rosettadash/core` | `buildEquirectExtractFilter`, defaults |

## Install for consumers (DAS-99)

Prefer scoped packages — **not** unscoped `rosettadash`. Full recipes: [39-npm-consumer-install.md](./39-npm-consumer-install.md).

```bash
# After scoped publish:
npm install @rosettadash/web-components @rosettadash/core

# Or local pack from RosettaDash:
npm run pack:consumer
# then in ffmp3Console: npm install ../dashbuilder/rosettadash/*.tgz
```

## Local link (monorepo dev)

From RosettaDash root:

```bash
cd packages/web-components && npm link
cd ../core && npm link
```

From FFMP3 Console:

```bash
npm link @rosettadash/web-components @rosettadash/core
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

## Minimal HTML usage

```html
<rd-video-source id="source"></rd-video-source>
<rd-equirect-viewport
  preview-mode="flat-crop"
  crop-x="1508"
  crop-y="664"
  crop-width="1080"
  crop-height="720"
  output-width="720"
  output-height="480"
></rd-equirect-viewport>
<rd-wasm-media operation="equirect-extract" extraction-mode="flat-crop"></rd-wasm-media>

<script type="module">
  import { registerRosettaDashElements } from '@rosettadash/web-components';
  registerRosettaDashElements();

  const source = document.getElementById('source');
  const viewport = document.querySelector('rd-equirect-viewport');
  const media = document.querySelector('rd-wasm-media');

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

Set `preview-mode="rectilinear"` on `<rd-equirect-viewport>` and `yaw`, `pitch`, `horizontal-fov` attributes. WASM media `extraction-mode="rectilinear"` uses the matching v360 filter.

## Package-mode export (opt-in)

Pass `{ exportMode: 'package' }` to the Web Components exporter to generate `register.ts` that imports `@rosettadash/web-components`. **Not the default** — use standalone export for developer handoff.

## Three.js (FFMP3 DomeSphere)

RosettaDash elements emit crop/filter metadata; FFMP3 `SceneViewport` / `DomeSphere` own Three.js rendering. Wire `crop-region` events into your existing frustum/dome state.
