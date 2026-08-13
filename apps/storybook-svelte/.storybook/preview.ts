import type { Preview } from '@storybook/svelte-vite';
import '../../../tools/storybook-shared/rosettadash-preview.css';
import { storybookActionsParameters } from '../../../tools/storybook-shared/storybook-actions.ts';
import { storybookTypographyParameters } from '../../../tools/storybook-shared/storybook-typography.ts';

const preview: Preview = {
  ...storybookTypographyParameters,
  parameters: {
    ...storybookActionsParameters,
    layout: 'padded',
    options: {
      storySort: {
        order: [
          'Getting Started',
          'Layout',
          'Visual',
          ['Link List', 'Media'],
          'Recipes',
        ],
      },
    },
  },
};

export default preview;
