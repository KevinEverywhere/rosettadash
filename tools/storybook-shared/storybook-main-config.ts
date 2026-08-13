/** Explicit story glob order — used as fallback when storySort is unavailable. */
export const rosettadashStorybookStories = [
  '../src/getting-started/**/*.stories.@(js|jsx|ts|tsx)',
  '../src/catalog/components-catalog.stories.@(js|jsx|ts|tsx)',
  '../src/catalog/meta-components.stories.@(js|jsx|ts|tsx)',
] as const;
