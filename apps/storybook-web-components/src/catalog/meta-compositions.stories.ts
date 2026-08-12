import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
  META_COMPOSITIONS,
  mountMetaComposition,
  mountMetaCompositionCoverage,
} from '../../../../tools/storybook-shared/meta-compositions/mount-meta-composition.js';
import '../../../../tools/storybook-shared/meta-compositions/meta-composition-styles.css';
import '../../../../tools/storybook-shared/palette-catalog/palette-demo-styles.css';

const meta: Meta = {
  title: 'Catalog/Meta compositions',
  parameters: {
    docs: {
      description: {
        component:
          '**Live dashboard and recipe layouts** — each meta composition shows a **layout diagram** (schematic) beside the **live preview** (stacked on narrow viewports). Together they cover every taxonomy type and shipped npm `rd-*` atom.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

function compositionStory(id: string): Story {
  const definition = META_COMPOSITIONS.find((entry) => entry.id === id);
  if (!definition) {
    throw new Error(`Unknown meta composition: ${id}`);
  }
  return {
    name: definition.title,
    render: () => mountMetaComposition(definition),
    parameters: {
      docs: {
        description: {
          story: definition.summary,
        },
      },
    },
  };
}

export const ComponentCoverageAudit: Story = {
  name: 'Component coverage audit',
  render: () => mountMetaCompositionCoverage(),
};

export const OperationsKpiDashboard = compositionStory('operations-kpi');
export const AnalyticsReportingDashboard = compositionStory('analytics-reporting');
export const AdminSettingsDashboard = compositionStory('admin-settings');
export const NewsDiscoveryFlow = compositionStory('news-discovery');
export const MediaAuthoringPipeline = compositionStory('media-authoring');
export const WasmComputeLab = compositionStory('wasm-compute-lab');
export const Vr3dGallery = compositionStory('vr-3d-gallery');
export const DataPlatformPanel = compositionStory('data-platform');
export const NavigationLayoutShell = compositionStory('navigation-shell');
