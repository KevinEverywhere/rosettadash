import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
  mountComponentCountIndex,
  mountStartHere,
} from '../../../../tools/storybook-shared/getting-started/mount-getting-started';
import { storybookAggregateStoryParameters } from '../../../../tools/storybook-shared/storybook-actions.ts';
import '../../../../tools/storybook-shared/getting-started/getting-started-styles.css';

const meta: Meta = {
  title: 'Getting Started/Introduction',
  parameters: {
    ...storybookAggregateStoryParameters,
    docs: {
      description: {
        component:
          'RosettaDash component catalog — start here for the full map, then browse **Catalog → Palette** (~50 types across 14 groups) or **Meta compositions** for live dashboard layouts.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const StartHere: Story = {
  name: 'Start here',
  render: () => mountStartHere(),
  parameters: {
    docs: {
      description: {
        story:
          'Landing page — how Palette vs Meta compositions map to the builder, plus ready-made **Select template…** groups from the RosettaDash toolbar.',
      },
    },
  },
};

export const ComponentCount: Story = {
  name: 'Component count',
  render: () => mountComponentCountIndex(),
  parameters: {
    docs: {
      description: {
        story:
          'Full component index grouped by palette taxonomy — each row links to its palette demo and meta composition(s).',
      },
    },
  },
};
