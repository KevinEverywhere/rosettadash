import {
  buildYouTubeEmbedUrl,
  parseYouTubeVideoId,
} from './parse-youtube-id.js';
import {
  DB_YOUTUBE_EMBED_TAG,
  RdYoutubeEmbedElement,
  registerRdYoutubeEmbed,
} from './rd-youtube-embed.js';

describe('parseYouTubeVideoId', () => {
  it('accepts raw ids', () => {
    expect(parseYouTubeVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('parses watch URLs', () => {
    expect(parseYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('parses youtu.be URLs', () => {
    expect(parseYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });
});

describe('buildYouTubeEmbedUrl', () => {
  it('uses privacy-enhanced host', () => {
    expect(buildYouTubeEmbedUrl('abc12345678')).toContain('youtube-nocookie.com/embed/');
  });
});

describe('rd-youtube-embed', () => {
  beforeAll(() => {
    registerRdYoutubeEmbed();
  });

  it('registers the custom element', () => {
    expect(customElements.get(DB_YOUTUBE_EMBED_TAG)).toBe(RdYoutubeEmbedElement);
  });

  it('sets iframe src from video-id', async () => {
    const el = document.createElement(DB_YOUTUBE_EMBED_TAG) as RdYoutubeEmbedElement;
    document.body.appendChild(el);
    el.setAttribute('video-id', 'dQw4w9WgXcQ');
    el.setAttribute('embed-title', 'Sample');
    await el.whenReady();

    const iframe = el.shadowRoot?.querySelector('iframe');
    expect(iframe?.getAttribute('src')).toContain('dQw4w9WgXcQ');
    expect(iframe?.getAttribute('title')).toBe('Sample');

    el.remove();
  });

  it('shows empty state without id or url', async () => {
    const el = document.createElement(DB_YOUTUBE_EMBED_TAG) as RdYoutubeEmbedElement;
    document.body.appendChild(el);
    await el.whenReady();

    const iframe = el.shadowRoot?.querySelector('iframe');
    expect(iframe?.hasAttribute('src')).toBe(false);

    el.remove();
  });
});
