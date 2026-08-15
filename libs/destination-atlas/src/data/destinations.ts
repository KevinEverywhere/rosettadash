import type { Destination } from '../types.js';

/** Sample destinations — current + historic visitor data for proof apps. */
export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    region: 'asia-pacific',
    lat: 35.6762,
    lng: 139.6503,
    youtubeId: 'D6RjVfUym6Q',
    visitorsCurrent: 15_800_000,
    visitorsHistoric: [
      { year: 2019, visitors: 14_240_000 },
      { year: 2022, visitors: 6_310_000 },
      { year: 2024, visitors: 15_800_000 },
    ],
    labels: { es: 'Tokio', fr: 'Tokyo', ja: '東京' },
    travelRating: 4.8,
    hubDistanceKm: 40,
    avgTripPriceUsd: 3200,
  },
  {
    id: 'paris',
    name: 'Paris',
    region: 'europe',
    lat: 48.8566,
    lng: 2.3522,
    youtubeId: '_XwP2ldJOJs',
    visitorsCurrent: 12_100_000,
    visitorsHistoric: [
      { year: 2019, visitors: 19_100_000 },
      { year: 2022, visitors: 8_900_000 },
      { year: 2024, visitors: 12_100_000 },
    ],
    labels: { es: 'París', fr: 'Paris' },
    travelRating: 4.6,
    hubDistanceKm: 25,
    avgTripPriceUsd: 2800,
  },
  {
    id: 'cusco',
    name: 'Cusco',
    region: 'americas',
    lat: -13.5319,
    lng: -71.9675,
    youtubeId: '1La4QzGeaaQ',
    videoProjection: 'equirect',
    equirectUrl: '/media/cusco-plaza-360.jpg',
    equirectVideoUrl: '/media/cusco-plaza-360.webm',
    visitorsCurrent: 1_450_000,
    visitorsHistoric: [
      { year: 2019, visitors: 1_620_000 },
      { year: 2022, visitors: 420_000 },
      { year: 2024, visitors: 1_450_000 },
    ],
    labels: { es: 'Cuzco' },
    travelRating: 4.7,
    hubDistanceKm: 5800,
    avgTripPriceUsd: 2400,
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    region: 'africa',
    lat: 31.6295,
    lng: -7.9811,
    youtubeId: 'BKQTQzECCzc',
    visitorsCurrent: 2_900_000,
    visitorsHistoric: [
      { year: 2019, visitors: 2_400_000 },
      { year: 2022, visitors: 1_100_000 },
      { year: 2024, visitors: 2_900_000 },
    ],
    travelRating: 4.5,
    hubDistanceKm: 2100,
    avgTripPriceUsd: 1900,
  },
  {
    id: 'sydney',
    name: 'Sydney',
    region: 'asia-pacific',
    lat: -33.8688,
    lng: 151.2093,
    youtubeId: '_9g4OLdUkvU',
    visitorsCurrent: 4_200_000,
    visitorsHistoric: [
      { year: 2019, visitors: 4_800_000 },
      { year: 2022, visitors: 1_900_000 },
      { year: 2024, visitors: 4_200_000 },
    ],
    travelRating: 4.4,
    hubDistanceKm: 8800,
    avgTripPriceUsd: 4100,
  },
  {
    id: 'new-york',
    name: 'New York City',
    region: 'americas',
    lat: 40.7128,
    lng: -74.006,
    youtubeId: 'AdIwEvr6-vk',
    visitorsCurrent: 13_300_000,
    visitorsHistoric: [
      { year: 2019, visitors: 13_500_000 },
      { year: 2022, visitors: 8_200_000 },
      { year: 2024, visitors: 13_300_000 },
    ],
    labels: { es: 'Nueva York', fr: 'New York' },
    travelRating: 4.3,
    hubDistanceKm: 15,
    avgTripPriceUsd: 2600,
  },
];

export function getDestinationById(id: string): Destination | undefined {
  return MOCK_DESTINATIONS.find((d) => d.id === id);
}

export function formatVisitorCount(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(0)}K`;
  }
  return String(n);
}
