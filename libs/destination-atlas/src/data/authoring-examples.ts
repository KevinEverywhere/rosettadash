/** Shipped authoring example — equirect WASM crop/extract reference (Cusco). */
export interface AuthoringExample {
  id: string;
  destinationId: string;
  label: string;
  summary: string;
  projection: 'equirect' | 'flat';
  /** Shipped sample video URL (must be CORS-readable for in-browser sphere preview). */
  sourceVideoUrl?: string;
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
      'Reference equirectangular workflow — explore the plaza in the sphere viewport, frame a rectilinear subsection, and extract with ffmpeg.wasm.',
    projection: 'equirect',
    sourceVideoUrl: '/media/cusco-plaza-360.webm',
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
