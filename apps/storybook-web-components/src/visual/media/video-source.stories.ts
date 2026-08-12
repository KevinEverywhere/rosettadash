import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { equirectSource4K, equirectSource6K } from '../../../../../tools/storybook-shared/fixtures';
import { mountWithEventLog } from '../../../../../tools/storybook-shared/web-components-story-helpers';

const meta: Meta = {
  title: 'Visual/Media/Video Source',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/visual/media/video-source` — file ingest UI. Emits `video-file` and `metadata` when a file is chosen.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const DefaultUpload: Story = {
  render: () =>
    `<rd-video-source label="Program source" accept="video/*"></rd-video-source>`,
};

export const Equirect4KSource: Story = {
  render: () =>
    `<rd-video-source label="4K equirect ingest" accept="video/*" source-width="${equirectSource4K.sourceWidth}" source-height="${equirectSource4K.sourceHeight}"></rd-video-source>`,
};

export const Equirect6KSource: Story = {
  render: () =>
    `<rd-video-source label="6K equirect master" accept="video/*" source-width="${equirectSource6K.sourceWidth}" source-height="${equirectSource6K.sourceHeight}"></rd-video-source>`,
};

export const NarrowAcceptMp4: Story = {
  render: () =>
    `<rd-video-source label="MP4 only" accept="video/mp4,.mp4"></rd-video-source>`,
};

export const WithEventLog: Story = {
  render: () =>
    mountWithEventLog(
      `<rd-video-source label="Choose a clip" accept="video/*" source-width="3840" source-height="1920"></rd-video-source>`,
      {
        selector: 'rd-video-source',
        events: ['video-file', 'metadata'],
        hint: 'Choose a video file — video-file and metadata events appear here.',
      },
    ),
};

export const AuthoringPanelLayout: Story = {
  render: () => `
    <div class="rd-story-stack" style="max-width:24rem;">
      <p style="margin:0;font-size:0.8125rem;color:var(--rd-color-muted,#6b7280);">Pair with rd-equirect-viewport for crop metadata and FFmpeg filter strings.</p>
      <rd-video-source label="Deck A — program" accept="video/*"></rd-video-source>
      <rd-video-source label="Deck B — preview" accept="video/*"></rd-video-source>
    </div>
  `,
};
