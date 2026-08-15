import type { Destination } from '../types.js';
import { getAuthoringExampleForDestinationId } from './authoring-examples.js';
import { MOCK_DESTINATIONS } from './destinations.js';

export function isEquirectDestination(dest: Destination | undefined): boolean {
  return dest?.videoProjection === 'equirect' || Boolean(dest?.equirectVideoUrl);
}

export function destinationHasFlatVideo(dest: Destination | undefined): boolean {
  return Boolean(dest?.youtubeId) && !isEquirectDestination(dest);
}

export function destinationHasEquirectVideo(dest: Destination | undefined): boolean {
  if (!dest || !isEquirectDestination(dest)) {
    return false;
  }
  return Boolean(getAuthoringExampleForDestinationId(dest.id)?.sourceVideoUrl ?? dest.equirectVideoUrl);
}

export const FLAT_VIDEO_DESTINATIONS = MOCK_DESTINATIONS.filter(destinationHasFlatVideo);

export const EQUIRECT_VIDEO_DESTINATIONS = MOCK_DESTINATIONS.filter(destinationHasEquirectVideo);

export function resolveEquirectSourceVideoUrl(dest: Destination | undefined): string | undefined {
  if (!dest) {
    return undefined;
  }
  const example = getAuthoringExampleForDestinationId(dest.id);
  return example?.sourceVideoUrl ?? dest.equirectVideoUrl;
}

export function resolveAuthoringExampleIdForDestination(destId: string): string | undefined {
  return getAuthoringExampleForDestinationId(destId)?.id;
}

export function getAuthoringExampleForDestination(dest: Destination | undefined) {
  if (!dest) {
    return undefined;
  }
  return getAuthoringExampleForDestinationId(dest.id);
}
