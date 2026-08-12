import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { sampleLinkItemsJson } from '../../../../tools/storybook-shared/fixtures';

const meta: Meta = {
  title: 'Visual/Link List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/visual/link-list` — registers `<rd-link-list>`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () =>
    `<rd-link-list items='${sampleLinkItemsJson}'></rd-link-list>`,
};

export const Dense: Story = {
  render: () =>
    `<rd-link-list dense items='${sampleLinkItemsJson}'></rd-link-list>`,
};
