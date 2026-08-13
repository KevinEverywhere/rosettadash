import type { Preview } from '@storybook/react-vite';
import '../../../tools/storybook-shared/rosettadash-preview.css';
import { storybookTypographyParameters } from '../../../tools/storybook-shared/storybook-typography.ts';

const preview: Preview = {
  ...storybookTypographyParameters,
  parameters: {
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
