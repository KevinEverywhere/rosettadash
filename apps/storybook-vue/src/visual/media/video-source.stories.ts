import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { VideoSource } from '@rosettadash/vue/visual/media/video-source';

const meta: Meta<typeof VideoSource> = {
  title: 'Visual/Media/Video Source',
  component: VideoSource,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof VideoSource>;

export const Default: Story = {
  args: {
    label: 'Choose a video file',
    accept: 'video/*',
  },
};
