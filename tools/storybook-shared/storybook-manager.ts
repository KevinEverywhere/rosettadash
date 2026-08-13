import { addons } from 'storybook/manager-api';
import { storybookManagerTheme } from './storybook-typography.ts';

addons.setConfig({
  theme: storybookManagerTheme,
});
