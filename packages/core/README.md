# `@rosettadash/core`

Shared types, defaults, and media helpers for RosettaDash runtimes.

**Author:** Kevin Ready \<kevin@planetkevin.com\>

## Install

```bash
npm install @rosettadash/core
```

Sibling apps (before registry publish) can use local pack / `file:` — see [docs/39-npm-consumer-install.md](../../docs/39-npm-consumer-install.md).

## Media filters (ffmp3 / FFmpeg)

```ts
import {
  buildEquirectExtractFilter,
  buildEquirectFlatCropFilter,
  buildEquirectRectilinearFilter,
} from '@rosettadash/core';

const vf = buildEquirectExtractFilter('rectilinear', {
  yaw: 30,
  pitch: -10,
  horizontalFov: 90,
  outputWidth: 1280,
  outputHeight: 720,
});
```

## Building

```bash
nx build core
npm pack ./dist/packages/core --dry-run
```

## Tests

```bash
nx test core
```
