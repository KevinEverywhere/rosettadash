import type { Meta, StoryObj } from '@storybook/react-vite';
import { LinkList } from '@rosettadash/react/visual/link-list';
import { sampleLinkItems } from '../../../../tools/storybook-shared/fixtures';

const meta: Meta<typeof LinkList> = {
  title: 'Visual/Link List',
  component: LinkList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof LinkList>;

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
