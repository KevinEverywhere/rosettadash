export interface AuthoringOutputPreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const AUTHORING_OUTPUT_PRESETS: AuthoringOutputPreset[] = [
  { id: '320x240', label: '320×240 (4:3)', width: 320, height: 240 },
  { id: '640x360', label: '640×360 (16:9)', width: 640, height: 360 },
  { id: '720x480', label: '720×480 (3:2)', width: 720, height: 480 },
];

export const AUTHORING_OUTPUT_CUSTOM_ID = 'custom';

export function getAuthoringOutputPreset(id: string): AuthoringOutputPreset | undefined {
  return AUTHORING_OUTPUT_PRESETS.find((entry) => entry.id === id);
}
