import { createElement, type CSSProperties } from 'react';
import {
  DB_VIDEO_SOURCE_TAG,
  registerRdVideoSource,
} from '@rosettadash/web-components/visual/media/video-source';
import { useCustomElementHost } from '../../../lib/custom-element-host';

export interface VideoSourceProps {
  label?: string;
  accept?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  className?: string;
  style?: CSSProperties;
  onVideoFile?: (detail: {
    file: File;
    metadata: Record<string, string | number | boolean | null | undefined>;
  }) => void;
  onMetadata?: (
    detail: Record<string, string | number | boolean | null | undefined>,
  ) => void;
}

/** React wrapper around `<rd-video-source>`. */
export function VideoSource({
  label,
  accept,
  sourceWidth,
  sourceHeight,
  className,
  style,
  onVideoFile,
  onMetadata,
}: VideoSourceProps) {
  const host = useCustomElementHost(
    {
      register: registerRdVideoSource,
      attrs: {
        sourceWidth: 'source-width',
        sourceHeight: 'source-height',
      },
      events: {
        'video-file': 'onVideoFile',
        metadata: 'onMetadata',
      },
    },
    { label, accept, sourceWidth, sourceHeight },
    {
      onVideoFile: onVideoFile as ((detail: unknown) => void) | undefined,
      onMetadata: onMetadata as ((detail: unknown) => void) | undefined,
    },
  );

  return createElement(DB_VIDEO_SOURCE_TAG, {
    ref: host,
    className,
    style,
  });
}
