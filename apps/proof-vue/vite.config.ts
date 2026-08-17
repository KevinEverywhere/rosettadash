import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'node:path';
import { ffmpegCoreVitePlugin, wasmIsolationHeaders } from '../../tools/vite/ffmpeg-core-vite-plugin.mjs';

export default defineConfig({
  plugins: [
    vue(),
    react({ include: /\/src\/authoring\/.*\.tsx$/ }),
    ffmpegCoreVitePlugin(),
    tsconfigPaths({
      projects: [resolve(__dirname, '../../tsconfig.base.json')],
    }),
  ],
  resolve: {
    alias: {
      '@destination-atlas': resolve(__dirname, '../../libs/destination-atlas/src/index.ts'),
      '@rosettadash/react/visual/media/equirect-sphere-viewport': resolve(
        __dirname,
        '../../packages/react/src/visual/media/equirect-sphere-viewport/index.ts',
      ),
      '@rosettadash/react/visual/media/flat-video-viewport': resolve(
        __dirname,
        '../../packages/react/src/visual/media/flat-video-viewport/index.ts',
      ),
      '@rosettadash/web-components/styles.css': resolve(
        __dirname,
        '../../packages/web-components/src/styles/styles.css',
      ),
    },
  },
  root: __dirname,
  publicDir: 'public',
  cacheDir: resolve(__dirname, '../../node_modules/.vite/proof-vue'),
  build: {
    outDir: '../../dist/apps/proof-vue',
    emptyOutDir: true,
  },
  server: {
    port: 4313,
    host: '0.0.0.0',
    headers: wasmIsolationHeaders(),
  },
  preview: {
    port: 4313,
    headers: wasmIsolationHeaders(),
  },
  optimizeDeps: {
    include: ['leaflet', '@googlemaps/js-api-loader', 'three', 'react', 'react-dom'],
    exclude: ['maplibre-gl', '@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  worker: {
    format: 'es',
  },
});
