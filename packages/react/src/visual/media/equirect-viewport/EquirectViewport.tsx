import { createElement, type CSSProperties } from 'react';
import {
  DB_EQUIRECT_VIEWPORT_TAG,
  registerRdEquirectViewport,
  type EquirectPreviewMode,
} from '@rosettadash/web-components/visual/media/equirect-viewport';
import { useCustomElementHost } from '../../../lib/custom-element-host';

export type { EquirectPreviewMode };

export interface EquirectViewportProps {
  label?: string;
  previewMode?: EquirectPreviewMode;
  sourceWidth?: number;
  sourceHeight?: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  outputWidth?: number;
  outputHeight?: number;
  yaw?: number;
  pitch?: number;
  horizontalFov?: number;
  className?: string;
  style?: CSSProperties;
  onCropRegion?: (
    detail: Record<string, string | number | boolean | null | undefined>,
  ) => void;
}

/** React wrapper around `<rd-equirect-viewport>`. */
export function EquirectViewport({
  label,
  previewMode,
  sourceWidth,
  sourceHeight,
  cropX,
  cropY,
  cropWidth,
  cropHeight,
  outputWidth,
  outputHeight,
  yaw,
  pitch,
  horizontalFov,
  className,
  style,
  onCropRegion,
}: EquirectViewportProps) {
  const host = useCustomElementHost(
    {
      register: registerRdEquirectViewport,
      attrs: {
        previewMode: 'preview-mode',
        sourceWidth: 'source-width',
        sourceHeight: 'source-height',
        cropX: 'crop-x',
        cropY: 'crop-y',
        cropWidth: 'crop-width',
        cropHeight: 'crop-height',
        outputWidth: 'output-width',
        outputHeight: 'output-height',
        horizontalFov: 'horizontal-fov',
      },
      events: {
        'crop-region': 'onCropRegion',
      },
    },
    {
      label,
      previewMode,
      sourceWidth,
      sourceHeight,
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
      onCropRegion: onCropRegion as ((detail: unknown) => void) | undefined,
    },
  );

  return createElement(DB_EQUIRECT_VIEWPORT_TAG, {
    ref: host,
    className,
    style,
  });
}
