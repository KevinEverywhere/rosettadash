import type { MapsPanelId } from '@rosettadash/core';

type Props = {
  panel: MapsPanelId;
  onSelectPanel: (panel: MapsPanelId) => void;
};

const PANELS: Array<{ id: MapsPanelId; label: string; align: 'left' | 'right' }> = [
  { id: 'map', label: 'Map', align: 'left' },
  { id: 'globe', label: 'Globe', align: 'right' },
];

export function MapsPanelNav({ panel, onSelectPanel }: Props) {
  return (
    <nav className="da-tabbar da-maps-tabbar" aria-label="Map views">
      {PANELS.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className={`da-tabbar__tab da-tabbar__tab--${entry.align}`}
          aria-current={panel === entry.id ? 'page' : undefined}
          onClick={() => onSelectPanel(entry.id)}
        >
          {entry.label}
        </button>
      ))}
    </nav>
  );
}
