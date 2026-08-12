import {
  DB_EQUIRECT_VIEWPORT_TAG,
  registerRdEquirectViewport,
  type EquirectPreviewMode,
} from '@rosettadash/web-components/visual/media/equirect-viewport';
import { defineCustomElementHost } from '../../../lib/custom-element-host';

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
}

/**
 * Vue wrapper around `<rd-equirect-viewport>` for FFMP3 / media pipelines.
 */
export const EquirectViewport = defineCustomElementHost(
  {
    name: 'RdEquirectViewport',
    tagName: DB_EQUIRECT_VIEWPORT_TAG,
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
      'crop-region': 'cropRegion',
    },
  },
  {
    label: { type: String, default: undefined },
    previewMode: { type: String, default: undefined },
    sourceWidth: { type: Number, default: undefined },
    sourceHeight: { type: Number, default: undefined },
    cropX: { type: Number, default: undefined },
    cropY: { type: Number, default: undefined },
    cropWidth: { type: Number, default: undefined },
    cropHeight: { type: Number, default: undefined },
    outputWidth: { type: Number, default: undefined },
    outputHeight: { type: Number, default: undefined },
    yaw: { type: Number, default: undefined },
    pitch: { type: Number, default: undefined },
    horizontalFov: { type: Number, default: undefined },
  },
);

export type EquirectViewportComponent = typeof EquirectViewport;
