import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
  documentationTocItemsJson,
  externalResourceItems,
  externalResourceItemsJson,
  navigationLinkItemsJson,
} from '../../../../tools/storybook-shared/fixtures';

const meta: Meta = {
  title: 'Visual/Link List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/visual/link-list` — registers `<rd-link-list>`. See **Catalog → Palette** for full list examples.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const DocumentationTableOfContents: Story = {
  render: () =>
    `<rd-link-list items='${documentationTocItemsJson}'></rd-link-list>`,
};

export const PrimaryNavigation: Story = {
  render: () =>
    `<rd-link-list items='${navigationLinkItemsJson}'></rd-link-list>`,
};

export const DenseSidebar: Story = {
  render: () =>
    `<rd-link-list dense items='${navigationLinkItemsJson}'></rd-link-list>`,
};

export const ExternalResources: Story = {
  render: () =>
    `<rd-link-list items='${externalResourceItemsJson}'></rd-link-list>`,
};

export const InCardContext: Story = {
  render: () => {
    const subset = JSON.stringify(externalResourceItems.slice(0, 6));
    return `
    <section style="max-width:20rem;padding:1rem;border:1px solid var(--rd-color-border,#d0d0d0);border-radius:0.5rem;">
      <h3 style="margin:0 0 0.75rem;font-size:0.9375rem;">Related links</h3>
      <rd-link-list dense items='${subset}'></rd-link-list>
    </section>
  `;
  },
};

export const LongLabels: Story = {
  render: () => {
    const items = JSON.stringify([
      {
        label: 'Configure multi-region failover for dashboard export bundles',
        href: '#failover',
      },
      {
        label: 'Understand scoped query filters and domain context inheritance',
        href: '#scoped-filters',
      },
      {
        label: 'Wire equirect metadata panels to host Three.js viewports (ffmp3 pattern)',
        href: '#equirect-bridge',
      },
      {
        label: 'Migrate legacy VideoLoader ingest to rd-video-source events',
        href: '#video-source',
      },
      {
        label: 'Publish @rosettadash/web-components with npm OTP and pack:consumer',
        href: '#publish',
      },
    ]);
    return `<rd-link-list items='${items}'></rd-link-list>`;
  },
};
