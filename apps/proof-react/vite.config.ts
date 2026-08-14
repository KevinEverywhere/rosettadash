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
    include: ['maplibre-gl', 'leaflet', '@googlemaps/js-api-loader'],
  },
});
