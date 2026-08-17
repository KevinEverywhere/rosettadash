/** Default camera framing preset when Authoring opens for a destination (upload-first — no autoload). */
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
      'Reference equirectangular framing preset — upload a 2:1 source, explore in the sphere viewport, record a trim range, and extract with ffmpeg.wasm.',
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

export function getAuthoringExampleForDestinationId(
  destinationId: string,
): AuthoringExample | undefined {
  return DESTINATION_ATLAS_AUTHORING_EXAMPLES.find((entry) => entry.destinationId === destinationId);
}
