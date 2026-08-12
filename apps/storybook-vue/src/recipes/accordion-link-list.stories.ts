import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { AccordionLinkList } from '@rosettadash/vue/layout/accordion-link-list';
import { sampleLinkItems } from '../../../../tools/storybook-shared/fixtures';

const meta: Meta<typeof AccordionLinkList> = {
  title: 'Recipes/Accordion Link List',
  component: AccordionLinkList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AccordionLinkList>;

export const Default: Story = {
  args: {
    title: 'On this page',
    items: [...sampleLinkItems],
  },
};

export const DefaultOpen: Story = {
  args: {
    title: 'Navigation',
    defaultOpen: true,
    items: [...sampleLinkItems],
  },
};
