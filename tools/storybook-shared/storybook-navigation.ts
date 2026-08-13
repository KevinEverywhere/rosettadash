import { linkTo } from '@storybook/addon-links';
import {
  PALETTE_GROUP_STORY_IDS,
  PALETTE_GROUP_STORY_NAMES,
} from './palette-catalog/palette-group-guides.js';

export const STORY_TITLE_COMPONENTS = 'Catalog/Components';
export const STORY_TITLE_META_COMPONENTS = 'Catalog/Meta components';
/** @deprecated Use STORY_TITLE_COMPONENTS — kept for internal call sites during migration */
export const STORY_TITLE_PALETTE = STORY_TITLE_COMPONENTS;
/** @deprecated Use STORY_TITLE_META_COMPONENTS */
export const STORY_TITLE_META = STORY_TITLE_META_COMPONENTS;
export const STORY_TITLE_GETTING_STARTED = 'Getting Started';

export const PALETTE_ALL_COMPONENTS_STORY = 'All components (full scroll)';
export const PALETTE_NPM_ATOMS_STORY = 'NPM layout atoms (rd-*)';

/** Storybook story ids — fallback when addon-links is unavailable in iframe embeds */
export const META_COMPOSITION_STORY_IDS: Record<string, string> = {
  'operations-kpi': 'catalog-meta-components--operations-kpi-dashboard',
  'analytics-reporting': 'catalog-meta-components--analytics-reporting-dashboard',
  'admin-settings': 'catalog-meta-components--admin-settings-dashboard',
  'news-discovery': 'catalog-meta-components--news-discovery-flow',
  'media-authoring': 'catalog-meta-components--media-authoring-pipeline',
  'wasm-compute-lab': 'catalog-meta-components--wasm-compute-lab',
  'vr-3d-gallery': 'catalog-meta-components--vr-3-d-gallery',
  'data-platform': 'catalog-meta-components--data-platform-panel',
  'navigation-shell': 'catalog-meta-components--navigation-layout-shell',
  coverage: 'catalog-meta-components--component-coverage-audit',
};

export const META_COMPOSITION_STORY_NAMES: Record<string, string> = {
  'operations-kpi': 'Operations KPI dashboard',
  'analytics-reporting': 'Analytics & reporting dashboard',
  'admin-settings': 'Admin & settings dashboard',
  'news-discovery': 'News discovery flow',
  'media-authoring': 'Media authoring pipeline',
  'wasm-compute-lab': 'WASM compute lab',
  'vr-3d-gallery': 'VR & 3D gallery',
  'data-platform': 'Data platform panel',
  'navigation-shell': 'Navigation & layout shell',
  coverage: 'Component coverage audit',
};

export const GETTING_STARTED_STORY_NAMES = {
  startHere: 'Start here',
  componentCount: 'Component count',
  stylingModes: 'Styling modes',
} as const;

function navigateStorybookToStory(storyId: string): void {
  const targetWindow = window.top ?? window;
  const url = new URL(targetWindow.location.href);
  url.searchParams.set('path', `/story/${storyId}`);
  targetWindow.location.href = url.toString();
}

export function navigateToPaletteGroupStory(groupId: string): void {
  const storyName = PALETTE_GROUP_STORY_NAMES[groupId];
  if (storyName) {
    linkTo(STORY_TITLE_COMPONENTS, storyName)();
    return;
  }
  const storyId = PALETTE_GROUP_STORY_IDS[groupId];
  if (storyId) {
    navigateStorybookToStory(storyId);
  }
}

export function navigateToMetaComposition(compositionId: string): void {
  const storyName = META_COMPOSITION_STORY_NAMES[compositionId];
  if (storyName) {
    linkTo(STORY_TITLE_META_COMPONENTS, storyName)();
    return;
  }
  const storyId = META_COMPOSITION_STORY_IDS[compositionId];
  if (storyId) {
    navigateStorybookToStory(storyId);
  }
}

export function navigateToGettingStartedStory(storyName: string): void {
  linkTo(STORY_TITLE_GETTING_STARTED, storyName)();
}

export function navigateToPaletteAllComponents(): void {
  linkTo(STORY_TITLE_COMPONENTS, PALETTE_ALL_COMPONENTS_STORY)();
}

export function wireStorybookNavigation(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-nav-group]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      const groupId = el.getAttribute('data-nav-group');
      if (groupId) {
        navigateToPaletteGroupStory(groupId);
      }
    });
  });

  root.querySelectorAll<HTMLElement>('[data-nav-meta-composition]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      const compositionId = el.getAttribute('data-nav-meta-composition');
      if (compositionId) {
        navigateToMetaComposition(compositionId);
      }
    });
  });

  root.querySelectorAll<HTMLElement>('[data-nav-palette-all]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      navigateToPaletteAllComponents();
    });
  });

  root.querySelectorAll<HTMLElement>('[data-nav-getting-started]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      const storyName = el.getAttribute('data-nav-getting-started');
      if (storyName) {
        navigateToGettingStartedStory(storyName);
      }
    });
  });
}
