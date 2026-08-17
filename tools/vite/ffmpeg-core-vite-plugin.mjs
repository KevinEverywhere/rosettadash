import { copyFileSync, createReadStream, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(__dirname, '../..');
const FFMPEG_CORE_DIR = resolve(WORKSPACE_ROOT, 'node_modules/@ffmpeg/core/dist/esm');
const FFMPEG_CORE_FILES = ['ffmpeg-core.js', 'ffmpeg-core.wasm'];
const MIME = {
  js: 'application/javascript; charset=utf-8',
  wasm: 'application/wasm',
};

export const FFMPEG_CORE_MOUNT_PATH = '/ffmpeg-core';

/** COOP + COEP headers required for ffmpeg.wasm SharedArrayBuffer in dev/preview. */
export function wasmIsolationHeaders() {
  return {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'credentialless',
  };
}

/**
 * Serve `@ffmpeg/core` (ESM build) from node_modules at `/ffmpeg-core/*` in dev and copy into build output.
 * ESM is required: Vite bundles `@ffmpeg/ffmpeg`'s worker as type=module, which dynamic-imports core.
 */
export function ffmpegCoreVitePlugin(options = {}) {
  const mountPath = options.mountPath ?? FFMPEG_CORE_MOUNT_PATH;
  const publicSubdir = mountPath.replace(/^\//, '');

  return {
    name: 'rosettadash-ffmpeg-core',
    configureServer(server) {
      server.middlewares.use(mountPath, (req, res, next) => {
        const fileName = (req.url ?? '/').replace(/^\//, '').split('?')[0];
        if (!FFMPEG_CORE_FILES.includes(fileName)) {
          next();
          return;
        }
        const filePath = resolve(FFMPEG_CORE_DIR, fileName);
        if (!existsSync(filePath)) {
          res.statusCode = 404;
          res.end(
            `ffmpeg core asset missing: ${fileName}. Install @ffmpeg/core (npm install -D @ffmpeg/core@0.12.6).`,
          );
          return;
        }
        const ext = fileName.split('.').pop() ?? '';
        res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        createReadStream(filePath).pipe(res);
      });
    },
    writeBundle(bundleOptions) {
      const outDir = bundleOptions.dir;
      if (!outDir || !existsSync(FFMPEG_CORE_DIR)) {
        return;
      }
      const destDir = resolve(outDir, publicSubdir);
      mkdirSync(destDir, { recursive: true });
      for (const fileName of FFMPEG_CORE_FILES) {
        copyFileSync(resolve(FFMPEG_CORE_DIR, fileName), resolve(destDir, fileName));
      }
    },
  };
}
