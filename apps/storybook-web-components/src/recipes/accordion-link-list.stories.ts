import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
  documentationTocItemsJson,
  externalResourceItemsJson,
  navigationLinkItemsJson,
} from '../../../../tools/storybook-shared/fixtures';
import { mountWithEventLog } from '../../../../tools/storybook-shared/web-components-story-helpers';

const meta: Meta = {
  title: 'Recipes/Accordion Link List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/layout/accordion-link-list` — recipe combining accordion + link-list. Emits `rd-accordion-link-list-toggle`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const TableOfContentsCollapsed: Story = {
  render: () =>
    `<rd-accordion-link-list heading="On this page" items='${documentationTocItemsJson}'></rd-accordion-link-list>`,
};

export const NavigationOpen: Story = {
  render: () =>
    `<rd-accordion-link-list heading="Section navigation" default-open items='${navigationLinkItemsJson}'></rd-accordion-link-list>`,
};

export const DenseFooterLinks: Story = {
  render: () =>
    `<rd-accordion-link-list heading="Resources" dense default-open items='${externalResourceItemsJson}'></rd-accordion-link-list>`,
};

export const SidebarPattern: Story = {
  render: () => `
    <aside style="max-width:16rem;padding:0.75rem;border-right:1px solid var(--rd-color-border,#d0d0d0);">
      <rd-accordion-link-list heading="Docs" default-open items='${documentationTocItemsJson}'></rd-accordion-link-list>
      <rd-accordion-link-list heading="More" items='${externalResourceItemsJson}'></rd-accordion-link-list>
    </aside>
  `,
};

export const ToggleEventLog: Story = {
  render: () =>
    mountWithEventLog(
      `<rd-accordion-link-list heading="Expand for links" items='${documentationTocItemsJson}'></rd-accordion-link-list>`,
      {
        selector: 'rd-accordion-link-list',
        events: ['rd-accordion-link-list-toggle'],
        hint: 'Toggle the recipe accordion — events appear here.',
      },
    ),
};

export const MobileDrawerPattern: Story = {
  render: () => `
    <div style="max-width:22rem;border:1px solid var(--rd-color-border,#d0d0d0);border-radius:0.5rem;overflow:hidden;">
      <header style="padding:0.75rem 1rem;background:rgb(15 23 42 / 6%);font-weight:600;">Page title</header>
      <div style="padding:0.75rem 1rem;">
        <rd-accordion-link-list heading="Jump to section" default-open dense items='${documentationTocItemsJson}'></rd-accordion-link-list>
      </div>
    </div>
  `,
};
