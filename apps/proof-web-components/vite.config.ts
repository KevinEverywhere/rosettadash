import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { ffmpegCoreVitePlugin, wasmIsolationHeaders } from '../../tools/vite/ffmpeg-core-vite-plugin.mjs';

export default defineConfig({
  plugins: [ffmpegCoreVitePlugin()],
  root: __dirname,
  publicDir: 'public',
  build: {
    outDir: '../../dist/apps/proof-web-components',
    emptyOutDir: true,
  },
  server: {
    port: 4310,
    host: '0.0.0.0',
    headers: wasmIsolationHeaders(),
  },
  preview: {
    headers: wasmIsolationHeaders(),
  },
  resolve: {
    alias: {
      '@destination-atlas': resolve(__dirname, '../../libs/destination-atlas/src/index.ts'),
      '@rosettadash/web-components': resolve(
        __dirname,
        '../../packages/web-components/src/index.ts',
      ),
      '@rosettadash/core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@rosettadash/web-components/styles.css': resolve(
        __dirname,
        '../../packages/web-components/src/styles/styles.css',
      ),
    },
  },
  optimizeDeps: {
    include: ['maplibre-gl', 'leaflet', '@googlemaps/js-api-loader'],
  },
});
