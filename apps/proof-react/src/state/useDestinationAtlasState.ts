import { useEffect, useMemo, useState } from 'react';
import type { DestinationAtlasScreenId, GeoMapProvider } from '@destination-atlas';
import type { AtlasUserRole } from '../lib/roles';
import { screenAllowedForRole } from '../lib/roles';

export interface DestinationAtlasState {
  screen: DestinationAtlasScreenId;
  selectedId: string;
  locale: string;
  mapProvider: GeoMapProvider;
  newsQuery: string;
  newsRegion: string;
  selectedArticleId: string;
  mapTabId: 'map' | 'list';
  mapLocationQuery: string;
  mapViewOverride: { lat: number; lng: number; zoom: number; label: string } | null;
  destSearch: string;
  destRegion: string;
  timePreset: string;
  visitPeriodStart: string;
  visitPeriodEnd: string;
  userRole: AtlasUserRole;
  highlightTarget: 'locale' | null;
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
  setMapLocationQuery: (query: string) => void;
  focusDestinationOnMap: (id: string) => void;
  goToMapView: (view: { lat: number; lng: number; zoom: number; label: string }) => void;
  setDestSearch: (query: string) => void;
  setDestRegion: (region: string) => void;
  setTimePreset: (preset: string) => void;
  setVisitPeriod: (range: { startDate: string; endDate: string }) => void;
  setUserRole: (role: AtlasUserRole) => void;
  setHighlightTarget: (target: 'locale' | null) => void;
} {
  const [screen, setScreen] = useState<DestinationAtlasScreenId>('overview');
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [locale, setLocale] = useState('en');
  const [mapProvider, setMapProvider] = useState<GeoMapProvider>('leaflet');
  const [newsQuery, setNewsQuery] = useState('');
  const [newsRegion, setNewsRegion] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [mapTabId, setMapTabId] = useState<'map' | 'list'>('map');
  const [mapLocationQuery, setMapLocationQuery] = useState('');
  const [mapViewOverride, setMapViewOverride] = useState<{
    lat: number;
    lng: number;
    zoom: number;
    label: string;
  } | null>(null);
  const [destSearch, setDestSearch] = useState('');
  const [destRegion, setDestRegion] = useState('');
  const [timePreset, setTimePreset] = useState('5y');
  const [visitPeriodStart, setVisitPeriodStart] = useState('2019-01');
  const [visitPeriodEnd, setVisitPeriodEnd] = useState('2024-12');
  const [userRole, setUserRole] = useState<AtlasUserRole>('viewer');
  const [highlightTarget, setHighlightTarget] = useState<'locale' | null>(null);

  const setVisitPeriod = (range: { startDate: string; endDate: string }) => {
    setVisitPeriodStart(range.startDate);
    setVisitPeriodEnd(range.endDate);
  };

  const focusDestinationOnMap = (id: string) => {
    setSelectedId(id);
    setMapViewOverride(null);
    setMapLocationQuery('');
    setMapTabId('map');
    setScreen('map');
  };

  const goToMapView = (view: { lat: number; lng: number; zoom: number; label: string }) => {
    setMapViewOverride(view);
    setMapTabId('map');
    setScreen('map');
  };

  useEffect(() => {
    if (!screenAllowedForRole(screen, userRole)) {
      setScreen('overview');
    }
  }, [screen, userRole]);

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
      mapLocationQuery,
      mapViewOverride,
      destSearch,
      destRegion,
      timePreset,
      visitPeriodStart,
      visitPeriodEnd,
      userRole,
      highlightTarget,
      setScreen,
      setSelectedId,
      setLocale,
      setMapProvider,
      setNewsQuery,
      setNewsRegion,
      setSelectedArticleId,
      setMapTabId,
      setMapLocationQuery,
      focusDestinationOnMap,
      goToMapView,
      setDestSearch,
      setDestRegion,
      setTimePreset,
      setVisitPeriod,
      setUserRole,
      setHighlightTarget,
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
      mapLocationQuery,
      mapViewOverride,
      destSearch,
      destRegion,
      timePreset,
      visitPeriodStart,
      visitPeriodEnd,
      userRole,
      highlightTarget,
    ],
  );
}

export type AtlasContext = ReturnType<typeof useDestinationAtlasState>;
