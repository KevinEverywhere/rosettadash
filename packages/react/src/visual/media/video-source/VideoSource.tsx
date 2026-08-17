import { createElement, forwardRef, type CSSProperties } from 'react';
import {
  DB_VIDEO_SOURCE_TAG,
  registerRdVideoSource,
} from '@rosettadash/web-components/visual/media/video-source';
import { useCustomElementHost } from '../../../lib/custom-element-host.js';

export interface VideoSourceProps {
  label?: string;
  accept?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  presentation?: 'default' | 'authoring-source' | 'authoring-frame';
  hint?: string;
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
export const VideoSource = forwardRef<HTMLElement, VideoSourceProps>(function VideoSource(
  {
    label,
    accept,
    sourceWidth,
    sourceHeight,
    presentation,
    hint,
    className,
    style,
    onVideoFile,
    onMetadata,
  },
  ref,
) {
  const hostRef = useCustomElementHost(
    {
      register: registerRdVideoSource,
      attrs: {
        label: 'label',
        accept: 'accept',
        sourceWidth: 'source-width',
        sourceHeight: 'source-height',
        presentation: 'presentation',
        hint: 'hint',
      },
      events: {
        'video-file': 'onVideoFile',
        metadata: 'onMetadata',
      },
    },
    { label, accept, sourceWidth, sourceHeight, presentation, hint },
    {
      onVideoFile: onVideoFile as ((detail: unknown) => void) | undefined,
      onMetadata: onMetadata as ((detail: unknown) => void) | undefined,
    },
    ref,
  );

  return createElement(DB_VIDEO_SOURCE_TAG, {
    ref: hostRef,
    className,
    style,
  });
});
