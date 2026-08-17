/** Same-origin mount path for `@ffmpeg/core` ESM assets (see tools/vite/ffmpeg-core-vite-plugin.mjs). */
export const FFMPEG_CORE_MOUNT_PATH = '/ffmpeg-core';

export const FFMPEG_CORE_ASSETS = {
  core: 'ffmpeg-core.js',
  wasm: 'ffmpeg-core.wasm',
} as const;

export function resolveFfmpegCoreBaseUrl(baseUrl?: string | null): string {
  const trimmed = (baseUrl ?? FFMPEG_CORE_MOUNT_PATH).replace(/\/$/, '');
  return trimmed || FFMPEG_CORE_MOUNT_PATH;
}

export function ffmpegCoreAssetUrls(baseUrl?: string | null) {
  const base = resolveFfmpegCoreBaseUrl(baseUrl);
  return {
    coreURL: `${base}/${FFMPEG_CORE_ASSETS.core}`,
    wasmURL: `${base}/${FFMPEG_CORE_ASSETS.wasm}`,
  };
}

export interface FfmpegUtilBlobLoader {
  toBlobURL: (url: string, mimeType: string) => Promise<string>;
}

export interface FfmpegCoreLoader {
  load(options: { coreURL: string; wasmURL: string; workerURL?: string }): Promise<void | boolean>;
}

/** Load ffmpeg.wasm core from same-origin assets (avoids CDN CORS failures). */
export async function loadFfmpegCore(
  ffmpeg: FfmpegCoreLoader,
  util: FfmpegUtilBlobLoader,
  baseUrl?: string | null,
): Promise<void> {
  const urls = ffmpegCoreAssetUrls(baseUrl);
  if (typeof window !== 'undefined' && urls.coreURL.startsWith('/')) {
    await ffmpeg.load({
      coreURL: new URL(urls.coreURL, window.location.origin).href,
      wasmURL: new URL(urls.wasmURL, window.location.origin).href,
    });
    return;
  }

  await ffmpeg.load({
    coreURL: await util.toBlobURL(urls.coreURL, 'text/javascript'),
    wasmURL: await util.toBlobURL(urls.wasmURL, 'application/wasm'),
  });
}

/** Normalize ffmpeg.wasm worker rejections (strings) and Error objects for UI display. */
export function formatFfmpegError(error: unknown, logTail: string[] = []): string {
  if (error instanceof Error && error.message.trim()) {
    return appendFfmpegLogs(error.message.trim(), logTail);
  }
  if (typeof error === 'string' && error.trim()) {
    return appendFfmpegLogs(error.replace(/^Error:\s*/i, '').trim(), logTail);
  }
  if (logTail.length) {
    return logTail.join(' | ');
  }
  return 'Extract failed';
}

function appendFfmpegLogs(message: string, logTail: string[]): string {
  if (!logTail.length) {
    return message;
  }
  return `${message} — ${logTail.join(' | ')}`;
}
