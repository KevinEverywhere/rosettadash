/** Shipped authoring example — equirect WASM crop/extract reference (Cusco). */
export interface AuthoringExample {
  id: string;
  destinationId: string;
  label: string;
  summary: string;
  projection: 'equirect' | 'flat';
  defaultYaw: number;
  defaultPitch: number;
  defaultHorizontalFov: number;
  outputWidth: number;
  outputHeight: number;
}

export const DESTINATION_ATLAS_AUTHORING_EXAMPLES: AuthoringExample[] = [
  {
    id: 'cusco-plaza-360',
    destinationId: 'cusco',
    label: 'Cusco plaza (360° equirect)',
    summary:
      'Reference equirectangular workflow — load a local 360° MP4/WebM, frame a rectilinear subsection, and extract with ffmpeg.wasm.',
    projection: 'equirect',
    defaultYaw: 25,
    defaultPitch: -8,
    defaultHorizontalFov: 75,
    outputWidth: 1280,
    outputHeight: 720,
  },
];

export const DEFAULT_AUTHORING_EXAMPLE_ID = DESTINATION_ATLAS_AUTHORING_EXAMPLES[0]?.id ?? 'cusco-plaza-360';

export function getAuthoringExampleById(id: string): AuthoringExample | undefined {
  return DESTINATION_ATLAS_AUTHORING_EXAMPLES.find((entry) => entry.id === id);
}
