import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
  mountComponentCountIndex,
  mountStartHere,
} from '../../../../tools/storybook-shared/getting-started/mount-getting-started';
import { mountStylingModesPage } from '../../../../tools/storybook-shared/styling-modes/mount-styling-modes.ts';
import { storybookAggregateStoryParameters } from '../../../../tools/storybook-shared/storybook-actions.ts';
import '../../../../tools/storybook-shared/getting-started/getting-started-styles.css';
import '../../../../tools/storybook-shared/styling-modes/styling-modes.css';

const meta: Meta = {
  title: 'Getting Started',
  parameters: {
    ...storybookAggregateStoryParameters,
  },
};

export default meta;

type Story = StoryObj;

export const StartHere: Story = {
  name: 'Start here',
  render: () => mountStartHere('web-components'),
};

export const ComponentCount: Story = {
  name: 'Component count',
  render: () => mountComponentCountIndex('web-components'),
};

export const StylingModes: Story = {
  name: 'Styling modes',
  render: () => mountStylingModesPage('web-components'),
};
