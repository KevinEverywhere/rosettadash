import type { Meta, StoryObj } from '@storybook/svelte-vite';
import {
  mountComponentCountIndex,
  mountStartHere,
} from '../../../../tools/storybook-shared/getting-started/mount-getting-started';
import { mountStylingModesPage } from '../../../../tools/storybook-shared/styling-modes/mount-styling-modes.ts';
import { storybookAggregateStoryParameters } from '../../../../tools/storybook-shared/storybook-actions.ts';
import DomStoryHost from '../../../../tools/storybook-shared/DomStoryHost.svelte';
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

function domStory(mount: () => HTMLElement): Story {
  return {
    render: () => ({
      Component: DomStoryHost,
      props: { mount },
    }),
  };
}

export const StartHere: Story = {
  name: 'Start here',
  ...domStory(() => mountStartHere('svelte')),
};

export const ComponentCount: Story = {
  name: 'Component count',
  ...domStory(() => mountComponentCountIndex('svelte')),
};

export const StylingModes: Story = {
  name: 'Styling modes',
  ...domStory(() => mountStylingModesPage('svelte')),
};
