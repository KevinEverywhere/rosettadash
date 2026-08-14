import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface EquirectGlobeMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

export interface EquirectGlobeProps {
  title?: string;
  /** Equirectangular 2:1 world texture (lat/lng mapped to image x/y). */
  imageUrl: string;
  imageAttribution?: string;
  markers?: EquirectGlobeMarker[];
  selectedId?: string;
  onMarkerSelect?: (id: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function project(lat: number, lng: number, width: number, height: number): { x: number; y: number } {
  return {
    x: ((lng + 180) / 360) * width,
    y: ((90 - lat) / 180) * height,
  };
}

/** @rosettadash/react/visual/display/equirect-globe — equirectangular globe with marker overlay */
export const EquirectGlobe = forwardRef<HTMLElement, EquirectGlobeProps>(function EquirectGlobe(
  {
    title = 'Equirectangular globe',
    imageUrl,
    imageAttribution,
    markers = [],
    selectedId,
    onMarkerSelect,
    className,
    style,
    children,
  },
  ref,
) {
  const rootClass = ['rd-equirect-globe', className].filter(Boolean).join(' ');
  const width = 720;
  const height = 360;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={rootClass}
      style={style}
      data-testid="rd-equirect-globe"
      aria-label={title}
    >
      <div className="rd-equirect-globe__viewport">
        <img
          className="rd-equirect-globe__image"
          src={imageUrl}
          alt={title}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
        <svg
          className="rd-equirect-globe__markers"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-hidden={markers.length === 0}
        >
          {markers.map((marker) => {
            const { x, y } = project(marker.lat, marker.lng, width, height);
            const selected = marker.id === selectedId;
            return (
              <g
                key={marker.id}
                className="rd-equirect-globe__marker"
                style={{ cursor: onMarkerSelect ? 'pointer' : undefined }}
                onClick={onMarkerSelect ? () => onMarkerSelect(marker.id) : undefined}
                onKeyDown={
                  onMarkerSelect
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onMarkerSelect(marker.id);
                        }
                      }
                    : undefined
                }
                role={onMarkerSelect ? 'button' : undefined}
                tabIndex={onMarkerSelect ? 0 : undefined}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={selected ? 7 : 5}
                  fill={selected ? '#fbbf24' : '#ef4444'}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                <title>{marker.label ?? marker.id}</title>
              </g>
            );
          })}
        </svg>
      </div>
      {imageAttribution ? (
        <p className="rd-equirect-globe__attribution">{imageAttribution}</p>
      ) : null}
      {children}
    </section>
  );
});
