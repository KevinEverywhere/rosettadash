import type { Meta, StoryObj } from '@storybook/svelte-vite';
import VideoSource from '@rosettadash/svelte/visual/media/video-source';

const meta: Meta<typeof VideoSource> = {
  title: 'Visual/Media/Video Source',
  component: VideoSource,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Choose a video file',
    accept: 'video/*',
  },
};
