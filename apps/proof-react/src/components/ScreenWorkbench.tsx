import { useState, type ReactNode } from 'react';

interface Props {
  source: string;
  children: ReactNode;
  /** When true, preview pane allows the designated ScrollRegion to scroll (About tab only). */
  scrollablePreview?: boolean;
}

export function ScreenWorkbench({ source, children, scrollablePreview = false }: Props) {
  const [mobileView, setMobileView] = useState<'preview' | 'source'>('preview');

  return (
    <div className="da-workbench">
      <div className="da-workbench__mobile-toggle" role="tablist" aria-label="Preview or source">
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === 'preview'}
          className={mobileView === 'preview' ? 'is-active' : undefined}
          onClick={() => setMobileView('preview')}
        >
          Atlas preview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === 'source'}
          className={mobileView === 'source' ? 'is-active' : undefined}
          onClick={() => setMobileView('source')}
        >
          Component source
        </button>
      </div>
      <div className="da-workbench__split">
        <div
          className={[
            'da-workbench__preview',
            scrollablePreview ? 'da-workbench__preview--scroll' : '',
            mobileView === 'source' ? 'da-workbench__pane--hidden-mobile' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
        <aside
          className={[
            'da-workbench__source',
            mobileView === 'preview' ? 'da-workbench__pane--hidden-mobile' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Component source"
        >
          <header className="da-workbench__source-header">
            <h3>Component source</h3>
            <p>React components, props, and nested structure for this screen.</p>
          </header>
          <pre className="da-workbench__code">
            <code>{source}</code>
          </pre>
        </aside>
      </div>
    </div>
  );
}
