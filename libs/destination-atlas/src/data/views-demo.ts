import type { Destination } from '../types.js';

/** YouTube poster thumbnail when no custom image is set. */
export function destinationThumbnailUrl(dest: Destination): string {
  if (dest.youtubeId) {
    return `https://img.youtube.com/vi/${dest.youtubeId}/hqdefault.jpg`;
  }
  if (dest.equirectUrl) {
    return dest.equirectUrl;
  }
  return '/media/placeholder-destination.jpg';
}

export interface SankeyNode {
  id: string;
  label: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

/** Travel journey: portal → package choice → itineraries → exit channels. */
export const TRAVEL_JOURNEY_SANKEY: { nodes: SankeyNode[]; links: SankeyLink[] } = {
  nodes: [
    { id: 'portal', label: 'Travel portal' },
    { id: 'research', label: 'Research & compare' },
    { id: 'package', label: 'Package selected' },
    { id: 'tokyo', label: 'Tokyo itinerary' },
    { id: 'paris', label: 'Paris itinerary' },
    { id: 'custom', label: 'Custom route' },
    { id: 'app', label: 'App re-engagement' },
    { id: 'email', label: 'Email follow-up' },
    { id: 'none', label: 'No further contact' },
  ],
  links: [
    { source: 'portal', target: 'research', value: 12000 },
    { source: 'research', target: 'package', value: 8200 },
    { source: 'package', target: 'tokyo', value: 3100 },
    { source: 'package', target: 'paris', value: 2800 },
    { source: 'package', target: 'custom', value: 2300 },
    { source: 'tokyo', target: 'app', value: 1400 },
    { source: 'tokyo', target: 'email', value: 900 },
    { source: 'tokyo', target: 'none', value: 800 },
    { source: 'paris', target: 'app', value: 1100 },
    { source: 'paris', target: 'email', value: 950 },
    { source: 'paris', target: 'none', value: 750 },
    { source: 'custom', target: 'app', value: 800 },
    { source: 'custom', target: 'email', value: 700 },
    { source: 'custom', target: 'none', value: 800 },
  ],
};

export interface VennSet {
  id: string;
  label: string;
  count: number;
}

export interface VennOverlap {
  setIds: string[];
  count: number;
  label?: string;
}

/** Travel interest overlap among mock traveler segments. */
export const TRAVEL_INTEREST_VENN: { sets: VennSet[]; overlaps: VennOverlap[] } = {
  sets: [
    { id: 'culture', label: 'Culture & museums', count: 4200 },
    { id: 'adventure', label: 'Adventure & outdoors', count: 3100 },
    { id: 'food', label: 'Food & culinary', count: 2800 },
  ],
  overlaps: [
    { setIds: ['culture', 'adventure'], count: 680, label: 'Culture ∩ Adventure' },
    { setIds: ['culture', 'food'], count: 920, label: 'Culture ∩ Food' },
    { setIds: ['adventure', 'food'], count: 540, label: 'Adventure ∩ Food' },
    { setIds: ['culture', 'adventure', 'food'], count: 210, label: 'All three' },
  ],
};
