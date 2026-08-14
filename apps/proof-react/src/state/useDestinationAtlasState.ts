import { useMemo, useState } from 'react';
import type { DestinationAtlasScreenId, GeoMapProvider } from '@destination-atlas';

export interface DestinationAtlasState {
  screen: DestinationAtlasScreenId;
  selectedId: string;
  locale: string;
  mapProvider: GeoMapProvider;
  newsQuery: string;
  newsRegion: string;
  selectedArticleId: string;
  mapTabId: 'map' | 'list';
  destSearch: string;
  destRegion: string;
  timePreset: string;
}

export function useDestinationAtlasState(initialSelectedId: string): DestinationAtlasState & {
  setScreen: (screen: DestinationAtlasScreenId) => void;
  setSelectedId: (id: string) => void;
  setLocale: (locale: string) => void;
  setMapProvider: (provider: GeoMapProvider) => void;
  setNewsQuery: (query: string) => void;
  setNewsRegion: (region: string) => void;
  setSelectedArticleId: (id: string) => void;
  setMapTabId: (tabId: 'map' | 'list') => void;
  setDestSearch: (query: string) => void;
  setDestRegion: (region: string) => void;
  setTimePreset: (preset: string) => void;
} {
  const [screen, setScreen] = useState<DestinationAtlasScreenId>('overview');
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [locale, setLocale] = useState('en');
  const [mapProvider, setMapProvider] = useState<GeoMapProvider>('maplibre');
  const [newsQuery, setNewsQuery] = useState('');
  const [newsRegion, setNewsRegion] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [mapTabId, setMapTabId] = useState<'map' | 'list'>('map');
  const [destSearch, setDestSearch] = useState('');
  const [destRegion, setDestRegion] = useState('');
  const [timePreset, setTimePreset] = useState('5y');

  return useMemo(
    () => ({
      screen,
      selectedId,
      locale,
      mapProvider,
      newsQuery,
      newsRegion,
      selectedArticleId,
      mapTabId,
      destSearch,
      destRegion,
      timePreset,
      setScreen,
      setSelectedId,
      setLocale,
      setMapProvider,
      setNewsQuery,
      setNewsRegion,
      setSelectedArticleId,
      setMapTabId,
      setDestSearch,
      setDestRegion,
      setTimePreset,
    }),
    [
      screen,
      selectedId,
      locale,
      mapProvider,
      newsQuery,
      newsRegion,
      selectedArticleId,
      mapTabId,
      destSearch,
      destRegion,
      timePreset,
    ],
  );
}

export type AtlasContext = ReturnType<typeof useDestinationAtlasState>;
