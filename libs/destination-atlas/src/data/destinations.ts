import type { Destination } from '../types.js';

/** Sample destinations — current + historic visitor data for proof apps. */
export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    region: 'asia-pacific',
    lat: 35.6762,
    lng: 139.6503,
    youtubeId: 'yk4eWjYVNIg',
    visitorsCurrent: 15_800_000,
    visitorsHistoric: [
      { year: 2019, visitors: 14_240_000 },
      { year: 2022, visitors: 6_310_000 },
      { year: 2024, visitors: 15_800_000 },
    ],
    labels: { es: 'Tokio', fr: 'Tokyo', ja: '東京' },
  },
  {
    id: 'paris',
    name: 'Paris',
    region: 'europe',
    lat: 48.8566,
    lng: 2.3522,
    youtubeId: 'AQ6GyFzxQ40',
    visitorsCurrent: 12_100_000,
    visitorsHistoric: [
      { year: 2019, visitors: 19_100_000 },
      { year: 2022, visitors: 8_900_000 },
      { year: 2024, visitors: 12_100_000 },
    ],
    labels: { es: 'París', fr: 'Paris' },
  },
  {
    id: 'cusco',
    name: 'Cusco',
    region: 'americas',
    lat: -13.5319,
    lng: -71.9675,
    youtubeId: '6n3KlH8LStE',
    equirectUrl: '/media/cusco-plaza-360.jpg',
    visitorsCurrent: 1_450_000,
    visitorsHistoric: [
      { year: 2019, visitors: 1_620_000 },
      { year: 2022, visitors: 420_000 },
      { year: 2024, visitors: 1_450_000 },
    ],
    labels: { es: 'Cuzco' },
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    region: 'africa',
    lat: 31.6295,
    lng: -7.9811,
    youtubeId: '3OaMrWAsS6E',
    visitorsCurrent: 2_900_000,
    visitorsHistoric: [
      { year: 2019, visitors: 2_400_000 },
      { year: 2022, visitors: 1_100_000 },
      { year: 2024, visitors: 2_900_000 },
    ],
  },
  {
    id: 'sydney',
    name: 'Sydney',
    region: 'asia-pacific',
    lat: -33.8688,
    lng: 151.2093,
    youtubeId: 'qQ3MIGeE3lo',
    visitorsCurrent: 4_200_000,
    visitorsHistoric: [
      { year: 2019, visitors: 4_800_000 },
      { year: 2022, visitors: 1_900_000 },
      { year: 2024, visitors: 4_200_000 },
    ],
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
