import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  mountComponentCountIndex,
  mountStartHere,
} from '../../../../tools/storybook-shared/getting-started/mount-getting-started';
import { mountStylingModesPage } from '../../../../tools/storybook-shared/styling-modes/mount-styling-modes.ts';
import { storybookAggregateStoryParameters } from '../../../../tools/storybook-shared/storybook-actions.ts';
import { DomStoryHost } from '../../../../tools/storybook-shared/dom-story-host.tsx';
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
  render: () => <DomStoryHost mount={() => mountStartHere('react')} />,
};

export const ComponentCount: Story = {
  name: 'Component count',
  render: () => <DomStoryHost mount={() => mountComponentCountIndex('react')} />,
};

export const StylingModes: Story = {
  name: 'Styling modes',
  render: () => <DomStoryHost mount={() => mountStylingModesPage('react')} />,
};
