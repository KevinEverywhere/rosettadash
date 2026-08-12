import {
  DB_VIDEO_SOURCE_TAG,
  registerRdVideoSource,
} from '@rosettadash/web-components/visual/media/video-source';
import { defineCustomElementHost } from '../../../lib/custom-element-host';

export interface VideoSourceProps {
  label?: string;
  accept?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  className?: string;
}

export interface VideoFileDetail {
  file: File;
  metadata: Record<string, string | number | boolean | null | undefined>;
}

/**
 * Vue wrapper around `<rd-video-source>` for FFMP3 / media pipelines.
 */
export const VideoSource = defineCustomElementHost(
  {
    name: 'RdVideoSource',
    tagName: DB_VIDEO_SOURCE_TAG,
    register: registerRdVideoSource,
    attrs: {
      sourceWidth: 'source-width',
      sourceHeight: 'source-height',
    },
    events: {
      'video-file': 'videoFile',
      metadata: 'metadata',
    },
  },
  {
    label: { type: String, default: undefined },
    accept: { type: String, default: undefined },
    sourceWidth: { type: Number, default: undefined },
    sourceHeight: { type: Number, default: undefined },
  },
);

export type VideoSourceComponent = typeof VideoSource;
