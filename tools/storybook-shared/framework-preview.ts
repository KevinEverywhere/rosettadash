import { storybookActionsParameters } from './storybook-actions.ts';

export const rosettadashFrameworkPreviewParameters = {
  ...storybookActionsParameters,
  layout: 'padded',
  controls: {
    expanded: true,
    matchers: {
      color: /(color|fill|stroke)/i,
      date: /Date$/,
    },
  },
} as const;
