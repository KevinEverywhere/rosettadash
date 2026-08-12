import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AccordionLinkList } from '@rosettadash/angular/layout/accordion-link-list';
import { sampleLinkItems } from '../../../../tools/storybook-shared/fixtures';

const meta: Meta<AccordionLinkList> = {
  title: 'Recipes/Accordion Link List',
  component: AccordionLinkList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<AccordionLinkList>;

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
