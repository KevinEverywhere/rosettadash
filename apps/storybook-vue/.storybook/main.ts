import type { StorybookConfig } from '@storybook/vue3-vite';
import { rosettadashStorybookFeatures } from '../../../tools/storybook-shared/storybook-features.ts';
import { rosettadashViteFinal } from '../../../tools/storybook-shared/vite-final.ts';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: '@storybook/vue3-vite',
  features: rosettadashStorybookFeatures,
  async viteFinal(viteConfig) {
    return rosettadashViteFinal(viteConfig);
  },
};

export default config;
