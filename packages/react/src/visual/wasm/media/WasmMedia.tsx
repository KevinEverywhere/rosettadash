import { createElement, forwardRef, type CSSProperties } from 'react';
import {
  DB_WASM_MEDIA_TAG,
  registerRdWasmMedia,
} from '@rosettadash/web-components/visual/wasm/media';
import { useCustomElementHost } from '../../../lib/custom-element-host.js';

export interface WasmMediaProps {
  label?: string;
  operation?: string;
  extractionMode?: 'flat-crop' | 'rectilinear';
  outputFormat?: string;
  showProgress?: boolean;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  outputWidth?: number;
  outputHeight?: number;
  yaw?: number;
  pitch?: number;
  horizontalFov?: number;
  inputFile?: File | Blob | null;
  cropRegion?: Record<string, string | number | boolean | null | undefined> | null;
  className?: string;
  style?: CSSProperties;
  onProgress?: (detail: { progress: number }) => void;
  onExtractComplete?: (detail: {
    blob: Blob;
    metadata: Record<string, string | number | boolean | null | undefined>;
  }) => void;
  onMetadata?: (
    detail: Record<string, string | number | boolean | null | undefined>,
  ) => void;
}

/** React wrapper around `<rd-wasm-media>`. */
export const WasmMedia = forwardRef<HTMLElement, WasmMediaProps>(function WasmMedia(
  {
    label,
    operation,
    extractionMode,
    outputFormat,
    showProgress,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    outputWidth,
    outputHeight,
    yaw,
    pitch,
    horizontalFov,
    inputFile,
    cropRegion,
    className,
    style,
    onProgress,
    onExtractComplete,
    onMetadata,
  },
  ref,
) {
  const hostRef = useCustomElementHost(
    {
      register: registerRdWasmMedia,
      properties: ['inputFile', 'cropRegion'],
      attrs: {
        extractionMode: 'extraction-mode',
        outputFormat: 'output-format',
        showProgress: 'show-progress',
        cropX: 'crop-x',
        cropY: 'crop-y',
        cropWidth: 'crop-width',
        cropHeight: 'crop-height',
        outputWidth: 'output-width',
        outputHeight: 'output-height',
        horizontalFov: 'horizontal-fov',
      },
      events: {
        progress: 'onProgress',
        'extract-complete': 'onExtractComplete',
        metadata: 'onMetadata',
      },
    },
    {
      label,
      operation,
      extractionMode,
      outputFormat,
      showProgress,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      outputWidth,
      outputHeight,
      yaw,
      pitch,
      horizontalFov,
    },
    {
      onProgress: onProgress as ((detail: unknown) => void) | undefined,
      onExtractComplete: onExtractComplete as ((detail: unknown) => void) | undefined,
      onMetadata: onMetadata as ((detail: unknown) => void) | undefined,
    },
    ref,
    { inputFile, cropRegion },
  );

  return createElement(DB_WASM_MEDIA_TAG, {
    ref: hostRef,
    className,
    style,
  });
});
