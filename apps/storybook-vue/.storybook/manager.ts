import { addons } from 'storybook/manager-api';
import { registerRosettaDashDefaultStory } from '../../../tools/storybook-shared/storybook-default-story.ts';
import { createStorybookManagerTheme } from '../../../tools/storybook-shared/storybook-typography.ts';
import { STORYBOOK_RUNTIME_CATALOGS } from '../../../tools/storybook-shared/storybook-runtime-catalogs.ts';

registerRosettaDashDefaultStory();

addons.setConfig({
  theme: createStorybookManagerTheme(STORYBOOK_RUNTIME_CATALOGS.vue.label),
});
