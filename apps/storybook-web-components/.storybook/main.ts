import type { StorybookConfig } from '@storybook/web-components-vite';
import { rosettadashStorybookFeatures } from '../../../tools/storybook-shared/storybook-features.ts';
import { rosettadashViteFinal } from '../../../tools/storybook-shared/vite-final.ts';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: '@storybook/web-components-vite',
  features: rosettadashStorybookFeatures,
  async viteFinal(viteConfig) {
    return rosettadashViteFinal(viteConfig);
  },
};

export default config;
