import {
  DB_YOUTUBE_EMBED_TAG,
  registerRdYoutubeEmbed,
} from '@rosettadash/web-components/visual/media/youtube-embed';
import { defineCustomElementHost } from '../../../lib/custom-element-host';

export interface YoutubeEmbedProps {
  videoId?: string;
  url?: string;
  start?: number;
  autoplay?: boolean;
  mute?: boolean;
  controls?: boolean;
  title?: string;
  className?: string;
}

/** Vue wrapper around `<rd-youtube-embed>`. */
export const YoutubeEmbed = defineCustomElementHost(
  {
    name: 'RdYoutubeEmbed',
    tagName: DB_YOUTUBE_EMBED_TAG,
    register: registerRdYoutubeEmbed,
    attrs: {
      videoId: 'video-id',
      title: 'embed-title',
    },
  },
  {
    videoId: { type: String, default: undefined },
    url: { type: String, default: undefined },
    start: { type: Number, default: undefined },
    autoplay: { type: Boolean, default: undefined },
    mute: { type: Boolean, default: undefined },
    controls: { type: Boolean, default: undefined },
    title: { type: String, default: undefined },
  },
);

export type YoutubeEmbedComponent = typeof YoutubeEmbed;
