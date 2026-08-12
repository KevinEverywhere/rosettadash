import type { EquirectPreviewMode } from '@rosettadash/web-components/visual/media/equirect-viewport';

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
  onCropRegion?: (
    detail: Record<string, string | number | boolean | null | undefined>,
  ) => void;
}
