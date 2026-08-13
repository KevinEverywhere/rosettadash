import type { Meta, StoryObj } from '@storybook/angular-vite';
import {
  mountComponentCountIndex,
  mountStartHere,
} from '../../../../tools/storybook-shared/getting-started/mount-getting-started';
import { mountStylingModesPage } from '../../../../tools/storybook-shared/styling-modes/mount-styling-modes.ts';
import { storybookAggregateStoryParameters } from '../../../../tools/storybook-shared/storybook-actions.ts';
import { DomStoryHostComponent } from '../../../../tools/storybook-shared/dom-story-host.component.ts';
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
      moduleMetadata: { imports: [DomStoryHostComponent] },
      props: { mount },
      template: '<rd-dom-story-host [mount]="mount" />',
    }),
  };
}

export const StartHere: Story = {
  name: 'Start here',
  ...domStory(() => mountStartHere('angular')),
};

export const ComponentCount: Story = {
  name: 'Component count',
  ...domStory(() => mountComponentCountIndex('angular')),
};

export const StylingModes: Story = {
  name: 'Styling modes',
  ...domStory(() => mountStylingModesPage('angular')),
};
