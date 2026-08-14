import { forwardRef, type CSSProperties } from 'react';

export interface VideoMetadataItem {
  label: string;
  value: string;
}

export interface VideoMetadataPanelProps {
  title?: string;
  items: VideoMetadataItem[];
  className?: string;
  style?: CSSProperties;
}

/** @rosettadash/react/visual/media/video-metadata — flat video characteristics panel */
export const VideoMetadataPanel = forwardRef<HTMLElement, VideoMetadataPanelProps>(
  function VideoMetadataPanel({ title = 'Video characteristics', items, className, style }, ref) {
    const rootClass = ['rd-video-metadata', className].filter(Boolean).join(' ');

    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className={rootClass}
        style={style}
        data-testid="rd-video-metadata"
      >
        <h3 className="rd-video-metadata__title">{title}</h3>
        <dl className="rd-video-metadata__list">
          {items.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  },
);
