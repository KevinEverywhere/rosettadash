/** Extract an 11-char YouTube video id from a raw id or common URL forms. */
export function parseYouTubeVideoId(input: string | null | undefined): string | null {
  if (!input?.trim()) {
    return null;
  }

  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return url.pathname.slice(1).split('/')[0] || null;
    }

    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      const fromQuery = url.searchParams.get('v');
      if (fromQuery) {
        return fromQuery;
      }
      const embedMatch = url.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch?.[1]) {
        return embedMatch[1];
      }
      const shortsMatch = url.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) {
        return shortsMatch[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export interface YouTubeEmbedParams {
  start?: number;
  autoplay?: boolean;
  mute?: boolean;
  controls?: boolean;
}

/** Privacy-enhanced embed URL (youtube-nocookie.com). */
export function buildYouTubeEmbedUrl(
  videoId: string,
  params: YouTubeEmbedParams = {},
): string {
  const search = new URLSearchParams();
  if (params.start != null && params.start > 0) {
    search.set('start', String(Math.floor(params.start)));
  }
  if (params.autoplay) {
    search.set('autoplay', '1');
  }
  if (params.mute) {
    search.set('mute', '1');
  }
  if (params.controls === false) {
    search.set('controls', '0');
  }
  search.set('rel', '0');
  search.set('modestbranding', '1');

  const query = search.toString();
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}${query ? `?${query}` : ''}`;
}
