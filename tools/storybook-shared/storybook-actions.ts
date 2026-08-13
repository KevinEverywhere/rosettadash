/** Custom events surfaced in the Storybook Actions panel (bubbles to canvas). */
export const ROSETTADASH_STORYBOOK_ACTION_HANDLES = [
  'rd-accordion-toggle',
  'rd-accordion-link-list-toggle',
  'rd-table-row-select',
  'crop-region',
  'video-file',
  'metadata',
  'progress',
  'extract-complete',
] as const;

export const storybookActionsParameters = {
  actions: {
    handles: [...ROSETTADASH_STORYBOOK_ACTION_HANDLES],
  },
} as const;

/** Aggregate catalog pages — no per-story args; hide empty Controls/Actions chrome. */
export const storybookAggregateStoryParameters = {
  controls: { disable: true },
  actions: { disable: true },
} as const;
