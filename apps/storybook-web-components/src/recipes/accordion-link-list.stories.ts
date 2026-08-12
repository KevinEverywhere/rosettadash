import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { sampleLinkItemsJson } from '../../../../tools/storybook-shared/fixtures';

const meta: Meta = {
  title: 'Recipes/Accordion Link List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/layout/accordion-link-list` — recipe over accordion + link-list.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () =>
    `<rd-accordion-link-list title="On this page" items='${sampleLinkItemsJson}'></rd-accordion-link-list>`,
};

export const DefaultOpen: Story = {
  render: () =>
    `<rd-accordion-link-list title="Navigation" default-open items='${sampleLinkItemsJson}'></rd-accordion-link-list>`,
};
