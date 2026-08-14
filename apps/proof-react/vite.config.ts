import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      projects: [resolve(__dirname, '../../tsconfig.base.json')],
    }),
  ],
  resolve: {
    alias: {
      '@destination-atlas': resolve(__dirname, '../../libs/destination-atlas/src/index.ts'),
      '@rosettadash/web-components/styles.css': resolve(
        __dirname,
        '../../packages/web-components/src/styles/styles.css',
      ),
    },
  },
  root: __dirname,
  publicDir: 'public',
  build: {
    outDir: '../../dist/apps/proof-react',
    emptyOutDir: true,
  },
  server: {
    port: 4311,
    host: '0.0.0.0',
  },
  optimizeDeps: {
    include: ['leaflet', '@googlemaps/js-api-loader', 'three'],
    exclude: ['maplibre-gl'],
  },
  worker: {
    format: 'es',
  },
});
