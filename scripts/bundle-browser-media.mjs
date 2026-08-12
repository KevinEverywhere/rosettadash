/**
 * DAS-99 — browser ESM bundle for media custom elements.
 * Packs @rosettadash/core filter helpers into the WC media entry so
 * no-bundler apps (ffmp3Console) can import via import map.
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
const esbuild = require('esbuild');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outdir = path.join(root, 'dist/packages/web-components/browser');
mkdirSync(outdir, { recursive: true });

await esbuild.build({
  absWorkingDir: root,
  entryPoints: [path.join(root, 'packages/web-components/src/media/index.ts')],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  outfile: path.join(outdir, 'media.js'),
  sourcemap: true,
  logLevel: 'info',
});

console.log(`Wrote browser media bundle to ${outdir}`);
