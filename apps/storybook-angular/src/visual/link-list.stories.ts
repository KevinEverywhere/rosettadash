import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LinkList } from '@rosettadash/angular/visual/link-list';
import { sampleLinkItems } from '../../../../tools/storybook-shared/fixtures';

const meta: Meta<LinkList> = {
  title: 'Visual/Link List',
  component: LinkList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<LinkList>;

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
