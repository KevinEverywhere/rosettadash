import { createElement, forwardRef, type CSSProperties } from 'react';
import {
  DB_YOUTUBE_EMBED_TAG,
  registerRdYoutubeEmbed,
} from '@rosettadash/web-components/visual/media/youtube-embed';
import { useCustomElementHost } from '../../../lib/custom-element-host.js';

export interface YoutubeEmbedProps {
  videoId?: string;
  url?: string;
  start?: number;
  autoplay?: boolean;
  mute?: boolean;
  controls?: boolean;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

/** React wrapper around `<rd-youtube-embed>`. */
export const YoutubeEmbed = forwardRef<HTMLElement, YoutubeEmbedProps>(function YoutubeEmbed(
  { videoId, url, start, autoplay, mute, controls, title, className, style },
  ref,
) {
  const hostRef = useCustomElementHost(
    {
      register: registerRdYoutubeEmbed,
      attrs: {
        videoId: 'video-id',
        title: 'embed-title',
      },
    },
    { videoId, url, start, autoplay, mute, controls, title },
    {},
    ref,
  );

  return createElement(DB_YOUTUBE_EMBED_TAG, {
    ref: hostRef,
    className,
    style,
    'video-id': videoId ?? undefined,
    'embed-title': title ?? undefined,
  });
});
