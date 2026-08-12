import type { Meta, StoryObj } from '@storybook/svelte-vite';
import LinkList from '@rosettadash/svelte/visual/link-list';
import { sampleLinkItems } from '../../../../tools/storybook-shared/fixtures';

const meta: Meta<typeof LinkList> = {
  title: 'Visual/Link List',
  component: LinkList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [...sampleLinkItems],
  },
};

export const Dense: Story = {
  args: {
    items: [...sampleLinkItems],
    dense: true,
  },
};
