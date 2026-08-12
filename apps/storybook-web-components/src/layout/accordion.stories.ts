import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
  accordionSectionCopy,
  documentationTocItemsJson,
  navigationLinkItemsJson,
} from '../../../../tools/storybook-shared/fixtures';
import { mountWithEventLog } from '../../../../tools/storybook-shared/web-components-story-helpers';

const meta: Meta = {
  title: 'Layout/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/layout/accordion` — registers `<rd-accordion>`. Toggle with click or keyboard (button header). Emits `rd-accordion-toggle`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const CollapsedByDefault: Story = {
  render: () =>
    `<rd-accordion heading="Resources"><p>${accordionSectionCopy.gettingStarted}</p></rd-accordion>`,
};

export const OpenByDefault: Story = {
  render: () =>
    `<rd-accordion heading="Media pipeline" default-open><p>${accordionSectionCopy.mediaPipeline}</p></rd-accordion>`,
};

export const MultipleSections: Story = {
  render: () => `
    <div class="rd-story-stack">
      <rd-accordion heading="Getting started"><p>${accordionSectionCopy.gettingStarted}</p></rd-accordion>
      <rd-accordion heading="Media pipeline" default-open><p>${accordionSectionCopy.mediaPipeline}</p></rd-accordion>
      <rd-accordion heading="Recipes"><p>${accordionSectionCopy.recipes}</p></rd-accordion>
    </div>
  `,
};

export const WithNestedLinkList: Story = {
  render: () =>
    `<rd-accordion heading="Documentation" default-open>
      <rd-link-list items='${documentationTocItemsJson}'></rd-link-list>
    </rd-accordion>`,
};

export const ToggleEventLog: Story = {
  render: () =>
    mountWithEventLog(
      `<rd-accordion heading="Click to expand" data-test-accordion>
        <p>Accordion body with slot content. The header is a focusable button.</p>
      </rd-accordion>`,
      {
        selector: 'rd-accordion',
        events: ['rd-accordion-toggle'],
        hint: 'Click the accordion header — rd-accordion-toggle events appear here.',
      },
    ),
};

export const FaqStyleStack: Story = {
  render: () => `
    <div class="rd-story-stack">
      <rd-accordion heading="How do I install RosettaDash components?">
        <p><code>npm install @rosettadash/web-components@0.1.0 @rosettadash/core@0.1.0</code></p>
      </rd-accordion>
      <rd-accordion heading="Which runtime should I use?">
        <p>Web Components are the default CE runtime. React, Vue, Angular, and Svelte packages wrap the same atoms.</p>
      </rd-accordion>
      <rd-accordion heading="Where are design tokens?">
        <p>Import <code>@rosettadash/web-components/tokens.css</code> and <code>styles.css</code> for opt-in <code>--rd-*</code> chrome.</p>
      </rd-accordion>
    </div>
  `,
};
