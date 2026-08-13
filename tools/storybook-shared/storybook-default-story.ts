import { addons } from 'storybook/manager-api';
import { STORY_SPECIFIED } from 'storybook/internal/core-events';

/** Default canvas route when Storybook opens without a story in the URL. */
export const ROSETTADASH_DEFAULT_STORY_ID = 'getting-started--start-here';

function hasExplicitStoryPath(): boolean {
  const queryPath = new URLSearchParams(window.location.search).get('path') ?? '';
  return /\/story\/[^/?&]+/.test(queryPath) || /\/docs\/[^/?&]+/.test(queryPath);
}

/** Land on Start here when the manager loads without a story path query param. */
export function registerRosettaDashDefaultStory(
  storyId: string = ROSETTADASH_DEFAULT_STORY_ID,
): void {
  addons.register('rosettadash/default-story', (api) => {
    let handledInitialRoute = false;

    api.on(STORY_SPECIFIED, () => {
      if (handledInitialRoute) {
        return;
      }
      handledInitialRoute = true;

      if (hasExplicitStoryPath()) {
        return;
      }

      if (api.getData(storyId)) {
        api.selectStory(storyId);
      }
    });
  });
}
