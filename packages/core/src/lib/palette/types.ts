export interface PaletteGroupDefinition {
  /** Stable id for accordion state and test ids */
  id: string;
  label: string;
  /** Component type keys in display order; 2–7 items per group */
  types: string[];
}

export interface ResolvedPaletteGroup {
  id: string;
  label: string;
  items: import('../model/types').ComponentDefinition[];
}
