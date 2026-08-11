export interface EquirectFlatCropOptions {
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  outputWidth: number;
  outputHeight: number;
}

export interface EquirectRectilinearOptions {
  yaw: number;
  pitch: number;
  roll?: number;
  horizontalFov: number;
  outputWidth: number;
  outputHeight: number;
}

/** ffmpeg -vf filter for a rectangular crop on a flat 2:1 equirect frame, then scale. */
export function buildEquirectFlatCropFilter(options: EquirectFlatCropOptions): string {
  const cropX = Math.max(0, Math.round(options.cropX));
  const cropY = Math.max(0, Math.round(options.cropY));
  const cropWidth = Math.max(2, Math.round(options.cropWidth));
  const cropHeight = Math.max(2, Math.round(options.cropHeight));
  const outputWidth = Math.max(2, Math.round(options.outputWidth));
  const outputHeight = Math.max(2, Math.round(options.outputHeight));

  return `crop=${cropWidth}:${cropHeight}:${cropX}:${cropY},scale=${outputWidth}:${outputHeight}`;
}

/** ffmpeg -vf filter for rectilinear reprojection from equirect source. */
export function buildEquirectRectilinearFilter(options: EquirectRectilinearOptions): string {
  const yaw = Number(options.yaw) || 0;
  const pitch = Number(options.pitch) || 0;
  const roll = Number(options.roll ?? 0) || 0;
  const horizontalFov = Math.max(1, Number(options.horizontalFov) || 90);
  const outputWidth = Math.max(2, Math.round(options.outputWidth));
  const outputHeight = Math.max(2, Math.round(options.outputHeight));

  return [
    `v360=input=equirect:output=rectilinear:yaw=${yaw}:pitch=${pitch}:roll=${roll}:d_fov=${horizontalFov}`,
    `scale=${outputWidth}:${outputHeight}`,
  ].join(',');
}

export function buildEquirectExtractFilter(
  mode: 'flat-crop' | 'rectilinear',
  options: EquirectFlatCropOptions & Partial<EquirectRectilinearOptions>,
): string {
  if (mode === 'rectilinear') {
    return buildEquirectRectilinearFilter({
      yaw: options.yaw ?? 0,
      pitch: options.pitch ?? 0,
      roll: options.roll ?? 0,
      horizontalFov: options.horizontalFov ?? 90,
      outputWidth: options.outputWidth,
      outputHeight: options.outputHeight,
    });
  }

  return buildEquirectFlatCropFilter(options);
}

/** Default crop centered on a 4096×2048 equirect frame. */
export const DEFAULT_EQUIRECT_SOURCE = { width: 4096, height: 2048 } as const;

export const DEFAULT_EQUIRECT_FLAT_CROP: EquirectFlatCropOptions = {
  cropX: Math.floor((DEFAULT_EQUIRECT_SOURCE.width - 1080) / 2),
  cropY: Math.floor((DEFAULT_EQUIRECT_SOURCE.height - 720) / 2),
  cropWidth: 1080,
  cropHeight: 720,
  outputWidth: 720,
  outputHeight: 480,
};
