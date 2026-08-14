export interface TimePresetPreset {
  id: string;
  label: string;
}

export interface TimePresetProps {
  label?: string;
  presets?: TimePresetPreset[];
  activePresetId?: string;
  onPresetChange?: (presetId: string) => void;
  className?: string;
}
