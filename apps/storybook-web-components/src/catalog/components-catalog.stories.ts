import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
  disposePaletteCatalog,
  mountFullPaletteCatalog,
  mountNpmLayoutAtoms,
  mountPaletteCatalog,
} from '../../../../tools/storybook-shared/palette-catalog/mount-palette-catalog';
import { storybookAggregateStoryParameters } from '../../../../tools/storybook-shared/storybook-actions.ts';
import '../../../../tools/storybook-shared/palette-catalog/palette-demo-styles.css';

const meta: Meta = {
  title: 'Catalog/Components',
  parameters: {
    ...storybookAggregateStoryParameters,
    docs: {
      description: {
        component:
          'Full builder palette mirrored in Storybook — every taxonomy component on grouped catalog pages with interactive demos (tables, 3D, timers, npm `<rd-*>` elements where shipped).',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

function catalogStory(groupId: string, storyName: string): Story {
  return {
    name: storyName,
    render: () => mountPaletteCatalog(groupId),
    parameters: {
      chromatic: { disableSnapshot: true },
      docs: {
        description: {
          story: `Full **${storyName}** group with section guide, component relationships, and related-group links.`,
        },
      },
    },
  };
}

export const AllComponents: Story = {
  name: 'All components (full scroll)',
  render: () => mountFullPaletteCatalog(),
  parameters: {
    docs: {
      description: {
        story:
          'Every palette component on one page. **Click any component card** to open its group story with full section documentation.',
      },
    },
  },
};

export const FormInputs = catalogStory('form-inputs', 'Form Inputs');
export const DataDisplay = catalogStory('data-display', 'Data Display');
export const LogicAndMotion = catalogStory('logic-motion', 'Logic & Motion');
export const Charts = catalogStory('charts', 'Charts');
export const LayoutAndNavigation = catalogStory('layout', 'Layout & Navigation');
export const AccessAndOnboarding = catalogStory('access-onboarding', 'Access & Onboarding');
export const DataSources = catalogStory('data-sources', 'Data Sources');
export const ApiServers = catalogStory('api-servers', 'API Servers');
export const NewsDiscovery = catalogStory('news-discovery', 'News Discovery');
export const PluginExtensions = catalogStory('plugin-extensions', 'Plugin Extensions');
export const VrAnd3d = catalogStory('vr-visuals', 'VR & 3D');
export const SvgVisuals = catalogStory('svg-visuals', 'SVG');
export const MediaAuthoring = catalogStory('media-authoring', 'Media Authoring');
export const WasmCompute = catalogStory('wasm-compute', 'WASM Compute');

export const NpmLayoutAtoms: Story = {
  name: 'NPM layout atoms (rd-*)',
  render: () => mountNpmLayoutAtoms(),
};

// Storybook does not call unmount hooks — dispose on navigation via global listener is overkill for dev.
void disposePaletteCatalog;
