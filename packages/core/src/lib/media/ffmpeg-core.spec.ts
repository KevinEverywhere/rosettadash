import {
  FFMPEG_CORE_MOUNT_PATH,
  ffmpegCoreAssetUrls,
  formatFfmpegError,
  loadFfmpegCore,
  resolveFfmpegCoreBaseUrl,
} from './ffmpeg-core';

describe('ffmpeg-core', () => {
  it('defaults to same-origin mount path', () => {
    expect(resolveFfmpegCoreBaseUrl()).toBe(FFMPEG_CORE_MOUNT_PATH);
    expect(ffmpegCoreAssetUrls()).toEqual({
      coreURL: '/ffmpeg-core/ffmpeg-core.js',
      wasmURL: '/ffmpeg-core/ffmpeg-core.wasm',
    });
  });

  it('normalizes custom base URLs', () => {
    expect(resolveFfmpegCoreBaseUrl('/assets/ffmpeg/')).toBe('/assets/ffmpeg');
    expect(ffmpegCoreAssetUrls('/assets/ffmpeg').coreURL).toBe('/assets/ffmpeg/ffmpeg-core.js');
  });

  it('loads same-origin ffmpeg core without blob URLs in browser', async () => {
    const load = jest.fn().mockResolvedValue(undefined);
    const toBlobURL = jest.fn();
    const originalWindow = globalThis.window;
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { location: { origin: 'http://localhost:4312' } },
    });

    await loadFfmpegCore({ load }, { toBlobURL }, '/ffmpeg-core');

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: originalWindow,
    });

    expect(toBlobURL).not.toHaveBeenCalled();
    expect(load).toHaveBeenCalledWith({
      coreURL: 'http://localhost:4312/ffmpeg-core/ffmpeg-core.js',
      wasmURL: 'http://localhost:4312/ffmpeg-core/ffmpeg-core.wasm',
    });
  });

  it('falls back to blob URLs without window (node) or remote base URLs', async () => {
    const load = jest.fn().mockResolvedValue(undefined);
    const toBlobURL = jest.fn(async (url: string, mimeType: string) => `blob:${url}:${mimeType}`);

    await loadFfmpegCore({ load }, { toBlobURL }, 'https://cdn.example/ffmpeg');

    expect(toBlobURL).toHaveBeenCalledTimes(2);
    expect(load).toHaveBeenCalledWith({
      coreURL: 'blob:https://cdn.example/ffmpeg/ffmpeg-core.js:text/javascript',
      wasmURL: 'blob:https://cdn.example/ffmpeg/ffmpeg-core.wasm:application/wasm',
    });
  });

  it('formats ffmpeg worker string rejections with log tail', () => {
    expect(formatFfmpegError('Error: FS error')).toBe('FS error');
    expect(formatFfmpegError(new Error('codec failed'), ['Unknown encoder libx264'])).toBe(
      'codec failed — Unknown encoder libx264',
    );
  });
});
